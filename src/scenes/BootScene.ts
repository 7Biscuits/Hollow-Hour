import Phaser from 'phaser';
import { PixelArtGenerator } from '../utils/PixelArtGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  public preload(): void {
    // Generate all procedural pixel textures
    PixelArtGenerator.generateAll(this);
  }

  public create(): void {
    // Candle flicker animation
    if (!this.anims.exists('candle_flicker')) {
      this.anims.create({
        key: 'candle_flicker',
        frames: this.anims.generateFrameNumbers('candle_anim', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
      });
    }

    // Detective Character Animations (4 directions)
    if (!this.anims.exists('detective_walk_down')) {
      // Down (row 0: frames 0-3)
      this.anims.create({
        key: 'detective_idle_down',
        frames: [{ key: 'detective_sheet', frame: 0 }],
        frameRate: 1
      });
      this.anims.create({
        key: 'detective_walk_down',
        frames: [
          { key: 'detective_sheet', frame: 1 },
          { key: 'detective_sheet', frame: 0 },
          { key: 'detective_sheet', frame: 3 },
          { key: 'detective_sheet', frame: 0 }
        ],
        frameRate: 7,
        repeat: -1
      });

      // Left (row 1: frames 4-7)
      this.anims.create({
        key: 'detective_idle_left',
        frames: [{ key: 'detective_sheet', frame: 4 }],
        frameRate: 1
      });
      this.anims.create({
        key: 'detective_walk_left',
        frames: [
          { key: 'detective_sheet', frame: 5 },
          { key: 'detective_sheet', frame: 4 },
          { key: 'detective_sheet', frame: 7 },
          { key: 'detective_sheet', frame: 4 }
        ],
        frameRate: 7,
        repeat: -1
      });

      // Right (row 2: frames 8-11)
      this.anims.create({
        key: 'detective_idle_right',
        frames: [{ key: 'detective_sheet', frame: 8 }],
        frameRate: 1
      });
      this.anims.create({
        key: 'detective_walk_right',
        frames: [
          { key: 'detective_sheet', frame: 9 },
          { key: 'detective_sheet', frame: 8 },
          { key: 'detective_sheet', frame: 11 },
          { key: 'detective_sheet', frame: 8 }
        ],
        frameRate: 7,
        repeat: -1
      });

      // Up (row 3: frames 12-15)
      this.anims.create({
        key: 'detective_idle_up',
        frames: [{ key: 'detective_sheet', frame: 12 }],
        frameRate: 1
      });
      this.anims.create({
        key: 'detective_walk_up',
        frames: [
          { key: 'detective_sheet', frame: 13 },
          { key: 'detective_sheet', frame: 12 },
          { key: 'detective_sheet', frame: 15 },
          { key: 'detective_sheet', frame: 12 }
        ],
        frameRate: 7,
        repeat: -1
      });
    }

    // Werewolf Beast Animations (4 directions)
    if (!this.anims.exists('werewolf_walk_down')) {
      // Down (row 0: frames 0-3)
      this.anims.create({
        key: 'werewolf_idle_down',
        frames: [{ key: 'werewolf_sheet', frame: 0 }],
        frameRate: 1
      });
      this.anims.create({
        key: 'werewolf_walk_down',
        frames: [
          { key: 'werewolf_sheet', frame: 1 },
          { key: 'werewolf_sheet', frame: 0 },
          { key: 'werewolf_sheet', frame: 3 },
          { key: 'werewolf_sheet', frame: 0 }
        ],
        frameRate: 6,
        repeat: -1
      });

      // Left (row 1: frames 4-7)
      this.anims.create({
        key: 'werewolf_idle_left',
        frames: [{ key: 'werewolf_sheet', frame: 4 }],
        frameRate: 1
      });
      this.anims.create({
        key: 'werewolf_walk_left',
        frames: [
          { key: 'werewolf_sheet', frame: 5 },
          { key: 'werewolf_sheet', frame: 4 },
          { key: 'werewolf_sheet', frame: 7 },
          { key: 'werewolf_sheet', frame: 4 }
        ],
        frameRate: 6,
        repeat: -1
      });

      // Right (row 2: frames 8-11)
      this.anims.create({
        key: 'werewolf_idle_right',
        frames: [{ key: 'werewolf_sheet', frame: 8 }],
        frameRate: 1
      });
      this.anims.create({
        key: 'werewolf_walk_right',
        frames: [
          { key: 'werewolf_sheet', frame: 9 },
          { key: 'werewolf_sheet', frame: 8 },
          { key: 'werewolf_sheet', frame: 11 },
          { key: 'werewolf_sheet', frame: 8 }
        ],
        frameRate: 6,
        repeat: -1
      });

      // Up (row 3: frames 12-15)
      this.anims.create({
        key: 'werewolf_idle_up',
        frames: [{ key: 'werewolf_sheet', frame: 12 }],
        frameRate: 1
      });
      this.anims.create({
        key: 'werewolf_walk_up',
        frames: [
          { key: 'werewolf_sheet', frame: 13 },
          { key: 'werewolf_sheet', frame: 12 },
          { key: 'werewolf_sheet', frame: 15 },
          { key: 'werewolf_sheet', frame: 12 }
        ],
        frameRate: 6,
        repeat: -1
      });
    }

    // Wait for web fonts before launching menu
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
