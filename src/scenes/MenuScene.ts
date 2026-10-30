import Phaser from 'phaser';
import { MenuButton } from '../ui/MenuButton';
import { AudioManager } from '../audio/AudioManager';
import { SaveManager } from '../data/SaveManager';

export class MenuScene extends Phaser.Scene {
  private buttons: MenuButton[] = [];
  private selectedIndex = 0;
  private cursorSprite!: Phaser.GameObjects.Sprite;
  private fog1!: Phaser.GameObjects.TileSprite;
  private fog2!: Phaser.GameObjects.TileSprite;
  private titleText!: Phaser.GameObjects.Text;
  private audioManager!: AudioManager;
  private saveManager!: SaveManager;
  private lightningRect!: Phaser.GameObjects.Rectangle;
  private isTransitioning = false;

  constructor() {
    super('MenuScene');
  }

  public create(): void {
    this.audioManager = AudioManager.getInstance();
    this.saveManager = SaveManager.getInstance();
    this.isTransitioning = false;

    const { width, height } = this.scale;

    // 1. Background Layers
    // Sky
    this.add.image(width / 2, height / 2, 'mansion_sky').setOrigin(0.5, 0.5);

    // Mansion facade
    this.add.image(width / 2, height / 2, 'mansion_building').setOrigin(0.5, 0.5);

    // Window Candlelight Glows (pulsing warm light on lit windows)
    const windowPositions = [
      { x: 320, y: 95 },  // Top master attic tower window
      { x: 255, y: 150 }, // 2nd floor left window
      { x: 190, y: 200 }, // Left wing library
      { x: 435, y: 255 }  // Right wing parlor
    ];

    windowPositions.forEach(pos => {
      const glow = this.add.image(pos.x, pos.y, 'window_glow');
      glow.setOrigin(0.5, 0.5);
      glow.setScale(0.5 + Math.random() * 0.2);
      glow.setAlpha(0.65);
      glow.setBlendMode(Phaser.BlendModes.ADD);

      // Random candlelight flicker tween
      this.tweens.add({
        targets: glow,
        alpha: { from: 0.35, to: 0.8 },
        scale: { from: glow.scaleX * 0.9, to: glow.scaleX * 1.15 },
        duration: 250 + Math.random() * 350,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      return glow;
    });

    // Midground Fog layer 1
    this.fog1 = this.add.tileSprite(width / 2, height - 70, width, 180, 'fog_layer_1');
    this.fog1.setAlpha(0.5);
    this.fog1.setBlendMode(Phaser.BlendModes.SCREEN);

    // Foreground Grounds: Cobblestone path, wrought iron gates, dead trees, gravestones
    this.add.image(width / 2, height / 2, 'mansion_foreground').setOrigin(0.5, 0.5);

    // Gate Lantern Glows
    const lanternPositions = [
      { x: 219, y: 270 },
      { x: 419, y: 270 }
    ];
    lanternPositions.forEach(pos => {
      const glow = this.add.image(pos.x, pos.y, 'window_glow');
      glow.setScale(0.4);
      glow.setAlpha(0.75);
      glow.setBlendMode(Phaser.BlendModes.ADD);

      this.tweens.add({
        targets: glow,
        alpha: { from: 0.55, to: 0.9 },
        duration: 180 + Math.random() * 200,
        yoyo: true,
        repeat: -1,
        ease: 'Quad.easeInOut'
      });

      return glow;
    });

    // Foreground Drifting Fog layer 2
    this.fog2 = this.add.tileSprite(width / 2, height - 40, width, 180, 'fog_layer_2');
    this.fog2.setAlpha(0.35);
    this.fog2.setBlendMode(Phaser.BlendModes.SCREEN);

    // Atmospheric Floating Dust Particles / Spores
    this.add.particles(0, 0, 'particle_dust', {
      x: { min: 0, max: width },
      y: { min: 0, max: height },
      lifespan: 7000,
      speedX: { min: -12, max: 18 },
      speedY: { min: -15, max: -4 },
      scale: { start: 0.6, end: 1.2 },
      alpha: { start: 0.1, end: 0.65 },
      quantity: 1,
      frequency: 240,
      blendMode: Phaser.BlendModes.ADD
    });

    // Distant Lightning Flash overlay
    this.lightningRect = this.add.rectangle(width / 2, height / 2, width, height, 0xd0d8f0, 0);
    this.lightningRect.setDepth(40);
    this.scheduleLightning();

    // 2. Ornate Menu Plaque (Gothic backing for options)
    const plaqueY = 230;
    const plaque = this.add.image(width / 2, plaqueY, 'ui_plaque');
    plaque.setOrigin(0.5, 0.5);
    plaque.setDepth(15);
    plaque.setScale(1.05, 0.95);

    // 3. Animated Candle Sconces flanking the Menu Plaque
    const leftCandle = this.add.sprite(width / 2 - 135, plaqueY - 5, 'candle_anim');
    leftCandle.play('candle_flicker');
    leftCandle.setScale(1.1);
    leftCandle.setDepth(20);

    const rightCandle = this.add.sprite(width / 2 + 135, plaqueY - 5, 'candle_anim');
    rightCandle.play('candle_flicker');
    rightCandle.setScale(1.1);
    rightCandle.setFlipX(true);
    rightCandle.setDepth(20);

    // Candle ambient light glows
    const cGlowL = this.add.image(width / 2 - 135, plaqueY - 15, 'window_glow').setScale(0.35).setAlpha(0.45).setBlendMode(Phaser.BlendModes.ADD).setDepth(19);
    const cGlowR = this.add.image(width / 2 + 135, plaqueY - 15, 'window_glow').setScale(0.35).setAlpha(0.45).setBlendMode(Phaser.BlendModes.ADD).setDepth(19);
    this.tweens.add({
      targets: [cGlowL, cGlowR],
      alpha: { from: 0.35, to: 0.65 },
      duration: 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 4. Ornate Title Treatment: "THE HOLLOW HOUR"
    this.createTitle(width / 2, 70);

    // 5. Menu Options
    this.createMenuOptions(width / 2, 172);

    // 6. Gothic Dagger Cursor
    this.cursorSprite = this.add.sprite(width / 2 - 80, 172, 'ui_cursor');
    this.cursorSprite.setOrigin(0.5, 0.5);
    this.cursorSprite.setDepth(30);

    // Floating bob animation for cursor
    this.tweens.add({
      targets: this.cursorSprite,
      x: '-=3',
      duration: 550,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 7. Keyboard navigation
    this.setupKeyboardInput();

    // 8. Footer Instructions & Version
    this.createFooter(width, height);

    // Initialize selection
    this.updateCursorPosition(false);

    // Audio Autoplay prompt listener
    this.input.once('pointerdown', () => {
      this.audioManager.startHorrorAmbience();
    });
    this.input.keyboard?.once('keydown', () => {
      this.audioManager.startHorrorAmbience();
    });

    this.events.on('shutdown', () => {
      this.input.keyboard?.removeAllListeners();
    });
  }

  private createTitle(x: number, y: number): void {
    const titleGlow = this.add.image(x, y - 5, 'window_glow');
    titleGlow.setScale(2.5, 0.8);
    titleGlow.setAlpha(0.2);
    titleGlow.setTint(0x8a1828);
    titleGlow.setBlendMode(Phaser.BlendModes.ADD);

    this.add.text(x + 2, y + 2, 'THE HOLLOW HOUR', {
      fontFamily: "'Cinzel Decorative', 'MedievalSharp', serif",
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#030204',
      letterSpacing: 5,
      align: 'center'
    }).setOrigin(0.5, 0.5);

    this.titleText = this.add.text(x, y, 'THE HOLLOW HOUR', {
      fontFamily: "'Cinzel Decorative', 'MedievalSharp', serif",
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#d6c4a8',
      stroke: '#2a0910',
      strokeThickness: 5,
      letterSpacing: 5,
      align: 'center'
    }).setOrigin(0.5, 0.5);

    this.add.text(x, y + 23, '— A TALE OF GOTHIC DESPAIR —', {
      fontFamily: "'MedievalSharp', 'Cinzel Decorative', serif",
      fontSize: '9px',
      fontStyle: 'italic',
      color: '#8c7b6c',
      letterSpacing: 4,
      align: 'center'
    }).setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: [this.titleText],
      alpha: { from: 0.88, to: 1 },
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.time.addEvent({
      delay: 3500,
      loop: true,
      callback: () => {
        this.tweens.add({
          targets: titleGlow,
          alpha: { from: 0.15, to: 0.4 },
          duration: 300,
          yoyo: true,
          repeat: 1
        });
      }
    });
  }

  private createMenuOptions(centerX: number, startY: number): void {
    const hasSave = this.saveManager.hasSave();
    const spacing = 28;

    const options = [
      {
        text: 'NEW GAME',
        disabled: false,
        action: () => this.startNewGame()
      },
      {
        text: 'CONTINUE',
        disabled: !hasSave,
        action: () => this.continueGame()
      },
      {
        text: 'SETTINGS',
        disabled: false,
        action: () => this.openSettings()
      },
      {
        text: 'CREDITS',
        disabled: false,
        action: () => this.openCredits()
      },
      {
        text: 'EXIT TO DESKTOP',
        disabled: false,
        action: () => this.promptExit()
      }
    ];

    this.buttons = options.map((opt, index) => {
      const btnY = startY + index * spacing;
      const btn = new MenuButton(this, {
        x: centerX,
        y: btnY,
        text: opt.text,
        disabled: opt.disabled,
        onSelect: opt.action,
        onHover: () => {
          this.setSelectedIndex(index);
        }
      });
      btn.setDepth(25);
      return btn;
    });

    this.selectedIndex = hasSave ? 1 : 0;
    this.buttons[this.selectedIndex].setSelected(true);
  }

  private setSelectedIndex(index: number): void {
    if (this.selectedIndex === index) return;
    this.buttons[this.selectedIndex].setSelected(false);
    this.selectedIndex = index;
    this.buttons[this.selectedIndex].setSelected(true);
    this.updateCursorPosition(true);
  }

  private updateCursorPosition(animate: boolean): void {
    const currentBtn = this.buttons[this.selectedIndex];
    if (!currentBtn || !this.cursorSprite) return;

    // Align cursor tip neatly to the left of the button's text
    const textWidth = currentBtn.getTextWidth();
    const targetX = currentBtn.x - textWidth / 2 - 18;
    const targetY = currentBtn.y;

    if (animate) {
      this.tweens.add({
        targets: this.cursorSprite,
        x: targetX,
        y: targetY,
        duration: 120,
        ease: 'Cubic.easeOut'
      });
    } else {
      this.cursorSprite.setPosition(targetX, targetY);
    }
  }

  private setupKeyboardInput(): void {
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (this.isTransitioning) return;
      this.audioManager.startHorrorAmbience();

      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W': {
          let next = this.selectedIndex - 1;
          if (next < 0) next = this.buttons.length - 1;
          this.setSelectedIndex(next);
          break;
        }
        case 'ArrowDown':
        case 's':
        case 'S': {
          let next = this.selectedIndex + 1;
          if (next >= this.buttons.length) next = 0;
          this.setSelectedIndex(next);
          break;
        }
        case 'Enter':
        case ' ': {
          this.buttons[this.selectedIndex].triggerSelect();
          break;
        }
      }
    });
  }

  private scheduleLightning(): void {
    const triggerNext = () => {
      const delay = 12000 + Math.random() * 16000;
      this.time.delayedCall(delay, () => {
        this.flashLightning();
        triggerNext();
      });
    };
    triggerNext();
  }

  private flashLightning(): void {
    if (this.isTransitioning) return;

    this.tweens.add({
      targets: this.lightningRect,
      alpha: 0.65,
      duration: 50,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        this.lightningRect.setAlpha(0);
        this.time.delayedCall(300, () => {
          this.audioManager.playThunder();
        });
      }
    });
  }

  private createFooter(width: number, height: number): void {
    const footerText = this.add.text(
      width / 2,
      height - 15,
      '[W/S] OR [ARROWS] NAVIGATE • [ENTER] SELECT • [ESC] BACK',
      {
        fontFamily: "'VT323', monospace",
        fontSize: '11px',
        color: '#958b99',
        stroke: '#050307',
        strokeThickness: 2,
        letterSpacing: 1.5
      }
    ).setOrigin(0.5, 0.5).setDepth(35);

    this.tweens.add({
      targets: footerText,
      alpha: { from: 0.5, to: 0.9 },
      duration: 1600,
      yoyo: true,
      repeat: -1
    });

    this.add.text(width - 10, height - 15, 'v0.9.4', {
      fontFamily: "'VT323', monospace",
      fontSize: '11px',
      color: '#706775',
      stroke: '#050307',
      strokeThickness: 2
    }).setOrigin(1, 0.5).setDepth(35);
  }

  // --- Menu Actions ---

  private startNewGame(): void {
    this.isTransitioning = true;
    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene', { mode: 'new' });
    });
  }

  private continueGame(): void {
    if (!this.saveManager.hasSave()) {
      this.audioManager.playDisabled();
      return;
    }
    this.isTransitioning = true;
    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene', { mode: 'continue' });
    });
  }

  private openSettings(): void {
    this.isTransitioning = true;
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('SettingsScene');
    });
  }

  private openCredits(): void {
    this.isTransitioning = true;
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('CreditsScene');
    });
  }

  private promptExit(): void {
    const { width, height } = this.scale;
    const modalBg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.78).setDepth(100);
    const box = this.add.rectangle(width / 2, height / 2, 320, 135, 0x140e18, 0.96).setDepth(101);
    box.setStrokeStyle(2, 0x5a1824);

    const title = this.add.text(width / 2, height / 2 - 38, 'LEAVE THE MANSION?', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '14px',
      color: '#e4c39e',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5).setDepth(102);

    const desc = this.add.text(width / 2, height / 2 - 10, 'The hollow hour awaits your return in the dark.', {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '11px',
      color: '#8d7b73'
    }).setOrigin(0.5, 0.5).setDepth(102);

    const closeBtn = this.add.text(width / 2, height / 2 + 30, '[ RETURN TO MENU ]', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '12px',
      color: '#c9965d'
    }).setOrigin(0.5, 0.5).setDepth(102).setInteractive({ useHandCursor: true });

    closeBtn.on('pointerover', () => closeBtn.setColor('#ffffff'));
    closeBtn.on('pointerout', () => closeBtn.setColor('#c9965d'));
    closeBtn.on('pointerdown', () => {
      this.audioManager.playBack();
      modalBg.destroy();
      box.destroy();
      title.destroy();
      desc.destroy();
      closeBtn.destroy();
    });
  }

  public update(_time: number, delta: number): void {
    if (this.fog1) {
      this.fog1.tilePositionX += 0.015 * delta;
    }
    if (this.fog2) {
      this.fog2.tilePositionX += 0.035 * delta;
    }
  }
}
