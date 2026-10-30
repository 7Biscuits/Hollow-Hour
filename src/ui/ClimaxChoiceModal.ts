import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';
import { InventorySystem } from '../systems/InventorySystem';
import { EndingType } from '../scenes/EndingScene';

export class ClimaxChoiceModal {
  private scene: Phaser.Scene;
  private audio: AudioManager;
  private inventory: InventorySystem;
  private container!: Phaser.GameObjects.Container;
  private isOpen: boolean = false;
  private onSelectEndingCallback?: (ending: EndingType) => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.audio = AudioManager.getInstance();
    this.inventory = InventorySystem.getInstance();
    this.createModal();
  }

  private createModal(): void {
    const { width, height } = this.scale;
    this.container = this.scene.add.container(0, 0).setDepth(3000).setVisible(false);

    // Dark backdrop scrim
    const scrim = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x050308, 0.92);
    this.container.add(scrim);

    // Modal frame (540x300)
    const mW = 540;
    const mH = 300;
    const panel = this.scene.add.rectangle(width / 2, height / 2, mW, mH, 0x0e0712, 0.96);
    panel.setStrokeStyle(2, 0x831843);
    this.container.add(panel);

    // Corner Ornate flourishes
    const f1 = this.scene.add.image(width / 2 - mW / 2 + 2, height / 2 - mH / 2 + 2, 'ui_frame').setOrigin(0, 0);
    const f2 = this.scene.add.image(width / 2 + mW / 2 - 2, height / 2 - mH / 2 + 2, 'ui_frame').setOrigin(1, 0).setFlipX(true);
    const f3 = this.scene.add.image(width / 2 - mW / 2 + 2, height / 2 + mH / 2 - 2, 'ui_frame').setOrigin(0, 1).setFlipY(true);
    const f4 = this.scene.add.image(width / 2 + mW / 2 - 2, height / 2 + mH / 2 - 2, 'ui_frame').setOrigin(1, 1).setFlipX(true).setFlipY(true);
    this.container.add([f1, f2, f3, f4]);

    // Header Title
    const title = this.scene.add.text(width / 2, height / 2 - 120, 'THE HOLLOW HOUR — 3:33 AM', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#fef08a',
      stroke: '#4c0519',
      strokeThickness: 3,
      letterSpacing: 3
    }).setOrigin(0.5, 0.5);

    const desc = this.scene.add.text(width / 2, height / 2 - 86,
      'The obsidian altar blazes with a blinding lunar resonance. Across the circle,\nthe Werewolf rears upon its hind legs, razor talons dripping venom.\nLord Alistair\'s tortured soul screams through the stone. Choose your fate:', {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '10px',
      color: '#d4c5b3',
      align: 'center',
      lineSpacing: 4
    }).setOrigin(0.5, 0.5);
    this.container.add([title, desc]);

    // Choices
    const hasDagger = this.inventory.hasItem('item_ritual_dagger');
    const hasSigil = this.inventory.hasItem('item_silver_sigil');
    const canExorcise = hasDagger && hasSigil;

    // Choice 1: Sever Lunar Tether
    const btn1 = this.createChoiceRow(
      width / 2,
      height / 2 - 24,
      '[1] SEVER THE LUNAR TETHER',
      canExorcise
        ? 'Drive the Ceremonial Athame through the Silver Sigil to destroy the curse and liberate the spirits.'
        : 'Requires Ceremonial Athame and Silver Sigil to shatter the lunar link.',
      canExorcise ? 0x22c55e : 0x71717a,
      () => {
        if (canExorcise) this.selectEnding('severed_curse');
        else this.audio.playDisabled();
      }
    );

    // Choice 2: Become the Hollow Heir
    const btn2 = this.createChoiceRow(
      width / 2,
      height / 2 + 36,
      '[2] CLAIM THE BEAST (THE HOLLOW HEIR)',
      'Slice your palm across the central runes and surrender your soul to inherit the immortal predator.',
      0xef4444,
      () => {
        this.selectEnding('beast_eternal');
      }
    );

    // Choice 3: Immolate the Sanctum
    const btn3 = this.createChoiceRow(
      width / 2,
      height / 2 + 96,
      '[3] IMMOLATE THE SANCTUM (ASH & MEMORY)',
      'Shatter the brass oil lantern into the chemical drums, engulfing Blackwood Manor in eternal fire.',
      0xf97316,
      () => {
        this.selectEnding('ash_memory');
      }
    );

    this.container.add([btn1, btn2, btn3]);
  }

  private get scale(): { width: number; height: number } {
    return this.scene.scale;
  }

  private createChoiceRow(
    x: number,
    y: number,
    title: string,
    desc: string,
    accentColor: number,
    onClick: () => void
  ): Phaser.GameObjects.Container {
    const row = this.scene.add.container(x, y);

    const bg = this.scene.add.rectangle(0, 0, 500, 48, 0x140a1b, 0.9);
    bg.setStrokeStyle(1, 0x4a1828);

    const titleText = this.scene.add.text(-230, -10, title, {
      fontFamily: "'VT323', monospace",
      fontSize: '14px',
      color: Phaser.Display.Color.IntegerToColor(accentColor).rgba,
      letterSpacing: 2
    }).setOrigin(0, 0.5);

    const descText = this.scene.add.text(-230, 10, desc, {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '9.5px',
      color: '#a89a8c'
    }).setOrigin(0, 0.5);

    row.add([bg, titleText, descText]);

    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerover', () => {
      bg.setFillStyle(0x280e22);
      bg.setStrokeStyle(1.5, accentColor);
      titleText.setColor('#fef08a');
      this.audio.playHover();
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(0x140a1b);
      bg.setStrokeStyle(1, 0x4a1828);
      titleText.setColor(Phaser.Display.Color.IntegerToColor(accentColor).rgba);
    });
    bg.on('pointerdown', () => {
      onClick();
    });

    return row;
  }

  public open(onSelectEnding: (ending: EndingType) => void): void {
    this.onSelectEndingCallback = onSelectEnding;
    this.isOpen = true;
    this.container.destroy();
    this.createModal();
    this.container.setVisible(true);
    this.audio.playSelect();
  }

  public close(): void {
    this.isOpen = false;
    this.container.setVisible(false);
  }

  public getIsOpen(): boolean {
    return this.isOpen;
  }

  public handleInput(key: string, code: string): void {
    if (!this.isOpen) return;

    if (key === '1' || code === 'Digit1') {
      const hasDagger = this.inventory.hasItem('item_ritual_dagger');
      const hasSigil = this.inventory.hasItem('item_silver_sigil');
      if (hasDagger && hasSigil) {
        this.selectEnding('severed_curse');
      } else {
        this.audio.playDisabled();
      }
    } else if (key === '2' || code === 'Digit2') {
      this.selectEnding('beast_eternal');
    } else if (key === '3' || code === 'Digit3') {
      this.selectEnding('ash_memory');
    } else if (key === 'Escape' || code === 'Escape') {
      this.close();
    }
  }

  private selectEnding(ending: EndingType): void {
    this.audio.playSelect();
    this.close();
    if (this.onSelectEndingCallback) {
      this.onSelectEndingCallback(ending);
    }
  }
}
