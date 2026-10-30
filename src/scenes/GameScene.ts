import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';
import { SaveManager } from '../data/SaveManager';

export class GameScene extends Phaser.Scene {
  private audioManager!: AudioManager;
  private saveManager!: SaveManager;
  private mode: 'new' | 'continue' = 'new';
  private canAcceptInput = false;

  constructor() {
    super('GameScene');
  }

  public init(data: { mode?: 'new' | 'continue' }): void {
    this.mode = data.mode || 'new';
  }

  public create(): void {
    this.audioManager = AudioManager.getInstance();
    this.saveManager = SaveManager.getInstance();
    this.canAcceptInput = false;

    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#040306');
    this.cameras.main.fadeIn(1200, 0, 0, 0);

    // Candle in the dark
    const candle = this.add.sprite(width / 2, height / 2 - 60, 'candle_anim');
    candle.play('candle_flicker');
    candle.setScale(2.0);

    const glow = this.add.image(width / 2, height / 2 - 60, 'window_glow');
    glow.setScale(1.2);
    glow.setAlpha(0.65);
    glow.setBlendMode(Phaser.BlendModes.ADD);

    this.tweens.add({
      targets: glow,
      alpha: { from: 0.45, to: 0.8 },
      scale: { from: 1.1, to: 1.35 },
      duration: 350,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Chapter Header
    const chapterTitle = this.mode === 'continue'
      ? 'RESUMING JOURNEY'
      : 'PROLOGUE: THE VEILED FOYER';

    this.add.text(width / 2, height / 2 + 5, chapterTitle, {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#e2ccaf',
      stroke: '#3b1016',
      strokeThickness: 3,
      letterSpacing: 4
    }).setOrigin(0.5, 0.5);

    const storyText = this.mode === 'continue'
      ? 'The scent of damp stone and dried lavender fills the corridor.\nYour heartbeat echoes against the hollow walls...'
      : 'October 30th, 1892.\nThe heavy iron gates of Blackwood Manor groaned shut behind you.\nIn the silence of the hollow hour, you step into the dark...';

    const narrative = this.add.text(width / 2, height / 2 + 52, storyText, {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '11px',
      color: '#8c7a6e',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: narrative,
      alpha: { from: 0.7, to: 1 },
      duration: 1800,
      yoyo: true,
      repeat: -1
    });

    // Save Game creation if New Game
    if (this.mode === 'new') {
      this.saveManager.createSave({
        chapter: 'Prologue: The Veiled Foyer',
        location: 'Blackwood Manor - Entrance Hall'
      });
    }

    // Return prompt
    const returnText = this.add.text(width / 2, height - 32, '[ PRESS ESCAPE OR CLICK TO RETURN TO MAIN MENU ]', {
      fontFamily: "'VT323', monospace",
      fontSize: '12px',
      color: '#c9965d',
      letterSpacing: 2
    }).setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true });

    returnText.on('pointerdown', () => this.returnToMenu());

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (!this.canAcceptInput) return;
      if (event.key === 'Escape' || event.key === 'Backspace') {
        this.returnToMenu();
      }
    });

    this.time.delayedCall(300, () => {
      this.canAcceptInput = true;
    });

    this.events.on('shutdown', () => {
      this.input.keyboard?.removeAllListeners();
    });
  }

  private returnToMenu(): void {
    if (!this.canAcceptInput) return;
    this.canAcceptInput = false;
    this.audioManager.playBack();
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }
}
