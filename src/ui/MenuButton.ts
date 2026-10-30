import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';

export interface MenuButtonConfig {
  x: number;
  y: number;
  text: string;
  disabled?: boolean;
  onSelect: () => void;
  onHover?: () => void;
}

export class MenuButton extends Phaser.GameObjects.Container {
  private textObject: Phaser.GameObjects.Text;
  private bgGlow: Phaser.GameObjects.Rectangle;
  private isSelected = false;
  private isDisabled = false;
  private onSelectCallback: () => void;
  private onHoverCallback?: () => void;
  private audioManager: AudioManager;
  private originalX: number;

  constructor(scene: Phaser.Scene, config: MenuButtonConfig) {
    super(scene, config.x, config.y);
    this.originalX = config.x;
    this.isDisabled = !!config.disabled;
    this.onSelectCallback = config.onSelect;
    this.onHoverCallback = config.onHover;
    this.audioManager = AudioManager.getInstance();

    // Subtle dark wine backdrop glow on hover/selection
    this.bgGlow = scene.add.rectangle(0, 0, 200, 24, 0x420c15, 0);
    this.bgGlow.setOrigin(0.5, 0.5);
    this.add(this.bgGlow);

    // Menu text with gothic styling
    const textColor = this.isDisabled ? '#4d464e' : '#b8a690';
    this.textObject = scene.add.text(0, 0, config.text, {
      fontFamily: "'Cinzel Decorative', 'MedievalSharp', serif",
      fontSize: '14px',
      fontStyle: 'bold',
      color: textColor,
      stroke: '#08060a',
      strokeThickness: 3,
      letterSpacing: 2,
      align: 'center'
    });
    this.textObject.setOrigin(0.5, 0.5);
    this.add(this.textObject);

    // Interactive hitbox
    const hitArea = new Phaser.Geom.Rectangle(-100, -12, 200, 24);
    this.setSize(200, 24);
    this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    this.on('pointerover', () => {
      if (this.isDisabled) return;
      if (this.onHoverCallback) this.onHoverCallback();
    });

    this.on('pointerdown', () => {
      this.triggerSelect();
    });

    scene.add.existing(this);
  }

  public getTextWidth(): number {
    return this.textObject.width;
  }

  public setSelected(selected: boolean): void {
    if (this.isSelected === selected) return;
    this.isSelected = selected;

    if (this.isSelected) {
      if (!this.isDisabled) {
        this.audioManager.playHover();
      }

      this.scene.tweens.killTweensOf(this);
      this.scene.tweens.killTweensOf(this.textObject);

      // Slide slightly to the right with eerie golden glow
      this.scene.tweens.add({
        targets: this,
        x: this.originalX + 5,
        duration: 150,
        ease: 'Cubic.easeOut'
      });

      this.textObject.setColor('#f4dec3');
      this.textObject.setStroke('#4a101a', 4);
      this.bgGlow.setAlpha(0.45);

      // Subtle pulse on text
      this.scene.tweens.add({
        targets: this.textObject,
        scaleX: 1.04,
        scaleY: 1.04,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    } else {
      this.scene.tweens.killTweensOf(this);
      this.scene.tweens.killTweensOf(this.textObject);

      this.scene.tweens.add({
        targets: this,
        x: this.originalX,
        duration: 150,
        ease: 'Cubic.easeOut'
      });

      this.textObject.setScale(1);
      this.textObject.setColor(this.isDisabled ? '#4d464e' : '#b8a690');
      this.textObject.setStroke('#08060a', 3);
      this.bgGlow.setAlpha(0);
    }
  }

  public triggerSelect(): void {
    if (this.isDisabled) {
      this.audioManager.playDisabled();
      this.scene.tweens.add({
        targets: this,
        x: { from: this.originalX - 3, to: this.originalX + 3 },
        duration: 45,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          this.x = this.isSelected ? this.originalX + 5 : this.originalX;
        }
      });
      return;
    }

    this.audioManager.playSelect();

    this.scene.tweens.add({
      targets: this.textObject,
      scaleX: 1.12,
      scaleY: 1.12,
      alpha: 0.6,
      duration: 90,
      yoyo: true,
      onComplete: () => {
        this.onSelectCallback();
      }
    });
  }

  public setDisabled(disabled: boolean): void {
    this.isDisabled = disabled;
    this.textObject.setColor(disabled ? '#4d464e' : '#b8a690');
    if (disabled && this.isSelected) {
      this.setSelected(false);
    }
  }

  public getIsDisabled(): boolean {
    return this.isDisabled;
  }
}
