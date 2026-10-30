import Phaser from 'phaser';
import { PuzzleManager, CCTVPuzzleController } from '../systems/PuzzleSystem';
import { InventorySystem } from '../systems/InventorySystem';
import { AudioManager } from '../audio/AudioManager';

export class CCTVModal {
  private scene: Phaser.Scene;
  private puzzle: CCTVPuzzleController;
  private inventory: InventorySystem;
  private audio: AudioManager;

  private container!: Phaser.GameObjects.Container;
  private isOpen: boolean = false;

  private feedImage!: Phaser.GameObjects.Image;
  private staticOverlay!: Phaser.GameObjects.TileSprite;
  private channelButtons: Phaser.GameObjects.Text[] = [];
  private tapeButton!: Phaser.GameObjects.Text;
  private timestampText!: Phaser.GameObjects.Text;
  private statusMessage!: Phaser.GameObjects.Text;
  private recDot!: Phaser.GameObjects.Arc;
  private recTween?: Phaser.Tweens.Tween;

  private onCloseCallback?: () => void;

  private channelNames = [
    'CAM 01: ENTRANCE HALL',
    'CAM 02: MAIN CORRIDOR',
    'CAM 03: ARCHIVE & LIBRARY',
    'CAM 04: GOTHIC COURTYARD',
    'CAM 05: SUB-CELLAR LAB'
  ];

