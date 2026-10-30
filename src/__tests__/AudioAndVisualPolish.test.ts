import { describe, it, expect, beforeEach } from 'vitest';
import { AudioManager } from '../audio/AudioManager';
import { MANSION_ROOMS } from '../world/MansionData';

describe('Phase 9 - Audio, Animation and Visual Polish', () => {
  let audio: AudioManager;

  beforeEach(() => {
    audio = AudioManager.getInstance();
  });

  describe('Atmospheric Horror Audio Synthesizers', () => {
    it('supports clock ticking mechanical sound effects', () => {
      expect(typeof audio.playClockTick).toBe('function');
      expect(() => audio.playClockTick(true)).not.toThrow();
      expect(() => audio.playClockTick(false)).not.toThrow();
    });

    it('supports Victorian floorboard creaking audio synthesis', () => {
      expect(typeof audio.playFloorboardCreak).toBe('function');
      expect(() => audio.playFloorboardCreak()).not.toThrow();
    });

    it('supports subterranean water drip sound synthesis for crypt atmosphere', () => {
      expect(typeof audio.playWaterDrip).toBe('function');
      expect(() => audio.playWaterDrip()).not.toThrow();
    });

    it('supports thunder rumbling for ambient sheet lightning strikes', () => {
      expect(typeof audio.playThunder).toBe('function');
      expect(() => audio.playThunder()).not.toThrow();
    });
  });

  describe('Atmospheric Room Acoustical Properties', () => {
    it('differentiates wood parquet rooms from stone crypts for footstep creak simulation', () => {
      const hallway = MANSION_ROOMS['main_hallway'];
      const bedroom = MANSION_ROOMS['bedroom'];
      const crypt = MANSION_ROOMS['basement'];

      expect(hallway.floorTile).toBe('tile_floor_wood');
      expect(bedroom.floorTile).toBe('tile_floor_wood');
      expect(crypt.floorTile).toBe('tile_floor_stone');
    });

    it('features stopped grandfather clock in Entrance Hall that requires ticking mechanism', () => {
      const entranceHall = MANSION_ROOMS['entrance_hall'];
      const clockObj = entranceHall.objects.find(o => o.id === 'grandfather_clock');
      expect(clockObj).toBeDefined();
      expect(clockObj?.isClockPuzzle).toBe(true);
    });
  });
});
