import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';
import { SaveManager } from '../data/SaveManager';
import { Detective } from '../entities/Detective';
import { LightingSystem } from '../world/LightingSystem';
import { InteractionUI } from '../ui/InteractionUI';
import { RoomManager } from '../world/RoomManager';
import { InteractiveObject } from '../entities/InteractiveObject';
import { NPC } from '../entities/NPC';
import { InventorySystem } from '../systems/InventorySystem';
import { NotebookSystem } from '../systems/NotebookSystem';
import { StoryManager } from '../systems/StoryManager';
import { PuzzleManager } from '../systems/PuzzleSystem';
import { InventoryUI } from '../ui/InventoryUI';
import { NotebookUI } from '../ui/NotebookUI';
import { DialogueUI } from '../ui/DialogueUI';
import { ClockPuzzleModal } from '../ui/ClockPuzzleModal';
import { BookshelfPuzzleModal } from '../ui/BookshelfPuzzleModal';
import { CCTVModal } from '../ui/CCTVModal';
import { OccultPuzzleModal } from '../ui/OccultPuzzleModal';
import { ClimaxChoiceModal } from '../ui/ClimaxChoiceModal';
import { Werewolf } from '../entities/Werewolf';
import { EndingType } from './EndingScene';

export class GameScene extends Phaser.Scene {
  private audioManager!: AudioManager;
  private saveManager!: SaveManager;
  private mode: 'new' | 'continue' = 'new';

  private player!: Detective;
  private lighting!: LightingSystem;
  private ui!: InteractionUI;
  private roomManager!: RoomManager;

  // Phase 7 Werewolf & Horror Mechanics
  private werewolf: Werewolf | null = null;
  private hidingSpotObject: InteractiveObject | null = null;
  private heartbeatTimer = 0;
  private healthText!: Phaser.GameObjects.Text;
  private bloodVignette!: Phaser.GameObjects.Image;
  private isDying = false;

  // Phase 4 Core Systems & UIs
  private inventorySystem!: InventorySystem;
  private notebookSystem!: NotebookSystem;
  private storyManager!: StoryManager;
  private puzzleManager!: PuzzleManager;

  private inventoryUI!: InventoryUI;
  private notebookUI!: NotebookUI;
  private dialogueUI!: DialogueUI;
  private clockPuzzleModal!: ClockPuzzleModal;
  private bookshelfPuzzleModal!: BookshelfPuzzleModal;
  private cctvModal!: CCTVModal;
  private occultPuzzleModal!: OccultPuzzleModal;
  private climaxChoiceModal!: ClimaxChoiceModal;

  // Phase 9: Audio & Visual Polish
  private ambientTimer = 0;
  private clockTickTimer = 0;
  private isClockTickAlternator = false;
  private creakTimer = 0;
  private lightningTimer = 0;

  private activeNearbyObject: InteractiveObject | null = null;
  private activeNearbyNPC: NPC | null = null;
  private isIntroSequence = true;
  private hudContainer!: Phaser.GameObjects.Container;

  constructor() {
    super('GameScene');
  }

  public init(data: { mode?: 'new' | 'continue' }): void {
    this.mode = data.mode || 'new';
  }