  private feedKeys = [
    'cctv_feed_foyer',
    'cctv_feed_hallway',
    'cctv_feed_library',
    'cctv_feed_courtyard',
    'cctv_feed_cellar_werewolf'
  ];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.puzzle = PuzzleManager.getInstance().getCCTVPuzzle();
    this.inventory = InventorySystem.getInstance();
    this.audio = AudioManager.getInstance();
    this.createUI();
  }

  private createUI(): void {
    const { width, height } = this.scale;

    this.container = this.scene.add.container(0, 0).setDepth(3200).setVisible(false);

    // Dark Background Scrim
    const scrim = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x030403, 0.94);
    scrim.setInteractive();
    this.container.add(scrim);

    // Monitor Outer Bezel Frame
    const frame = this.scene.add.image(width / 2, height / 2, 'ui_cctv_frame');
    this.container.add(frame);

    // CRT Screen Area (centered at 210, 135 inside frame)
    const screenX = width / 2 - 60;
    const screenY = height / 2 - 15;

    this.feedImage = this.scene.add.image(screenX, screenY, 'cctv_feed_foyer').setDisplaySize(380, 230);
    this.container.add(this.feedImage);

    // Animated Static Overlay
    this.staticOverlay = this.scene.add.tileSprite(screenX, screenY, 380, 230, 'cctv_static');
    this.staticOverlay.setAlpha(0.12).setBlendMode(Phaser.BlendModes.ADD);
    this.container.add(this.staticOverlay);

    // REC Flashing Indicator
    this.recDot = this.scene.add.circle(screenX - 165, screenY - 95, 4, 0xef4444);
    const recText = this.scene.add.text(screenX - 155, screenY - 100, 'REC', {
      fontFamily: "'VT323', monospace",
      fontSize: '12px',
      color: '#ef4444'
    });
    this.container.add([this.recDot, recText]);

    // Live Timestamp
    this.timestampText = this.scene.add.text(screenX + 70, screenY - 100, '1892-10-30 02:45:19 AM', {
      fontFamily: "'VT323', monospace",
      fontSize: '11px',
      color: '#55d882'
    });
    this.container.add(this.timestampText);

    // Channel Switcher Buttons (Right panel)
    const rightPanelX = width / 2 + 185;
    const rightPanelStartY = height / 2 - 105;

    const channelHeader = this.scene.add.text(rightPanelX, rightPanelStartY, 'CHANNELS', {
      fontFamily: "'VT323', monospace",
      fontSize: '13px',
      color: '#7a8599',
      letterSpacing: 2
    }).setOrigin(0.5, 0.5);
    this.container.add(channelHeader);

    for (let i = 1; i <= 5; i++) {
      const btnY = rightPanelStartY + 24 + (i - 1) * 26;
      const btn = this.scene.add.text(rightPanelX, btnY, `[${i}] CAM ${i}`, {
        fontFamily: "'VT323', monospace",
        fontSize: '13px',
        color: i === 1 ? '#55d882' : '#8d99ae'
      }).setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerdown', () => this.switchChannel(i));
      btn.on('pointerover', () => {
        if (this.puzzle.getChannel() !== i) btn.setColor('#f59e0b');
      });
      btn.on('pointerout', () => {
        if (this.puzzle.getChannel() !== i) btn.setColor('#8d99ae');
      });

      this.channelButtons.push(btn);
      this.container.add(btn);
    }

    // Tape Action Button
    this.tapeButton = this.scene.add.text(rightPanelX, height / 2 + 65, '[T] INSERT REEL', {
      fontFamily: "'VT323', monospace",
      fontSize: '11px',
      color: '#c5a07c'
    }).setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true });
    this.tapeButton.on('pointerdown', () => this.tryInsertTape());
    this.container.add(this.tapeButton);

    // Status Message at bottom of screen
    this.statusMessage = this.scene.add.text(screenX, screenY + 95, '', {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '10px',
      color: '#e2ccaf',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
      wordWrap: { width: 360 }
    }).setOrigin(0.5, 0.5);
    this.container.add(this.statusMessage);

    // Footer instruction
    const footer = this.scene.add.text(width / 2, height / 2 + 134, '[1 - 5] SWITCH CHANNELS    [T] INSERT REEL    [ESC] STEP AWAY', {
      fontFamily: "'VT323', monospace",
      fontSize: '11px',
      color: '#7a8599',
      letterSpacing: 2
    }).setOrigin(0.5, 0.5);
    this.container.add(footer);
  }

  private get scale(): Phaser.Scale.ScaleManager {
    return this.scene.scale;
  }

  public open(onClose?: () => void): void {
    this.onCloseCallback = onClose;
    this.isOpen = true;
    this.container.setVisible(true);
    this.audio.playSelect();

    // Start REC dot blinking
    this.recTween = this.scene.tweens.add({
      targets: this.recDot,
      alpha: { from: 1, to: 0.1 },
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    this.switchChannel(this.puzzle.getChannel());
  }

  public close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.container.setVisible(false);
    this.audio.playBack();
    if (this.recTween) {
      this.recTween.stop();
    }
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }

  public getIsOpen(): boolean {
    return this.isOpen;
  }

  public switchChannel(channel: number): void {
    this.audio.playHover();
    const result = this.puzzle.setChannel(channel);

    // Update Channel Button Colors
    this.channelButtons.forEach((btn, idx) => {
      if (idx + 1 === channel) {
        btn.setColor('#55d882');
      } else {
        btn.setColor('#8d99ae');
      }
    });

    // Check CAM 5 tape status
    if (channel === 5) {
      if (!this.puzzle.isTapeInserted()) {
        this.feedImage.setTexture('cctv_static');
        this.staticOverlay.setAlpha(0.65);
        this.statusMessage.setText('NO SIGNAL: SURVEILLANCE REEL #3 REQUIRED. Press [T] or click below to insert tape.');
        this.statusMessage.setColor('#ef4444');
      } else {
        this.feedImage.setTexture('cctv_feed_cellar_werewolf');
        this.staticOverlay.setAlpha(0.18);
        if (result.discovered) {
          this.audio.playSelect();
          this.statusMessage.setText('EVIDENCE DISCOVERED! A snarling lupine monstrosity breaks the cellar cage bars. Objective updated!');
          this.statusMessage.setColor('#10b981');
        } else {
          this.statusMessage.setText('SURVEILLANCE ARCHIVE: Sub-cellar containment breach. The subject was Lord Alistair.');
          this.statusMessage.setColor('#55d882');
        }
      }
    } else {
      this.feedImage.setTexture(this.feedKeys[channel - 1]);
      this.staticOverlay.setAlpha(0.12);
      this.statusMessage.setText(this.channelNames[channel - 1]);
      this.statusMessage.setColor('#e2ccaf');
    }

    this.updateTapeButton();
  }

  public tryInsertTape(): void {
    if (this.puzzle.isTapeInserted()) {
      this.statusMessage.setText('Surveillance Reel #3 is already loaded into drive A.');
      this.statusMessage.setColor('#55d882');
      return;
    }

    if (this.inventory.hasItem('item_cctv_tape')) {
      const inserted = this.puzzle.insertTape();
      if (inserted) {
        this.audio.playSelect();
        this.switchChannel(5);
      }
    } else {
      this.audio.playDisabled();
      this.statusMessage.setText('You do not possess Surveillance Reel #3 in your pockets.');
      this.statusMessage.setColor('#ef4444');
    }
  }

  private updateTapeButton(): void {
    if (this.puzzle.isTapeInserted()) {
      this.tapeButton.setText('[ REEL LOADED ]');
      this.tapeButton.setColor('#55d882');
    } else if (this.inventory.hasItem('item_cctv_tape')) {
      this.tapeButton.setText('[T] INSERT REEL #3');
      this.tapeButton.setColor('#f59e0b');
    } else {
      this.tapeButton.setText('[ NO REEL ]');
      this.tapeButton.setColor('#555555');
    }
  }

  public handleInput(key: string, code?: string): void {
    if (!this.isOpen) return;

    if (code === 'KeyE' || key === 'e' || key === 'E' || code === 'Escape' || key === 'Escape') {
      this.close();
      return;
    }

    if (code === 'KeyT' || key === 't' || key === 'T') {
      this.tryInsertTape();
      return;
    }

    const num = parseInt(key, 10);
    if (!isNaN(num) && num >= 1 && num <= 5) {
      this.switchChannel(num);
    }
  }
}
