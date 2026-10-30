import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';

export interface NPCConfig {
  x: number;
  y: number;
  id: string;
  name: string;
  characterId: string;
  texture: string;
  dialogueId: string;
  isGhost?: boolean;
  interactionRadius?: number;
}

export class NPC extends Phaser.Physics.Arcade.Sprite {
  public readonly id: string;
  public readonly characterName: string;
  public readonly characterId: string;
  public readonly dialogueId: string;
  public readonly isGhost: boolean;
  public readonly interactionRadius: number;

  private hoverTween?: Phaser.Tweens.Tween;
  private audio: AudioManager;

  constructor(scene: Phaser.Scene, config: NPCConfig) {
    super(scene, config.x, config.y, config.texture);

    this.id = config.id;
    this.characterName = config.name;
    this.characterId = config.characterId;
    this.dialogueId = config.dialogueId;
    this.isGhost = !!config.isGhost;
    this.interactionRadius = config.interactionRadius || 55;
    this.audio = AudioManager.getInstance();

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static physics body

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(14, 10);
    body.setOffset(3, 20);

    this.setDepth(this.y + 12);

    if (this.isGhost) {
      this.setAlpha(0.85);
      // Floating ethereal hover animation
      this.hoverTween = scene.tweens.add({
        targets: this,
        y: this.y - 4,
        alpha: { from: 0.85, to: 0.5 },
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  public onInteract(): void {
    if (this.isGhost) {
      this.audio.playGhostChime();
    } else {
      this.audio.playSelect();
    }
  }

  public destroy(fromScene?: boolean): void {
    if (this.hoverTween) {
      this.hoverTween.stop();
    }
    super.destroy(fromScene);
  }
}
