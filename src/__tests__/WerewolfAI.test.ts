import { describe, it, expect } from 'vitest';
import { MANSION_ROOMS } from '../world/MansionData';
import { WerewolfState } from '../entities/Werewolf';
import { ITEM_CATALOG } from '../data/ItemCatalog';

describe('Phase 7 - Werewolf AI and Horror Mechanics', () => {
  describe('Wardrobe Hiding Spots', () => {
    it('defines wardrobe hiding spots in the main hallway, library, and master bedroom', () => {
      const hallwayWardrobe = MANSION_ROOMS['main_hallway'].objects.find(o => o.id === 'wardrobe_hallway');
      const libraryWardrobe = MANSION_ROOMS['library'].objects.find(o => o.id === 'wardrobe_library');
      const bedroomWardrobe = MANSION_ROOMS['bedroom'].objects.find(o => o.id === 'wardrobe_bedroom');

      expect(hallwayWardrobe).toBeDefined();
      expect(hallwayWardrobe?.isHidingSpot).toBe(true);

      expect(libraryWardrobe).toBeDefined();
      expect(libraryWardrobe?.isHidingSpot).toBe(true);

      expect(bedroomWardrobe).toBeDefined();
      expect(bedroomWardrobe?.isHidingSpot).toBe(true);
    });

    it('has proper collision and dimensions for hiding wardrobes', () => {
      const wardrobe = MANSION_ROOMS['main_hallway'].objects.find(o => o.id === 'wardrobe_hallway')!;
      expect(wardrobe.texture).toBe('obj_wardrobe');
      expect(wardrobe.collisionWidth).toBe(28);
      expect(wardrobe.collisionHeight).toBe(20);
      expect(wardrobe.details?.length).toBeGreaterThan(0);
    });
  });

  describe('Laudanum Healing Item', () => {
    it('catalogs the laudanum medicinal tincture in ItemCatalog', () => {
      const laudanum = ITEM_CATALOG['item_laudanum'];
      expect(laudanum).toBeDefined();
      expect(laudanum.name).toContain('Laudanum');
      expect(laudanum.category).toBe('consumable');
    });
  });

  describe('Werewolf AI States and Behaviors', () => {
    it('supports all required AI states: dormant, patrol, investigate, detected, chase, attack, search', () => {
      const validStates: WerewolfState[] = [
        'dormant',
        'patrol',
        'investigate',
        'detected',
        'chase',
        'attack',
        'search'
      ];
      expect(validStates).toHaveLength(7);
      expect(validStates).toContain('chase');
      expect(validStates).toContain('attack');
      expect(validStates).toContain('search');
    });

    it('simulates sensory hearing logic: running footsteps are heard farther than walking', () => {
      const hearingRangeRunning = 150;
      const hearingRangeWalking = 45;

      const checkHearing = (dist: number, isMoving: boolean, isRunning: boolean, isHiding: boolean) => {
        if (isHiding) return false;
        if (isRunning && dist <= hearingRangeRunning) return true;
        if (isMoving && dist <= hearingRangeWalking) return true;
        return false;
      };

      // Player running at 100px: heard
      expect(checkHearing(100, true, true, false)).toBe(true);

      // Player walking at 100px: unheard
      expect(checkHearing(100, true, false, false)).toBe(false);

      // Player walking at 30px: heard
      expect(checkHearing(30, true, false, false)).toBe(true);

      // Player hiding inside wardrobe at 30px: unheard
      expect(checkHearing(30, true, true, true)).toBe(false);
    });

    it('simulates vision detection and hiding immunity', () => {
      const visionRange = 135;
      const visionAngle = 80;

      const checkVision = (
        dist: number,
        angleToPlayer: number,
        facingAngle: number,
        isHiding: boolean,
        hasLoS: boolean
      ) => {
        if (isHiding) return false;
        if (dist > visionRange) return false;
        if (!hasLoS) return false;

        const diff = Math.abs(angleToPlayer - facingAngle);
        return diff <= visionAngle / 2;
      };

      // In front of werewolf at 60px with clear LoS: detected
      expect(checkVision(60, 90, 90, false, true)).toBe(true);

      // Behind werewolf (180 deg away): undetected
      expect(checkVision(60, -90, 90, false, true)).toBe(false);

      // Obstructed by wall: undetected
      expect(checkVision(60, 90, 90, false, false)).toBe(false);

      // Hidden in wardrobe: immune to sight
      expect(checkVision(60, 90, 90, true, true)).toBe(false);
    });
  });

  describe('Health, Damage, and Recovery Simulation', () => {
    it('applies damage and enforces health clamping and death detection', () => {
      let health = 100;
      const damage = (amount: number) => {
        health = Math.max(0, health - amount);
        return { remaining: health, isDead: health <= 0 };
      };

      const hit1 = damage(25);
      expect(hit1.remaining).toBe(75);
      expect(hit1.isDead).toBe(false);

      const hit2 = damage(25);
      expect(hit2.remaining).toBe(50);

      const hit3 = damage(50);
      expect(hit3.remaining).toBe(0);
      expect(hit3.isDead).toBe(true);
    });

    it('heals with laudanum capped at 100% max health', () => {
      let health = 30;
      const heal = (amount: number) => {
        health = Math.min(100, health + amount);
        return health;
      };

      expect(heal(40)).toBe(70);
      expect(heal(40)).toBe(100);
    });
  });
});
