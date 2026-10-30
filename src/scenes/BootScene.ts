import Phaser from 'phaser';
import { PixelArtGenerator } from '../utils/PixelArtGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  public preload(): void {
    // Generate procedural pixel textures
    PixelArtGenerator.generateAll(this);
  }

  public create(): void {
    // Register candle flicker animation
    if (!this.anims.exists('candle_flicker')) {
      this.anims.create({
        key: 'candle_flicker',
        frames: this.anims.generateFrameNumbers('candle_anim', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
      });
    }

    // Wait for fonts to be ready to avoid layout shift, then transition to MenuScene
    if (document.fonts) {
      document.fonts.ready.then(() => {
        this.time.delayedCall(150, () => {
          this.scene.start('MenuScene');
        });
      }).catch(() => {
        this.scene.start('MenuScene');
      });
    } else {
      this.scene.start('MenuScene');
    }
  }
}
