import Phaser from 'phaser';
import { PuzzleManager, ClockPuzzleController } from '../systems/PuzzleSystem';
import { AudioManager } from '../audio/AudioManager';

export class ClockPuzzleModal {
  private scene: Phaser.Scene;
  private puzzle: ClockPuzzleController;
  private audio: AudioManager;

  private container!: Phaser.GameObjects.Container;
  private isOpen: boolean = false;

  private clockFace!: Phaser.GameObjects.Image;
  private hourHand!: Phaser.GameObjects.Image;
  private minuteHand!: Phaser.GameObjects.Image;
  private timeDisplayText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;

  private onCloseCallback?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.puzzle = PuzzleManager.getInstance().getClockPuzzle();
    this.audio = AudioManager.getInstance();
    this.createUI();
  }

  private createUI(): void {
    const { width, height } = this.scale;

    this.container = this.scene.add.container(0, 0).setDepth(3200).setVisible(false);

    // Scrim
    const scrim = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x060408, 0.9);
    scrim.setInteractive();
    this.container.add(scrim);

    // Cabinet Frame (440x260)
    const cabinet = this.scene.add.rectangle(width / 2, height / 2, 440, 260, 0x140e16, 0.98);
    cabinet.setStrokeStyle(2, 0x7a5a3a);
    this.container.add(cabinet);

    const inner = this.scene.add.rectangle(width / 2, height / 2, 430, 250, 0x0b080e, 0.95);
    inner.setStrokeStyle(1, 0x4a321e);
    this.container.add(inner);

    // Header Title
    const title = this.scene.add.text(width / 2, height / 2 - 108, 'THE GRANDFATHER CLOCK ARBOR', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#e2ccaf',
      stroke: '#3b1016',
      strokeThickness: 3,
      letterSpacing: 2
    }).setOrigin(0.5, 0.5);
    this.container.add(title);

    // Clock Face Center
    const clockX = width / 2 - 80;
    const clockY = height / 2;

    this.clockFace = this.scene.add.image(clockX, clockY, 'ui_clock_face').setScale(1.2);
    this.container.add(this.clockFace);

    // Hour Hand (pivot at bottom center)
    this.hourHand = this.scene.add.image(clockX, clockY, 'ui_clock_hand_hour');
    this.hourHand.setOrigin(0.5, 0.85);
    this.container.add(this.hourHand);

    // Minute Hand (pivot at bottom center)
    this.minuteHand = this.scene.add.image(clockX, clockY, 'ui_clock_hand_minute');
    this.minuteHand.setOrigin(0.5, 0.88);
    this.container.add(this.minuteHand);

    // Right Side: Controls and Status Info
    const infoX = width / 2 + 50;

    this.timeDisplayText = this.scene.add.text(infoX, height / 2 - 65, 'TIME: 12:00', {
      fontFamily: "'VT323', monospace",
      fontSize: '18px',
      color: '#f59e0b',
      letterSpacing: 3
    });
    this.container.add(this.timeDisplayText);

    this.statusText = this.scene.add.text(infoX, height / 2 - 35, '', {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '10px',
      color: '#d5c5aa',
      wordWrap: { width: 150 },
      lineSpacing: 3
    });
    this.container.add(this.statusText);

    // Buttons
    const btnHour = this.scene.add.text(infoX, height / 2 + 35, '[A / D] Turn Hour Hand', {
      fontFamily: "'VT323', monospace",
      fontSize: '13px',
      color: '#c5a07c'
    }).setInteractive({ useHandCursor: true });
    btnHour.on('pointerdown', () => this.rotateHour(1));

    const btnMin = this.scene.add.text(infoX, height / 2 + 55, '[W / S] Turn Minute Hand', {
      fontFamily: "'VT323', monospace",
      fontSize: '13px',
      color: '#c5a07c'
    }).setInteractive({ useHandCursor: true });
    btnMin.on('pointerdown', () => this.rotateMinute(5));

    this.container.add(btnHour);
    this.container.add(btnMin);

    // Bottom Hint
    this.hintText = this.scene.add.text(width / 2, height / 2 + 105, '[ARROWS] ADJUST TIME    [ESC] STEP BACK', {
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
    this.updateClockDisplay();
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

  public rotateHour(steps: number): void {
    if (this.puzzle.isSolved()) return;
    this.puzzle.rotateHour(steps);
    this.audio.playHover();
    this.updateClockDisplay();
  }

  public rotateMinute(steps: number): void {
    if (this.puzzle.isSolved()) return;
    this.puzzle.rotateMinute(steps);
    this.audio.playHover();
    this.updateClockDisplay();
  }

  private updateClockDisplay(): void {
    const time = this.puzzle.getTime();
    const formattedHour = time.hour.toString().padStart(2, '0');
    const formattedMin = time.minute.toString().padStart(2, '0');

    this.timeDisplayText.setText(`TIME: ${formattedHour}:${formattedMin}`);

    // Update rotations (360 degrees = 12 hours -> 30 deg/hr; 360 degrees = 60 mins -> 6 deg/min)
    const hourAngle = (time.hour % 12) * 30 + (time.minute / 60) * 30;
    const minAngle = time.minute * 6;

    this.hourHand.setAngle(hourAngle);
    this.minuteHand.setAngle(minAngle);

    if (this.puzzle.isSolved()) {
      this.statusText.setText('A resonant metallic click echoes from the base! A hidden drawer popped open, revealing the Tarnished Brass Key.');
      this.timeDisplayText.setColor('#10b981');
    } else {
      this.statusText.setText('The gears grind with resistance. The pocket watch found near Alistair had its hands frozen at 3:33.');
      this.timeDisplayText.setColor('#f59e0b');
    }
  }

  public handleInput(key: string, code?: string): void {
    if (!this.isOpen) return;

    if (code === 'KeyE' || key === 'e' || key === 'E' || code === 'Escape' || key === 'Escape') {
      this.close();
      return;
    }

    switch (key) {
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.rotateHour(1);
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.rotateHour(-1);
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.rotateMinute(3);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.rotateMinute(-3);
        break;
    }
  }
}
