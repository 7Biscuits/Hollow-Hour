import Phaser from 'phaser';
import { NPC, NPCConfig } from '../entities/NPC';
import { StoryManager } from '../systems/StoryManager';
import { LightingSystem } from './LightingSystem';
import { RoomDefinition } from './MansionData';

export class CharacterManager {
  private scene: Phaser.Scene;
  private story: StoryManager;
  private activeNpcs: NPC[] = [];
  private crimeDecals: Phaser.GameObjects.Image[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.story = StoryManager.getInstance();
  }

  public getActiveNpcs(): NPC[] {
    return this.activeNpcs;
  }

  public spawnCharactersForRoom(
    room: RoomDefinition,
    roomX: number,
    roomY: number,
    lighting: LightingSystem
  ): NPC[] {
    this.clear();

    const configs: NPCConfig[] = [];

    switch (room.id) {
      case 'entrance_hall':
        if (this.story.getFlag('clock_puzzle_solved')) {
          configs.push({
            id: 'npc_alistair_ghost_foyer',
            name: 'Alistair\'s Ghost',
            characterId: 'alistair_ghost',
            texture: 'npc_alistair_ghost',
            x: roomX + 140,
            y: roomY + 95,
            dialogueId: 'alistair_ghost_intro',
            isGhost: true,
            interactionRadius: 60
          });
        }
        break;

      case 'library':
        if (!this.story.getFlag('edward_murdered')) {
          configs.push({
            id: 'npc_edward_living',
            name: 'Edward Vance',
            characterId: 'edward',
            texture: 'npc_edward',
            x: roomX + 280,
            y: roomY + 160,
            dialogueId: 'edward_intro',
            isGhost: false,
            interactionRadius: 55
          });
        } else {
          // Blood pool at murder scene
          const decal = this.scene.add.image(roomX + 280, roomY + 160, 'blood_pool_decal');
          decal.setDepth(2);
          this.crimeDecals.push(decal);

          // Edward's Ghost by the occult bookcase
          configs.push({
            id: 'npc_edward_ghost',
            name: 'Edward\'s Ghost',
            characterId: 'edward_ghost',
            texture: 'npc_edward_ghost',
            x: roomX + 130,
            y: roomY + 80,
            dialogueId: 'edward_ghost_intro',
            isGhost: true,
            interactionRadius: 60
          });
        }
        break;

      case 'bedroom':
        if (!this.story.getFlag('victoria_murdered')) {
          configs.push({
            id: 'npc_victoria_living',
            name: 'Victoria Vance',
            characterId: 'victoria',
            texture: 'npc_victoria',
            x: roomX + 210,
            y: roomY + 90,
            dialogueId: 'victoria_intro',
            isGhost: false,
            interactionRadius: 55
          });
        } else {
          // Blood pool at vanity
          const decal = this.scene.add.image(roomX + 210, roomY + 90, 'blood_pool_decal');
          decal.setDepth(2);
          this.crimeDecals.push(decal);

          // Victoria's Ghost near canopy bed
          configs.push({
            id: 'npc_victoria_ghost',
            name: 'Victoria\'s Ghost',
            characterId: 'victoria_ghost',
            texture: 'npc_victoria_ghost',
            x: roomX + 300,
            y: roomY + 100,
            dialogueId: 'victoria_ghost_intro',
            isGhost: true,
            interactionRadius: 60
          });
        }
        break;

      case 'security_room':
        if (!this.story.getFlag('hayes_murdered')) {
          configs.push({
            id: 'npc_hayes_living',
            name: 'Dr. Robert Hayes',
            characterId: 'hayes',
            texture: 'npc_hayes',
            x: roomX + 180,
            y: roomY + 85,
            dialogueId: 'hayes_intro',
            isGhost: false,
            interactionRadius: 55
          });
        }
        break;

      case 'basement':
        if (this.story.getFlag('hayes_murdered')) {
          const decal = this.scene.add.image(roomX + 180, roomY + 130, 'blood_pool_decal');
          decal.setDepth(2);
          this.crimeDecals.push(decal);

          configs.push({
            id: 'npc_hayes_ghost',
            name: 'Hayes\' Ghost',
            characterId: 'hayes_ghost',
            texture: 'npc_hayes_ghost',
            x: roomX + 180,
            y: roomY + 120,
            dialogueId: 'hayes_ghost_intro',
            isGhost: true,
            interactionRadius: 60
          });
        }

        if (this.story.getFlag('occult_altar_solved')) {
          configs.push({
            id: 'npc_alistair_ghost_crypt',
            name: 'Alistair\'s Ghost',
            characterId: 'alistair_ghost',
            texture: 'npc_alistair_ghost',
            x: roomX + 300,
            y: roomY + 120,
            dialogueId: 'alistair_ghost_truth',
            isGhost: true,
            interactionRadius: 60
          });
        }
        break;
    }

    for (const cfg of configs) {
      const npc = new NPC(this.scene, cfg);
      this.activeNpcs.push(npc);

      if (npc.isGhost) {
        // Ghostly ambient glow
        lighting.registerLightSource(npc.x, npc.y - 4, 0.45, 0.55);
      }
    }

    return this.activeNpcs;
  }

  public clear(): void {
    this.activeNpcs.forEach(n => n.destroy());
    this.activeNpcs = [];

    this.crimeDecals.forEach(d => d.destroy());
    this.crimeDecals = [];
  }
}
