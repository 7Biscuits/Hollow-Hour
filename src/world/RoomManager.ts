import Phaser from 'phaser';
import { MANSION_ROOMS, RoomDefinition } from './MansionData';
import { InteractiveObject } from '../entities/InteractiveObject';
import { Detective } from '../entities/Detective';
import { LightingSystem } from './LightingSystem';
import { InteractionUI } from '../ui/InteractionUI';
import { AudioManager } from '../audio/AudioManager';
import { NotebookSystem } from '../systems/NotebookSystem';
import { StoryManager } from '../systems/StoryManager';
import { CharacterManager } from './CharacterManager';
import { NPC } from '../entities/NPC';

export class RoomManager {
  private scene: Phaser.Scene;
  private currentRoomId = 'entrance_hall';
  private currentRoomDef!: RoomDefinition;
  private floorTiles: Phaser.GameObjects.Image[] = [];
  private wallTiles: Phaser.GameObjects.Image[] = [];
  private interactiveObjects: InteractiveObject[] = [];
  private wallGroup: Phaser.Physics.Arcade.StaticGroup;
  private objectGroup: Phaser.Physics.Arcade.StaticGroup;
  private lighting: LightingSystem;
  private ui: InteractionUI;
  private audioManager: AudioManager;
  private characterManager: CharacterManager;
  private isTransitioning = false;
  public onRoomLoaded?: (roomId: string) => void;

  constructor(scene: Phaser.Scene, lighting: LightingSystem, ui: InteractionUI) {
    this.scene = scene;
    this.lighting = lighting;
    this.ui = ui;
    this.audioManager = AudioManager.getInstance();
    this.characterManager = new CharacterManager(scene);
    this.wallGroup = scene.physics.add.staticGroup();
    this.objectGroup = scene.physics.add.staticGroup();
  }

  public getCurrentRoom(): RoomDefinition {
    return this.currentRoomDef;
  }

  public getInteractiveObjects(): InteractiveObject[] {
    return this.interactiveObjects;
  }

  public getNPCs(): NPC[] {
    return this.characterManager.getActiveNpcs();
  }

