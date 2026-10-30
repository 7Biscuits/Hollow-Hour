import Phaser from 'phaser';
import { PuzzleManager, OccultPuzzleController } from '../systems/PuzzleSystem';
import { AudioManager } from '../audio/AudioManager';

export class OccultPuzzleModal {
  private scene: Phaser.Scene;
  private puzzle: OccultPuzzleController;
  private audio: AudioManager;

  private container!: Phaser.GameObjects.Container;
  private isOpen: boolean = false;

  private outerRing!: Phaser.GameObjects.Image;
  private midRing!: Phaser.GameObjects.Image;
  private innerRing!: Phaser.GameObjects.Image;
  private centerSigil!: Phaser.GameObjects.Image;

  private ringButtons: Phaser.GameObjects.Text[] = [];
  private statusText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;

  private onCloseCallback?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.puzzle = PuzzleManager.getInstance().getOccultPuzzle();
    this.audio = AudioManager.getInstance();
    this.createUI();
  }

  private createUI(): void {
    const { width, height } = this.scale;

    this.container = this.scene.add.container(0, 0).setDepth(3200).setVisible(false);

    // Dark Scrim
    const scrim = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x060408, 0.94);
    scrim.setInteractive();
    this.container.add(scrim);

    // Stone Plaque Frame (440x260)
    const frame = this.scene.add.rectangle(width / 2, height / 2, 440, 260, 0x17151c, 0.98);
    frame.setStrokeStyle(2, 0x5a4f66);
    this.container.add(frame);

    const inner = this.scene.add.rectangle(width / 2, height / 2, 430, 250, 0x0f0e13, 0.95);
    inner.setStrokeStyle(1, 0x3a3244);
    this.container.add(inner);

    // Header Title
    const title = this.scene.add.text(width / 2, height / 2 - 108, 'THE CRYPT ALTAR - ALCHEMICAL CONCENTRIC DIAL', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#e2ccaf',
      stroke: '#3b1016',
      strokeThickness: 3,
      letterSpacing: 2
    }).setOrigin(0.5, 0.5);
    this.container.add(title);

    // Altar Stone Concentric Discs
    const dialX = width / 2 - 85;
    const dialY = height / 2;

    // Alignment Crest / Arrow at top (12 o'clock notch)
    const alignArrow = this.scene.add.triangle(dialX, dialY - 96, 0, 0, -6, -10, 6, -10, 0xef4444);
    this.container.add(alignArrow);

    this.outerRing = this.scene.add.image(dialX, dialY, 'ui_occult_ring_outer');
    this.midRing = this.scene.add.image(dialX, dialY, 'ui_occult_ring_mid');
    this.innerRing = this.scene.add.image(dialX, dialY, 'ui_occult_ring_inner');
    this.centerSigil = this.scene.add.image(dialX, dialY, 'ui_occult_sigil_center');

    this.container.add([this.outerRing, this.midRing, this.innerRing, this.centerSigil]);

    // Right Side: Ring Selection & Rotation Buttons
    const ctrlX = width / 2 + 80;
    const ctrlStartY = height / 2 - 60;

    const ringLabels = ['[1] OUTER RING', '[2] MIDDLE RING', '[3] INNER RING'];
    for (let r = 0; r < 3; r++) {
      const btn = this.scene.add.text(ctrlX, ctrlStartY + r * 26, ringLabels[r], {
        fontFamily: "'VT323', monospace",
        fontSize: '14px',
        color: r === 0 ? '#f59e0b' : '#8d6e4f'
      }).setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerdown', () => this.selectRing(r));
      this.ringButtons.push(btn);
      this.container.add(btn);
    }

    // Rotation Buttons
    const btnLeft = this.scene.add.text(ctrlX - 45, ctrlStartY + 90, '[< LEFT]', {
      fontFamily: "'VT323', monospace",
      fontSize: '14px',
      color: '#c5a07c'
    }).setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true });
    btnLeft.on('pointerdown', () => this.rotateActiveRing(-1));

    const btnRight = this.scene.add.text(ctrlX + 45, ctrlStartY + 90, '[RIGHT >]', {
      fontFamily: "'VT323', monospace",
      fontSize: '14px',
      color: '#c5a07c'
    }).setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true });
    btnRight.on('pointerdown', () => this.rotateActiveRing(1));

    this.container.add([btnLeft, btnRight]);

    // Status Info
    this.statusText = this.scene.add.text(width / 2, height / 2 + 85, '', {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '10px',
      color: '#d5c5aa',
      align: 'center',
      wordWrap: { width: 420 },
      lineSpacing: 2
    }).setOrigin(0.5, 0.5);
    this.container.add(this.statusText);

    // Footer Hint
    this.hintText = this.scene.add.text(width / 2, height / 2 + 112, '[1 - 3] SELECT RING    [A / D or ARROWS] ROTATE    [ESC] STEP BACK', {
      fontFamily: "'VT323', monospace",
      fontSize: '11px',
      color: '#8d6e4f',
      letterSpacing: 2
    }).setOrigin(0.5, 0.5);
    this.container.add(this.hintText);
  }

  private get scale(): Phaser.Scale.ScaleManager {
    return this.scene.scale;
  }

  public open(onClose?: () => void): void {
    this.onCloseCallback = onClose;
    this.isOpen = true;
    this.container.setVisible(true);
    this.audio.playSelect();
    this.updateDisplay();
  }

  public close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.container.setVisible(false);
    this.audio.playBack();
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }

  public getIsOpen(): boolean {
    return this.isOpen;
  }

  public selectRing(index: number): void {
    this.puzzle.setActiveRing(index);
    this.audio.playHover();
    this.updateDisplay();
  }

  public rotateActiveRing(delta: number): void {
    if (this.puzzle.isSolved()) return;

    this.puzzle.rotateActiveRing(delta);
    this.audio.playHover();

    if (this.puzzle.isSolved()) {
      this.audio.playSelect();
      this.scene.tweens.add({
        targets: this.centerSigil,
        scale: { from: 1, to: 1.5 },
        alpha: { from: 1, to: 0.6 },
        yoyo: true,
        repeat: 2,
        duration: 150
      });
    }

    this.updateDisplay();
  }

  private updateDisplay(): void {
    const positions = this.puzzle.getRingPositions();
    const active = this.puzzle.getActiveRing();

    // 8 notch positions = 45 degrees per notch
    this.outerRing.setAngle(positions[0] * 45);
    this.midRing.setAngle(positions[1] * 45);
    this.innerRing.setAngle(positions[2] * 45);

    // Update Button Highlights
    this.ringButtons.forEach((btn, idx) => {
      btn.setColor(idx === active ? '#f59e0b' : '#8d6e4f');
    });

    if (this.puzzle.isSolved()) {
      this.statusText.setText('THE ALCHEMICAL LOCK DISENGAGES! The obsidian altar parts, yielding the Wrought Iron Key to the subterranean vault!');
      this.statusText.setColor('#10b981');
    } else {
      this.statusText.setText('Align the carved runes with the top crimson notch: Full Moon on outer ring, Wolf Head on middle ring, Blood Chalice on inner ring.');
      this.statusText.setColor('#d5c5aa');
    }
  }

  public handleInput(key: string, code?: string): void {
    if (!this.isOpen) return;

    if (code === 'KeyE' || key === 'e' || key === 'E' || code === 'Escape' || key === 'Escape') {
      this.close();
      return;
    }

    if (key === '1') this.selectRing(0);
    else if (key === '2') this.selectRing(1);
    else if (key === '3') this.selectRing(2);
    else if (key === 'ArrowLeft' || key === 'a' || key === 'A' || code === 'KeyA') {
      this.rotateActiveRing(-1);
    } else if (key === 'ArrowRight' || key === 'd' || key === 'D' || code === 'KeyD') {
      this.rotateActiveRing(1);
    }
  }
}
