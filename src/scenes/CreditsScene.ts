import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';

export class CreditsScene extends Phaser.Scene {
  private audioManager!: AudioManager;
  private canAcceptInput = false;

  constructor() {
    super('CreditsScene');
  }

  public create(): void {
    this.audioManager = AudioManager.getInstance();
    this.canAcceptInput = false;
    const { width, height } = this.scale;

    // Atmospheric dark backdrop
    this.add.image(width / 2, height / 2, 'mansion_sky').setOrigin(0.5, 0.5);
    const mansion = this.add.image(width / 2, height / 2, 'mansion_building').setOrigin(0.5, 0.5);
    mansion.setTint(0x1a1420);

    // Gothic panel (440 x 280)
    const pW = 440;
    const pH = 280;
    const panel = this.add.rectangle(width / 2, height / 2, pW, pH, 0x0c0810, 0.94);
    panel.setStrokeStyle(2, 0x4a1824);

    // Corner Ornate flourishes
    this.add.image(width / 2 - pW / 2 + 2, height / 2 - pH / 2 + 2, 'ui_frame').setOrigin(0, 0);
    this.add.image(width / 2 + pW / 2 - 2, height / 2 - pH / 2 + 2, 'ui_frame').setOrigin(1, 0).setFlipX(true);
    this.add.image(width / 2 - pW / 2 + 2, height / 2 + pH / 2 - 2, 'ui_frame').setOrigin(0, 1).setFlipY(true);
    this.add.image(width / 2 + pW / 2 - 2, height / 2 + pH / 2 - 2, 'ui_frame').setOrigin(1, 1).setFlipX(true).setFlipY(true);

    // Screen Title
    this.add.text(width / 2, height / 2 - 114, 'THE HOLLOW HOUR', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#e2ccaf',
      stroke: '#28070e',
      strokeThickness: 3,
      letterSpacing: 4
    }).setOrigin(0.5, 0.5);

    this.add.text(width / 2, height / 2 - 93, '— CREDITS & ATTRIBUTION —', {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '10px',
      color: '#8a796b',
      letterSpacing: 3
    }).setOrigin(0.5, 0.5);

    // Credits Sections
    const creditsData = [
      { role: 'CREATION & DIRECTION', name: 'A Tale of Gothic Despair' },
      { role: 'PIXEL ART & ENVIRONMENT', name: 'Handcrafted Victorian Gothic Aesthetics' },
      { role: 'AUDIO SYSTEM', name: 'Procedural Horror Drone & Web Audio Engine' },
      { role: 'SPECIAL INSPIRATION', name: 'Lamentum, Silent Hill & Classic Survival Horror' }
    ];

    const startY = height / 2 - 55;
    const spacing = 38;

    creditsData.forEach((item, idx) => {
      const cy = startY + idx * spacing;

      this.add.text(width / 2, cy, item.role, {
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: '9px',
        color: '#9e3647',
        letterSpacing: 2
      }).setOrigin(0.5, 0.5);

      this.add.text(width / 2, cy + 14, item.name, {
        fontFamily: "'MedievalSharp', serif",
        fontSize: '12px',
        color: '#c2b09b'
      }).setOrigin(0.5, 0.5);
    });

    // Return Button
    const backBtn = this.add.text(width / 2, height / 2 + 115, '[ RETURN TO MENU ]', {
      fontFamily: "'Cinzel Decorative', 'MedievalSharp', serif",
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#c9965d',
      letterSpacing: 2
    }).setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => {
      if (!this.canAcceptInput) return;
      this.audioManager.playHover();
      backBtn.setColor('#f4dec3');
      backBtn.setScale(1.05);
    });

    backBtn.on('pointerout', () => {
      backBtn.setColor('#c9965d');
      backBtn.setScale(1.0);
    });

    backBtn.on('pointerdown', () => {
      this.goBack();
    });

    // Escape key listener (with safety debounce)
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (!this.canAcceptInput) return;
      if (event.key === 'Escape' || event.key === 'Backspace') {
        this.goBack();
      }
    });

    this.time.delayedCall(250, () => {
      this.canAcceptInput = true;
    });

    this.events.on('shutdown', () => {
      this.input.keyboard?.removeAllListeners();
    });
  }

  private goBack(): void {
    if (!this.canAcceptInput) return;
    this.canAcceptInput = false;
    this.audioManager.playBack();
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }
}