  public loadRoom(roomId: string, player: Detective, spawnPos?: { x: number; y: number }): void {
    const room = MANSION_ROOMS[roomId];
    if (!room) {
      console.error(`Room definition not found for: ${roomId}`);
      return;
    }

    this.currentRoomId = roomId;
    this.currentRoomDef = room;

    this.clearRoom();

    const roomX = (640 - room.width) / 2;
    const roomY = (360 - room.height) / 2;

    this.scene.physics.world.setBounds(roomX + 16, roomY + 32, room.width - 32, room.height - 44);

    // 1. Render Floor Tiles
    for (let x = roomX; x < roomX + room.width; x += 32) {
      for (let y = roomY + 24; y < roomY + room.height; y += 32) {
        const tile = this.scene.add.image(x + 16, y + 16, room.floorTile);
        tile.setDepth(1);
        this.floorTiles.push(tile);
      }
    }

    // 2. Render Carpet Area
    if (room.carpetArea) {
      const cx = roomX + room.carpetArea.x;
      const cy = roomY + room.carpetArea.y;
      for (let x = cx; x < cx + room.carpetArea.w; x += 32) {
        for (let y = cy; y < cy + room.carpetArea.h; y += 32) {
          const carpet = this.scene.add.image(x + 16, y + 16, 'tile_carpet');
          carpet.setDepth(2);
          this.floorTiles.push(carpet);
        }
      }
    }

    // 3. Render North Walls
    for (let x = roomX; x < roomX + room.width; x += 32) {
      const wall = this.scene.add.image(x + 16, roomY + 24, room.wallTile);
      wall.setDepth(3);
      this.wallTiles.push(wall);
    }

    // 4. Perimeter Wall Colliders (leaving gaps at doors)
    this.createPerimeterWalls(roomX, roomY, room);

    // 5. Spawn Wall Sconces & Lights
    if (room.sconces) {
      room.sconces.forEach(sc => {
        const sx = roomX + sc.x;
        const sy = roomY + sc.y;
        const sconce = this.scene.add.image(sx, sy, 'obj_wall_sconce');
        sconce.setDepth(sy);
        this.floorTiles.push(sconce);
        this.lighting.registerLightSource(sx, sy - 4, 0.7, 0.75);
      });
    }

    // 6. Spawn Doors
    const doorsToSpawn = [...room.doors];
    const story = StoryManager.getInstance();

    if (roomId === 'library' && story.getFlag('bookshelf_puzzle_solved')) {
      doorsToSpawn.push({
        id: 'door_library_secret',
        name: 'SECRET PASSAGE TO CRYPT',
        description: 'A stone revolving doorway behind the bookshelf descending down into darkness.',
        texture: 'obj_secret_passage',
        x: 40,
        y: 65,
        isDoor: true,
        targetRoom: 'basement',
        targetSpawn: { x: 240, y: 240 },
        interactionRadius: 40
      });
    }

    if (roomId === 'basement' && story.getFlag('bookshelf_puzzle_solved')) {
      doorsToSpawn.push({
        id: 'door_basement_secret',
        name: 'SECRET PASSAGE TO LIBRARY',
        description: 'A hidden ascending stone tunnel leading up into the library.',
        texture: 'obj_secret_passage',
        x: 60,
        y: 130,
        isDoor: true,
        targetRoom: 'library',
        targetSpawn: { x: 90, y: 100 },
        interactionRadius: 40
      });
    }

    doorsToSpawn.forEach(doorCfg => {
      const doorObj = new InteractiveObject(this.scene, {
        ...doorCfg,
        x: roomX + doorCfg.x,
        y: roomY + doorCfg.y,
        interactionRadius: 65
      });
      this.interactiveObjects.push(doorObj);
      this.objectGroup.add(doorObj);
    });

    // 7. Spawn Furniture & Objects
    room.objects.forEach(objCfg => {
      const item = new InteractiveObject(this.scene, {
        ...objCfg,
        x: roomX + objCfg.x,
        y: roomY + objCfg.y,
        interactionRadius: 65
      });
      this.interactiveObjects.push(item);
      this.objectGroup.add(item);

      if (objCfg.texture === 'obj_fireplace') {
        this.lighting.registerLightSource(roomX + objCfg.x, roomY + objCfg.y + 4, 0.8, 0.8);
      }
      if (objCfg.texture === 'obj_altar') {
        this.lighting.registerLightSource(roomX + objCfg.x, roomY + objCfg.y - 6, 0.65, 0.7);
      }
      if (objCfg.texture === 'obj_cctv') {
        this.lighting.registerLightSource(roomX + objCfg.x, roomY + objCfg.y, 0.6, 0.6);
      }
    });

    // 8. Spawn Living Characters and Ghosts
    const npcs = this.characterManager.spawnCharactersForRoom(room, roomX, roomY, this.lighting);
    npcs.forEach(npc => {
      this.objectGroup.add(npc);
    });

    // 9. Position Player
    const spawn = spawnPos || room.defaultSpawn;
    player.setPosition(roomX + spawn.x, roomY + spawn.y);

    // 10. Discover room in Notebook Map
    NotebookSystem.getInstance().discoverRoom(roomId);

    // 11. Show Room Title Banner
    this.ui.showRoomBanner(room.name);

    // 12. Notify room loaded callback
    if (this.onRoomLoaded) {
      this.onRoomLoaded(roomId);
    }
  }