  public create(): void {
    this.audioManager = AudioManager.getInstance();
    this.saveManager = SaveManager.getInstance();
    this.audioManager.startHorrorAmbience();

    // Initialize Core Systems
    this.inventorySystem = InventorySystem.getInstance();
    this.notebookSystem = NotebookSystem.getInstance();
    this.storyManager = StoryManager.getInstance();
    this.puzzleManager = PuzzleManager.getInstance();

    if (this.mode === 'new') {
      this.inventorySystem.clear();
      this.notebookSystem.resetToDefaults();
      this.storyManager.resetToDefaults();
      this.puzzleManager.getClockPuzzle().reset();
    } else {
      this.saveManager.loadSave();
    }

    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#040306');

    // 1. World & Lighting Systems
    this.ui = new InteractionUI(this);
    this.lighting = new LightingSystem(this);
    this.roomManager = new RoomManager(this, this.lighting, this.ui);

    // 2. Modals & Gothic UIs
    this.inventoryUI = new InventoryUI(this);
    this.notebookUI = new NotebookUI(this);
    this.dialogueUI = new DialogueUI(this);
    this.clockPuzzleModal = new ClockPuzzleModal(this);
    this.bookshelfPuzzleModal = new BookshelfPuzzleModal(this);
    this.cctvModal = new CCTVModal(this);
    this.occultPuzzleModal = new OccultPuzzleModal(this);
    this.climaxChoiceModal = new ClimaxChoiceModal(this);

    // 3. Spawn Detective
    this.player = new Detective(this, width / 2, height / 2 + 60);

    // 4. Collisions
    this.physics.add.collider(this.player, this.roomManager.getWallGroup());
    this.physics.add.collider(this.player, this.roomManager.getObjectGroup());

    // 5. Input Keys
    if (this.input.keyboard) {
      // Global keydown routing for active modals
      this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
        this.handleGlobalKeyDown(event);
      });
    }

    // 6. Quick Top HUD Bar & Vignette
    this.createQuickHUD();
    this.bloodVignette = this.add.image(width / 2, height / 2, 'blood_vignette')
      .setDepth(2400)
      .setAlpha(0)
      .setScrollFactor(0);

    // Floating atmospheric dust motes
    this.add.particles(0, 0, 'particle_dust', {
      x: { min: 0, max: width },
      y: { min: 0, max: height },
      speed: { min: 3, max: 10 },
      angle: { min: 60, max: 120 },
      scale: { min: 0.6, max: 1.2 },
      alpha: { min: 0.15, max: 0.4 },
      lifespan: 6000,
      frequency: 240,
      blendMode: Phaser.BlendModes.ADD
    }).setDepth(850);

    // Werewolf room spawning listener
    this.roomManager.onRoomLoaded = (roomId: string) => {
      this.checkAndSpawnWerewolf(roomId);
    };

    // 7. Initial Room
    const startingRoom = (this.mode === 'continue' && this.saveManager.hasSave())
      ? (this.saveManager.getSave()?.location.includes('Hallway') ? 'main_hallway' : 'entrance_hall')
      : 'entrance_hall';

    if (this.mode === 'new') {
      this.showPrologueIntro(startingRoom);
    } else {
      this.isIntroSequence = false;
      this.roomManager.loadRoom(startingRoom, this.player);
      this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    this.saveManager.createSave({
      chapter: 'Chapter I: The Hollow Hour',
      location: 'Blackwood Manor - Ground Floor'
    });

    this.events.on('shutdown', () => {
      this.input.keyboard?.removeAllListeners();
    });
  }

  private createQuickHUD(): void {
    const { width } = this.scale;
    this.hudContainer = this.add.container(0, 0).setDepth(2500);

    // HUD Header Strip (Semi-transparent top bar)
    const hudBar = this.add.rectangle(width / 2, 14, width, 24, 0x070508, 0.75);
    this.hudContainer.add(hudBar);

    // Vitality / Health Indicator
    this.healthText = this.add.text(20, 14, 'VITALITY: 100%', {
      fontFamily: "'VT323', monospace",
      fontSize: '14px',
      color: '#4ade80'
    }).setOrigin(0, 0.5);
    this.hudContainer.add(this.healthText);

    // Quick Action Buttons
    const btnPockets = this.add.text(width - 230, 14, '[TAB] POCKETS', {
      fontFamily: "'VT323', monospace",
      fontSize: '13px',
      color: '#c5a07c'
    }).setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true });
    btnPockets.on('pointerdown', () => this.toggleInventory());
    btnPockets.on('pointerover', () => btnPockets.setColor('#f59e0b'));
    btnPockets.on('pointerout', () => btnPockets.setColor('#c5a07c'));

    const btnNotebook = this.add.text(width - 120, 14, '[N] NOTEBOOK', {
      fontFamily: "'VT323', monospace",
      fontSize: '13px',
      color: '#c5a07c'
    }).setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true });
    btnNotebook.on('pointerdown', () => this.toggleNotebook());
    btnNotebook.on('pointerover', () => btnNotebook.setColor('#f59e0b'));
    btnNotebook.on('pointerout', () => btnNotebook.setColor('#c5a07c'));

    const btnMenu = this.add.text(width - 35, 14, '[ESC] MENU', {
      fontFamily: "'VT323', monospace",
      fontSize: '13px',
      color: '#8d6e4f'
    }).setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true });
    btnMenu.on('pointerdown', () => this.returnToMenu());
    btnMenu.on('pointerover', () => btnMenu.setColor('#f59e0b'));
    btnMenu.on('pointerout', () => btnMenu.setColor('#8d6e4f'));

    this.hudContainer.add([btnPockets, btnNotebook, btnMenu]);
  }

  private isAnyModalOpen(): boolean {
    return (
      this.ui.getIsOpen() ||
      this.inventoryUI.getIsOpen() ||
      this.notebookUI.getIsOpen() ||
      this.dialogueUI.getIsOpen() ||
      this.clockPuzzleModal.getIsOpen() ||
      this.bookshelfPuzzleModal.getIsOpen() ||
      this.cctvModal.getIsOpen() ||
      this.occultPuzzleModal.getIsOpen() ||
      this.climaxChoiceModal.getIsOpen()
    );
  }

  private handleGlobalKeyDown(event: KeyboardEvent): void {
    if (this.isIntroSequence) return;

    // Route input to Active Modal
    if (this.climaxChoiceModal.getIsOpen()) {
      this.climaxChoiceModal.handleInput(event.key, event.code);
      event.preventDefault();
      return;
    }
    if (this.inventoryUI.getIsOpen()) {
      this.inventoryUI.handleInput(event.key, event.code);
      event.preventDefault();
      return;
    }

    if (this.notebookUI.getIsOpen()) {
      this.notebookUI.handleInput(event.key, event.code);
      event.preventDefault();
      return;
    }

    if (this.clockPuzzleModal.getIsOpen()) {
      this.clockPuzzleModal.handleInput(event.key, event.code);
      event.preventDefault();
      return;
    }

    if (this.bookshelfPuzzleModal.getIsOpen()) {
      this.bookshelfPuzzleModal.handleInput(event.key, event.code);
      event.preventDefault();
      return;
    }

    if (this.cctvModal.getIsOpen()) {
      this.cctvModal.handleInput(event.key, event.code);
      event.preventDefault();
      return;
    }

    if (this.occultPuzzleModal.getIsOpen()) {
      this.occultPuzzleModal.handleInput(event.key, event.code);
      event.preventDefault();
      return;
    }

    if (this.dialogueUI.getIsOpen()) {
      if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
        this.dialogueUI.navigateChoices(-1);
      } else if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
        this.dialogueUI.navigateChoices(1);
      } else if (event.key === 'Enter' || event.key === ' ' || event.key === 'e' || event.key === 'E' || event.code === 'KeyE' || event.code === 'Space') {
        this.dialogueUI.advance();
      } else if (event.key === 'Escape' || event.code === 'Escape') {
        this.dialogueUI.close();
      }
      event.preventDefault();
      return;
    }

    // Step out of hiding spot if player is concealed
    if (this.player.getIsHiding()) {
      if (
        event.key === 'e' || event.key === 'E' || event.code === 'KeyE' ||
        event.key === ' ' || event.code === 'Space'
      ) {
        event.preventDefault();
        this.stepOutOfHiding();
      }
      return;
    }

    // Toggle Modals when free
    if (event.key === 'Tab' || event.key === 'i' || event.key === 'I' || event.code === 'KeyI' || event.code === 'Tab') {
      event.preventDefault();
      this.toggleInventory();
      return;
    }

    if (event.key === 'n' || event.key === 'N' || event.key === 'j' || event.key === 'J' || event.code === 'KeyN' || event.code === 'KeyJ') {
      event.preventDefault();
      this.toggleNotebook();
      return;
    }

    // Modal inspection closing
    if (this.ui.getIsOpen()) {
      if (
        event.key === 'e' || event.key === 'E' || event.code === 'KeyE' ||
        event.key === ' ' || event.code === 'Space' ||
        event.key === 'Escape' || event.code === 'Escape' ||
        event.key === 'Enter' || event.code === 'Enter'
      ) {
        event.preventDefault();
        this.ui.closeModal();
        this.player.lockMovement(false);
      }
      return;
    }

    // Interaction key E
    if (event.key === 'e' || event.key === 'E' || event.code === 'KeyE') {
      if (this.activeNearbyNPC) {
        event.preventDefault();
        this.triggerNPCInteraction(this.activeNearbyNPC);
        return;
      }
      if (this.activeNearbyObject) {
        event.preventDefault();
        this.triggerInteraction(this.activeNearbyObject);
        return;
      }
    }

    if (event.key === 'Escape' || event.code === 'Escape') {
      event.preventDefault();
      this.returnToMenu();
      return;
    }
  }

  private toggleInventory(): void {
    if (this.inventoryUI.getIsOpen()) {
      this.inventoryUI.close();
      this.player.lockMovement(false);
    } else {
      if (this.isAnyModalOpen()) return;
      this.player.lockMovement(true);
      this.inventoryUI.open(
        (item) => {
          this.handleUseItem(item);
        },
        () => {
          this.player.lockMovement(false);
        }
      );
    }
  }

  private toggleNotebook(): void {
    if (this.notebookUI.getIsOpen()) {
      this.notebookUI.close();
      this.player.lockMovement(false);
    } else {
      if (this.isAnyModalOpen()) return;
      this.player.lockMovement(true);
      this.notebookUI.open(() => {
        this.player.lockMovement(false);
      });
    }
  }

  private handleUseItem(item: any): void {
    if (item.id === 'item_laudanum') {
      if (this.player.getHealth() >= this.player.getMaxHealth()) {
        this.ui.openModal('NERVES STEADY', 'Your vitality is already full. You do not need to consume laudanum right now.', [], () => {
          this.player.lockMovement(false);
        });
        return;
      }

      this.player.heal(40);
      this.inventorySystem.removeItem('item_laudanum');
      this.audioManager.playSelect();
      this.ui.openModal(
        'LAUDANUM CONSUMED',
        'You drink a measure of the bitter tincture. The tremors subside and your vital strength returns (+40 HEALTH).',
        [`Current Vitality: ${this.player.getHealth()}%`],
        () => {
          this.player.lockMovement(false);
        }
      );
      return;
    }

    if (this.activeNearbyObject) {
      if (this.activeNearbyObject.isDoor && this.activeNearbyObject.requiredKey === item.id) {
        this.storyManager.unlockDoor(this.activeNearbyObject.id);
        this.activeNearbyObject.isLocked = false;
        this.audioManager.playSelect();
        this.ui.openModal('DOOR UNLOCKED', `You inserted the ${item.name}. With a satisfying click, the heavy bolt recedes.`, [], () => {
          this.player.lockMovement(false);
        });
        return;
      }

      if (this.activeNearbyObject.id === 'grandfather_clock' && item.id === 'item_clock_hand') {
        this.puzzleManager.getClockPuzzle().insertClockHand();
        this.audioManager.playSelect();
        this.clockPuzzleModal.open(() => {
          this.player.lockMovement(false);
        });
        return;
      }

      if (this.activeNearbyObject.id === 'cctv_console' && item.id === 'item_cctv_tape') {
        this.puzzleManager.getCCTVPuzzle().insertTape();
        this.audioManager.playSelect();
        this.cctvModal.open(() => {
          this.player.lockMovement(false);
        });
        return;
      }

      if (this.activeNearbyObject.id === 'ritual_altar' && (item.id === 'item_silver_sigil' || item.id === 'item_ritual_dagger')) {
        this.audioManager.playSelect();
        this.occultPuzzleModal.open(() => {
          this.player.lockMovement(false);
        });
        return;
      }
    }

    this.ui.openModal('ITEM USED', `You hold up the ${item.name}. Nothing happens here.`, [item.examineText], () => {
      this.player.lockMovement(false);
    });
  }

  private showPrologueIntro(targetRoom: string): void {
    this.isIntroSequence = true;
    this.player.lockMovement(true);

    const { width, height } = this.scale;

    const scrim = this.add.rectangle(width / 2, height / 2, width, height, 0x040306).setDepth(2000);
    const candle = this.add.sprite(width / 2, height / 2 - 50, 'candle_anim').setDepth(2001);
    candle.play('candle_flicker').setScale(1.8);

    const glow = this.add.image(width / 2, height / 2 - 50, 'window_glow').setDepth(2000).setScale(1.1).setAlpha(0.65).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.45, to: 0.8 },
      scale: { from: 1.0, to: 1.25 },
      duration: 350,
      yoyo: true,
      repeat: -1
    });

    const title = this.add.text(width / 2, height / 2 + 10, 'PROLOGUE: THE VEILED FOYER', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#e2ccaf',
      stroke: '#3b1016',
      strokeThickness: 3,
      letterSpacing: 4
    }).setOrigin(0.5, 0.5).setDepth(2001);

    const narrative = this.add.text(width / 2, height / 2 + 50,
      'October 30th, 1892.\nThe heavy iron gates of Blackwood Manor groaned shut behind you.\nIn the silence of the hollow hour, you step into the dark...', {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '11px',
      color: '#8c7a6e',
      align: 'center',
      lineSpacing: 7
    }).setOrigin(0.5, 0.5).setDepth(2001);

    const startPrompt = this.add.text(width / 2, height - 35, '[ PRESS ANY KEY OR CLICK TO ENTER THE FOYER ]', {
      fontFamily: "'VT323', monospace",
      fontSize: '12px',
      color: '#c9965d',
      letterSpacing: 2
    }).setOrigin(0.5, 0.5).setDepth(2001);

    const advanceToGame = () => {
      this.input.off('pointerdown', advanceToGame);
      this.input.keyboard?.off('keydown', advanceToGame);

      this.audioManager.playSelect();

      this.tweens.add({
        targets: [scrim, candle, glow, title, narrative, startPrompt],
        alpha: 0,
        duration: 350,
        onComplete: () => {
          scrim.destroy();
          candle.destroy();
          glow.destroy();
          title.destroy();
          narrative.destroy();
          startPrompt.destroy();

          this.isIntroSequence = false;
          this.roomManager.loadRoom(targetRoom, this.player);
          this.player.lockMovement(false);
        }
      });
    };

    // Allow advancing after brief 50ms buffer
    this.time.delayedCall(50, () => {
      this.input.once('pointerdown', advanceToGame);
      this.input.keyboard?.once('keydown', advanceToGame);
    });
  }

  public update(time: number, delta: number): void {
    if (this.isIntroSequence) return;

    if (this.isAnyModalOpen()) {
      this.ui.hidePrompt();
      return;
    }

    this.player.update(time, delta);
    this.lighting.update(this.player);

    // Update Werewolf AI if active
    if (this.werewolf && this.werewolf.active) {
      this.werewolf.updateAI(time, delta, this.player, this.roomManager.getWallGroup(), this.lighting);
    }

    // Heartbeat audio when hiding in the presence of the Werewolf
    if (this.player.getIsHiding() && this.werewolf && this.werewolf.active) {
      this.heartbeatTimer += delta;
      if (this.heartbeatTimer >= 850) {
        this.heartbeatTimer = 0;
        this.audioManager.playHeartbeat();
      }
    } else {
      this.heartbeatTimer = 0;
    }

    // Update Vitality Indicator & Blood Vignette
    const hp = this.player.getHealth();
    this.healthText.setText(`VITALITY: ${hp}%`);
    if (hp <= 30) {
      this.healthText.setColor('#ef4444');
    } else if (hp <= 60) {
      this.healthText.setColor('#f59e0b');
    } else {
      this.healthText.setColor('#4ade80');
    }

    const targetVignetteAlpha = Math.min(0.85, (100 - hp) / 100);
    this.bloodVignette.setAlpha(targetVignetteAlpha);

    // Phase 9: Ambient horror atmosphere soundscapes & polish
    this.updateAtmospherePolish(delta);

    if (hp <= 0 && !this.isDying) {
      this.handlePlayerDeath();
      return;
    }

    this.checkInteractions();
  }

  private updateAtmospherePolish(delta: number): void {
    const curRoom = this.roomManager.getCurrentRoom();
    if (!curRoom) return;

    // 1. Entrance Hall: Grandfather Clock pendulum ticking
    if (curRoom.id === 'entrance_hall') {
      this.clockTickTimer += delta;
      if (this.clockTickTimer >= 1000) {
        this.clockTickTimer = 0;
        this.isClockTickAlternator = !this.isClockTickAlternator;
        this.audioManager.playClockTick(this.isClockTickAlternator);
      }
    } else {
      this.clockTickTimer = 0;
    }

    // 2. Sub-Cellar Crypt: Subterranean echoing water drips
    if (curRoom.id === 'basement') {
      this.ambientTimer += delta;
      if (this.ambientTimer >= 5000) {
        this.ambientTimer = 0;
        this.audioManager.playWaterDrip();
      }
    } else {
      this.ambientTimer = 0;
    }

    // 3. Wood Floorboards Creaking when running
    if (curRoom.floorTile === 'tile_floor_wood' && this.player.isRunning()) {
      this.creakTimer += delta;
      if (this.creakTimer >= 2800) {
        this.creakTimer = 0;
        if (Math.random() < 0.7) {
          this.audioManager.playFloorboardCreak();
          // Alert nearby Werewolf to creaking footsteps
          if (this.werewolf && this.werewolf.active) {
            this.werewolf.investigatePosition(this.player.x, this.player.y);
          }
        }
      }
    } else {
      this.creakTimer = 0;
    }

    // 4. Periodic Distant Sheet Lightning & Thunder
    this.lightningTimer += delta;
    if (this.lightningTimer >= 40000) {
      this.lightningTimer = 0;
      this.cameras.main.flash(180, 220, 230, 255);
      this.cameras.main.shake(160, 0.006);
      this.time.delayedCall(250, () => {
        this.audioManager.playThunder();
      });
    }
  }

  private checkInteractions(): void {
    if (this.isAnyModalOpen()) {
      this.ui.hidePrompt();
      return;
    }

    if (this.player.getIsHiding()) {
      this.ui.showPrompt('[E / SPACE] STEP OUT OF WARDROBE', this.player.x, this.player.y - 28);
      return;
    }

    const npcs = this.roomManager.getNPCs();
    let closestNpc: NPC | null = null;
    let minNpcDist = Infinity;

    for (const npc of npcs) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (dist <= npc.interactionRadius && dist < minNpcDist) {
        minNpcDist = dist;
        closestNpc = npc;
      }
    }

    const objects = this.roomManager.getInteractiveObjects();
    let closestObj: InteractiveObject | null = null;
    let minObjDist = Infinity;

    for (const obj of objects) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y);
      if (dist <= obj.interactionRadius && dist < minObjDist) {
        minObjDist = dist;
        closestObj = obj;
      }
    }

    if (closestNpc && minNpcDist <= minObjDist) {
      this.activeNearbyNPC = closestNpc;
      this.activeNearbyObject = null;
      const verb = closestNpc.isGhost ? 'COMMUNE WITH' : 'TALK TO';
      this.ui.showPrompt(`[E] ${verb} ${closestNpc.characterName.toUpperCase()}`, this.player.x, this.player.y - 28);
    } else if (closestObj) {
      this.activeNearbyObject = closestObj;
      this.activeNearbyNPC = null;
      const actionVerb = closestObj.isDoor
        ? 'OPEN'
        : closestObj.isHidingSpot
        ? 'HIDE IN'
        : closestObj.isClockPuzzle
        ? 'MANIPULATE'
        : closestObj.isBookshelfPuzzle
        ? 'INVESTIGATE'
        : closestObj.isCCTVPuzzle
        ? 'ACCESS'
        : closestObj.isOccultPuzzle
        ? (this.storyManager.getFlag('occult_altar_solved') ? 'CONFRONT' : 'ALIGN')
        : 'INSPECT';
      // Display prompt right above the player's head
      this.ui.showPrompt(`[E] ${actionVerb} ${closestObj.objectName}`, this.player.x, this.player.y - 28);
    } else {
      this.activeNearbyObject = null;
      this.activeNearbyNPC = null;
      this.ui.hidePrompt();
    }
  }

  private triggerNPCInteraction(npc: NPC): void {
    npc.onInteract();
    this.player.lockMovement(true);
    this.dialogueUI.startDialogue(npc.dialogueId, () => {
      this.player.lockMovement(false);
    });
  }

  private triggerInteraction(obj: InteractiveObject): void {
    // 1. Door Handling
    if (obj.isDoor && obj.targetRoom) {
      if (obj.isLocked && !this.storyManager.isDoorUnlocked(obj.id)) {
        if (obj.requiredKey && this.inventorySystem.hasItem(obj.requiredKey)) {
          this.storyManager.unlockDoor(obj.id);
          this.audioManager.playSelect();
          this.player.lockMovement(true);
          this.ui.openModal('DOOR UNLOCKED', `You used the key. The latch clicks smoothly open!`, [], () => {
            this.player.lockMovement(false);
            this.roomManager.transitionTo(obj.targetRoom!, this.player, obj.targetSpawn);
          });
        } else {
          this.audioManager.playDisabled();
          this.player.lockMovement(true);
          this.ui.openModal('LOCKED DOOR', obj.lockedMessage || 'The door is bolted shut from the inside.', [], () => {
            this.player.lockMovement(false);
          });
        }
        return;
      }

      this.roomManager.transitionTo(obj.targetRoom, this.player, obj.targetSpawn);
      return;
    }

    // 2. Clock Puzzle Modal
    if (obj.isClockPuzzle) {
      this.player.lockMovement(true);
      this.clockPuzzleModal.open(() => {
        this.player.lockMovement(false);
        if (this.puzzleManager.getClockPuzzle().isSolved()) {
          this.notebookSystem.completeObjective('obj_solve_clock');
          this.storyManager.setFlag('clock_puzzle_solved', true);
        }
      });
      return;
    }

    // 3. Bookshelf Puzzle Modal
    if (obj.isBookshelfPuzzle) {
      this.player.lockMovement(true);
      this.bookshelfPuzzleModal.open(() => {
        this.player.lockMovement(false);
        if (this.storyManager.getFlag('bookshelf_puzzle_solved')) {
          this.roomManager.revealSecretPassage();
          if (!this.storyManager.getFlag('victoria_murdered')) {
            this.storyManager.triggerMurder('victoria');
          }
        }
      });
      return;
    }

    // 4. CCTV Console Modal
    if (obj.isCCTVPuzzle) {
      if (obj.grantItemId && !this.inventorySystem.hasItem(obj.grantItemId)) {
        this.inventorySystem.addItem(obj.grantItemId);
      }
      this.player.lockMovement(true);
      this.cctvModal.open(() => {
        this.player.lockMovement(false);
        if (this.storyManager.getFlag('cctv_footage_reviewed')) {
          this.notebookSystem.completeObjective('obj_check_cctv');
          if (!this.storyManager.getFlag('edward_murdered')) {
            this.storyManager.triggerMurder('edward');
          }
        }
      });
      return;
    }

    // 5. Occult Altar Modal
    if (obj.isOccultPuzzle) {
      if (this.storyManager.getFlag('occult_altar_solved')) {
        this.player.lockMovement(true);
        this.climaxChoiceModal.open((ending: EndingType) => {
          this.triggerEnding(ending);
        });
        return;
      }

      if (obj.grantItemId && !this.inventorySystem.hasItem(obj.grantItemId)) {
        this.inventorySystem.addItem(obj.grantItemId);
      }
      this.player.lockMovement(true);
      this.occultPuzzleModal.open(() => {
        this.player.lockMovement(false);
        if (this.storyManager.getFlag('occult_altar_solved')) {
          this.notebookSystem.completeObjective('obj_occult_altar');
          if (!this.storyManager.getFlag('hayes_murdered')) {
            this.storyManager.triggerMurder('hayes');
            this.storyManager.setChapter('chapter_7_ritual');
          }
        }
      });
      return;
    }

    // 6. Dialogue Trigger
    if (obj.triggerDialogueId) {
      this.player.lockMovement(true);
      this.dialogueUI.startDialogue(obj.triggerDialogueId, () => {
        this.player.lockMovement(false);
      });
      return;
    }

    // 7. Hiding Spot
    if (obj.isHidingSpot) {
      this.hidingSpotObject = obj;
      this.player.setHiding(true);
      this.player.setPosition(obj.x, obj.y);
      this.audioManager.playSelect();
      this.ui.showPrompt('[E / SPACE] STEP OUT OF WARDROBE', obj.x, obj.y - 28);
      return;
    }

    // 8. Mansion Front Gates Escape (Ending C)
    if (obj.id === 'front_entrance_doors') {
      if (this.storyManager.getFlag('gates_unlocked') || this.inventorySystem.hasItem('item_gate_key')) {
        this.player.lockMovement(true);
        this.ui.openModal(
          'MANSION GATES UNLOCKED',
          'You unbolt the heavy iron chains and push open the front gates. The cold night wind hits your face. Do you flee Blackwood Manor and abandon the investigation?',
          ['Press [ENTER] to flee into the night, or [ESC] to stay.'],
          () => {
            this.triggerEnding('ash_memory');
          }
        );
        return;
      }
    }

    // 9. Clue & Item Collection
    if (obj.grantClueId && !this.notebookSystem.hasClue(obj.grantClueId)) {
      this.notebookSystem.addClue(obj.grantClueId);
    }
    if (obj.grantItemId && !this.inventorySystem.hasItem(obj.grantItemId)) {
      this.inventorySystem.addItem(obj.grantItemId);
    }

    if (obj.id === 'hallway_fireplace' || obj.id === 'study_desk') {
      this.notebookSystem.completeObjective('obj_inspect_study');
    }

    // 10. Standard Inspection Modal
    this.player.lockMovement(true);
    this.ui.openModal(obj.objectName, obj.description, obj.details, () => {
      this.player.lockMovement(false);
    });
  }

  private stepOutOfHiding(): void {
    if (!this.player.getIsHiding()) return;

    const exitX = this.hidingSpotObject ? this.hidingSpotObject.x : this.player.x;
    const exitY = this.hidingSpotObject ? this.hidingSpotObject.y + 24 : this.player.y + 24;

    this.player.setHiding(false);
    this.player.setPosition(exitX, exitY);
    this.player.lockMovement(false);
    this.hidingSpotObject = null;
    this.audioManager.playSelect();
    this.ui.hidePrompt();
  }

  private handlePlayerDeath(): void {
    this.isDying = true;
    this.player.lockMovement(true);
    this.audioManager.playHorrorSting();
    this.cameras.main.flash(500, 180, 0, 0);

    this.ui.openModal(
      'MAULED IN THE DARK',
      'Your vision darkens with blood as the beast tears into flesh. The hollow hour claims another soul.',
      ['The nightmare is not over. Restoring your strength at the threshold...'],
      () => {
        this.player.setHealth(100);
        this.isDying = false;
        const curRoom = this.roomManager.getCurrentRoom();
        const spawn = curRoom.defaultSpawn;
        const roomX = (640 - curRoom.width) / 2;
        const roomY = (360 - curRoom.height) / 2;
        this.player.setPosition(roomX + spawn.x, roomY + spawn.y);
        this.player.lockMovement(false);
        if (this.werewolf) {
          this.werewolf.setState('patrol');
        }
      }
    );
  }

  public checkAndSpawnWerewolf(roomId: string): void {
    if (this.werewolf) {
      this.werewolf.destroy();
      this.werewolf = null;
    }

    const curRoom = this.roomManager.getCurrentRoom();
    if (!curRoom) return;
    const roomX = (640 - curRoom.width) / 2;
    const roomY = (360 - curRoom.height) / 2;

    const story = this.storyManager;
    let shouldSpawn = false;
    let spawnX = 240;
    let spawnY = 160;
    let patrolPoints: { x: number; y: number }[] = [];

    if (roomId === 'main_hallway' && story.getFlag('cctv_footage_reviewed') && !story.getFlag('bookshelf_puzzle_solved')) {
      shouldSpawn = true;
      spawnX = roomX + 240;
      spawnY = roomY + 120;
      patrolPoints = [
        { x: roomX + 140, y: roomY + 180 },
        { x: roomX + 340, y: roomY + 180 },
        { x: roomX + 240, y: roomY + 120 }
      ];
    } else if (roomId === 'library' && story.getFlag('edward_murdered') && !story.getFlag('bookshelf_puzzle_solved')) {
      shouldSpawn = true;
      spawnX = roomX + 160;
      spawnY = roomY + 220;
      patrolPoints = [
        { x: roomX + 160, y: roomY + 220 },
        { x: roomX + 320, y: roomY + 220 },
        { x: roomX + 240, y: roomY + 140 }
      ];
    } else if (roomId === 'basement') {
      shouldSpawn = true;
      spawnX = roomX + 240;
      spawnY = roomY + 180;
      patrolPoints = [
        { x: roomX + 160, y: roomY + 200 },
        { x: roomX + 320, y: roomY + 200 },
        { x: roomX + 240, y: roomY + 170 }
      ];
    }

    if (shouldSpawn) {
      this.werewolf = new Werewolf(this, {
        x: spawnX,
        y: spawnY,
        roomId,
        patrolPoints
      });

      this.physics.add.collider(this.werewolf, this.roomManager.getWallGroup());
      this.physics.add.collider(this.werewolf, this.roomManager.getObjectGroup());
    }
  }

  public spawnScriptedWerewolf(x: number, y: number, patrolPoints?: { x: number; y: number }[]): Werewolf {
    if (this.werewolf) {
      this.werewolf.destroy();
      this.werewolf = null;
    }

    this.werewolf = new Werewolf(this, {
      x,
      y,
      roomId: this.roomManager?.getCurrentRoom()?.id || 'main_hallway',
      patrolPoints
    });

    this.physics.add.collider(this.werewolf, this.roomManager.getWallGroup());
    this.physics.add.collider(this.werewolf, this.roomManager.getObjectGroup());
    return this.werewolf;
  }

  public getWerewolf(): Werewolf | null {
    return this.werewolf;
  }

  public getPlayer(): Detective {
    return this.player;
  }

  public triggerEnding(ending: EndingType): void {
    this.player.lockMovement(true);
    this.notebookSystem.completeObjective('obj_occult_altar');

    if (ending === 'severed_curse') {
      this.cameras.main.flash(800, 255, 230, 180);
      this.audioManager.playWerewolfHowl();
      this.time.delayedCall(400, () => {
        this.audioManager.playGhostChime();
      });
    } else if (ending === 'beast_eternal') {
      this.cameras.main.flash(800, 180, 0, 0);
      this.audioManager.playDamageLaceration();
      this.time.delayedCall(300, () => {
        this.audioManager.playWerewolfGrowl();
      });
    } else {
      this.cameras.main.flash(800, 230, 90, 0);
      this.audioManager.playHorrorSting();
    }

    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('EndingScene', { ending });
    });
  }

  private returnToMenu(): void {
    this.saveManager.createSave({
      chapter: 'Chapter I: The Hollow Hour',
      location: `Blackwood Manor - ${this.roomManager.getCurrentRoom()?.name || 'Ground Floor'}`
    });

    this.audioManager.playBack();
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }
}
