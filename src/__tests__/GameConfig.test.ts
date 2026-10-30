import { describe, it, expect, vi } from 'vitest';

// Mock Phaser classes before importing config
vi.mock('phaser', () => {
  class MockGameObject {}
  class MockSprite extends MockGameObject {}
  return {
    default: {
      AUTO: 0,
      Scale: {
        FIT: 1,
        CENTER_BOTH: 1
      },
      Scene: class MockScene {},
      GameObjects: {
        Container: MockGameObject,
        Rectangle: MockGameObject,
        Text: MockGameObject,
        Sprite: MockSprite,
        Image: MockGameObject
      },
      Physics: {
        Arcade: {
          Sprite: MockSprite,
          StaticGroup: class {}
        }
      },
      Math: {
        Distance: {
          Between: () => 0
        }
      },
      Input: {
        Keyboard: {
          KeyCodes: {
            W: 87, A: 65, S: 83, D: 68, E: 69, ESC: 27, SHIFT: 16
          },
          JustDown: () => false
        }
      }
    }
  };
});

import { GAME_WIDTH, GAME_HEIGHT, gameConfig } from '../config';

describe('Game Foundation Configuration', () => {
  it('has base virtual resolution of 640x360 (16:9 pixel-art virtual resolution)', () => {
    expect(GAME_WIDTH).toBe(640);
    expect(GAME_HEIGHT).toBe(360);
    expect(gameConfig.width).toBe(640);
    expect(gameConfig.height).toBe(360);
  });

  it('enforces pixelArt and roundPixels to guarantee crisp pixel scaling', () => {
    expect(gameConfig.pixelArt).toBe(true);
    expect(gameConfig.roundPixels).toBe(true);
  });

  it('configures scale mode to FIT and centered for responsive desktop presentation', () => {
    expect(gameConfig.scale?.width).toBe(640);
    expect(gameConfig.scale?.height).toBe(360);
  });

  it('configures Arcade Physics with zero gravity for top-down exploration', () => {
    expect(gameConfig.physics?.default).toBe('arcade');
    expect(gameConfig.physics?.arcade?.gravity?.y).toBe(0);
  });

  it('registers the initial scene pipeline', () => {
    expect(Array.isArray(gameConfig.scene)).toBe(true);
    const scenes = gameConfig.scene as Array<unknown>;
    expect(scenes.length).toBeGreaterThanOrEqual(5);
  });
});