  private createPerimeterWalls(rx: number, ry: number, room: RoomDefinition): void {
    // Find doors on north, south, west, east borders
    const northDoor = room.doors.find(d => d.y < 90);
    const southDoor = room.doors.find(d => d.y > room.height - 90 && d.isDoor);
    const westDoor = room.doors.find(d => d.x < 90);
    const eastDoor = room.doors.find(d => d.x > room.width - 90);

    // North Wall: If door at center, split into left and right colliders
    if (northDoor) {
      const doorLeft = rx + northDoor.x - 22;
      const doorRight = rx + northDoor.x + 22;
      // Left segment
      const leftSegW = doorLeft - rx;
      if (leftSegW > 10) {
        const wallL = this.scene.add.rectangle(rx + leftSegW / 2, ry + 28, leftSegW, 16);
        this.scene.physics.add.existing(wallL, true);
        this.wallGroup.add(wallL);
      }
      // Right segment
      const rightSegW = (rx + room.width) - doorRight;
      if (rightSegW > 10) {
        const wallR = this.scene.add.rectangle(doorRight + rightSegW / 2, ry + 28, rightSegW, 16);
        this.scene.physics.add.existing(wallR, true);
        this.wallGroup.add(wallR);
      }
    } else {
      const wallN = this.scene.add.rectangle(rx + room.width / 2, ry + 28, room.width, 16);
      this.scene.physics.add.existing(wallN, true);
      this.wallGroup.add(wallN);
    }

    // South Wall
    if (southDoor) {
      const doorLeft = rx + southDoor.x - 22;
      const doorRight = rx + southDoor.x + 22;
      const leftSegW = doorLeft - rx;
      if (leftSegW > 10) {
        const wallSL = this.scene.add.rectangle(rx + leftSegW / 2, ry + room.height - 4, leftSegW, 16);
        this.scene.physics.add.existing(wallSL, true);
        this.wallGroup.add(wallSL);
      }
      const rightSegW = (rx + room.width) - doorRight;
      if (rightSegW > 10) {
        const wallSR = this.scene.add.rectangle(doorRight + rightSegW / 2, ry + room.height - 4, rightSegW, 16);
        this.scene.physics.add.existing(wallSR, true);
        this.wallGroup.add(wallSR);
      }
    } else {
      const wallS = this.scene.add.rectangle(rx + room.width / 2, ry + room.height - 4, room.width, 16);
      this.scene.physics.add.existing(wallS, true);
      this.wallGroup.add(wallS);
    }

    // West Wall
    if (westDoor) {
      const doorTop = ry + westDoor.y - 20;
      const doorBottom = ry + westDoor.y + 20;
      const topSegH = doorTop - ry;
      if (topSegH > 10) {
        const wallWT = this.scene.add.rectangle(rx + 8, ry + topSegH / 2, 16, topSegH);
        this.scene.physics.add.existing(wallWT, true);
        this.wallGroup.add(wallWT);
      }
      const botSegH = (ry + room.height) - doorBottom;
      if (botSegH > 10) {
        const wallWB = this.scene.add.rectangle(rx + 8, doorBottom + botSegH / 2, 16, botSegH);
        this.scene.physics.add.existing(wallWB, true);
        this.wallGroup.add(wallWB);
      }
    } else {
      const wallW = this.scene.add.rectangle(rx + 8, ry + room.height / 2, 16, room.height);
      this.scene.physics.add.existing(wallW, true);
      this.wallGroup.add(wallW);
    }

    // East Wall
    if (eastDoor) {
      const doorTop = ry + eastDoor.y - 20;
      const doorBottom = ry + eastDoor.y + 20;
      const topSegH = doorTop - ry;
      if (topSegH > 10) {
        const wallET = this.scene.add.rectangle(rx + room.width - 8, ry + topSegH / 2, 16, topSegH);
        this.scene.physics.add.existing(wallET, true);
        this.wallGroup.add(wallET);
      }
      const botSegH = (ry + room.height) - doorBottom;
      if (botSegH > 10) {
        const wallEB = this.scene.add.rectangle(rx + room.width - 8, doorBottom + botSegH / 2, 16, botSegH);
        this.scene.physics.add.existing(wallEB, true);
        this.wallGroup.add(wallEB);
      }
    } else {
      const wallE = this.scene.add.rectangle(rx + room.width - 8, ry + room.height / 2, 16, room.height);
      this.scene.physics.add.existing(wallE, true);
      this.wallGroup.add(wallE);
    }
  }

  public clearRoom(): void {
    this.floorTiles.forEach(t => t.destroy());
    this.floorTiles = [];

    this.wallTiles.forEach(w => w.destroy());
    this.wallTiles = [];

    this.interactiveObjects.forEach(obj => obj.destroy());
    this.interactiveObjects = [];

    this.characterManager.clear();

    this.wallGroup.clear(true, true);
    this.objectGroup.clear(true, true);
    this.lighting.clearLights();
  }

  public transitionTo(roomId: string, player: Detective, targetSpawn?: { x: number; y: number }): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    player.lockMovement(true);

    this.audioManager.playSelect();

    this.scene.cameras.main.fadeOut(220, 0, 0, 0);
    this.scene.cameras.main.once('camerafadeoutcomplete', () => {
      this.loadRoom(roomId, player, targetSpawn);
      this.scene.cameras.main.fadeIn(220, 0, 0, 0);
      this.scene.time.delayedCall(240, () => {
        player.lockMovement(false);
        this.isTransitioning = false;
      });
    });
  }

  public revealSecretPassage(): void {
    if (this.currentRoomId !== 'library') return;
    if (this.interactiveObjects.some(o => o.id === 'door_library_secret')) return;

    const roomX = (640 - this.currentRoomDef.width) / 2;
    const roomY = (360 - this.currentRoomDef.height) / 2;

    const secretDoor = new InteractiveObject(this.scene, {
      id: 'door_library_secret',
      name: 'SECRET PASSAGE TO CRYPT',
      description: 'A stone revolving doorway behind the bookshelf descending down into darkness.',
      texture: 'obj_secret_passage',
      x: roomX + 40,
      y: roomY + 65,
      isDoor: true,
      targetRoom: 'basement',
      targetSpawn: { x: 240, y: 240 },
      interactionRadius: 40
    });

    secretDoor.setAlpha(0);
    this.interactiveObjects.push(secretDoor);
    this.objectGroup.add(secretDoor);

    this.scene.tweens.add({
      targets: secretDoor,
      alpha: 1,
      duration: 600,
      ease: 'Power2'
    });

    this.scene.cameras.main.shake(300, 0.005);
  }

  public getWallGroup(): Phaser.Physics.Arcade.StaticGroup {
    return this.wallGroup;
  }

  public getObjectGroup(): Phaser.Physics.Arcade.StaticGroup {
    return this.objectGroup;
  }
}
