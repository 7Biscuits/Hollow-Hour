import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';
import { SaveManager } from '../data/SaveManager';

interface SettingItem {
  id: string;
  name: string;
  type: 'slider' | 'toggle' | 'button';
  getValue?: () => number | boolean | string;
  onChange?: (delta: number) => void;
  onToggle?: () => void;
}

export class SettingsScene extends Phaser.Scene {
  private audioManager!: AudioManager;
  private saveManager!: SaveManager;
  private selectedIndex = 0;
  private items: SettingItem[] = [];
  private itemViews: {
    container: Phaser.GameObjects.Container;
    label: Phaser.GameObjects.Text;
    valText?: Phaser.GameObjects.Text;
    thumb?: Phaser.GameObjects.Sprite;
    barFill?: Phaser.GameObjects.Rectangle;
  }[] = [];
  private cursor!: Phaser.GameObjects.Sprite;
  private canAcceptInput = false;

  constructor() {
    super('SettingsScene');
  }

  public create(): void {
    this.audioManager = AudioManager.getInstance();
    this.saveManager = SaveManager.getInstance();
    this.canAcceptInput = false;
    this.itemViews = [];

    const { width, height } = this.scale;

    // Atmospheric backdrop
    this.add.image(width / 2, height / 2, 'mansion_sky').setOrigin(0.5, 0.5);
    const mansion = this.add.image(width / 2, height / 2, 'mansion_building').setOrigin(0.5, 0.5);
    mansion.setTint(0x1a1420);

    // Dark gothic panel (440 x 280)
    const pW = 440;
    const pH = 280;
    const panel = this.add.rectangle(width / 2, height / 2, pW, pH, 0x0c0810, 0.94);
    panel.setStrokeStyle(2, 0x4a1824);

    // Corner Ornate flourishes placed precisely in panel corners
    this.add.image(width / 2 - pW / 2 + 2, height / 2 - pH / 2 + 2, 'ui_frame').setOrigin(0, 0);
    this.add.image(width / 2 + pW / 2 - 2, height / 2 - pH / 2 + 2, 'ui_frame').setOrigin(1, 0).setFlipX(true);
    this.add.image(width / 2 - pW / 2 + 2, height / 2 + pH / 2 - 2, 'ui_frame').setOrigin(0, 1).setFlipY(true);
    this.add.image(width / 2 + pW / 2 - 2, height / 2 + pH / 2 - 2, 'ui_frame').setOrigin(1, 1).setFlipX(true).setFlipY(true);

    // Screen Title
    this.add.text(width / 2, height / 2 - 114, 'SETTINGS', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#e2ccaf',
      stroke: '#28070e',
      strokeThickness: 3,
      letterSpacing: 4
    }).setOrigin(0.5, 0.5);

    // Define Setting Items
    this.items = [
      {
        id: 'master',
        name: 'MASTER VOLUME',
        type: 'slider',
        getValue: () => Math.round(this.audioManager.settings.masterVolume * 100),
        onChange: (delta) => {
          const next = Math.max(0, Math.min(1, this.audioManager.settings.masterVolume + delta * 0.05));
          this.audioManager.setMasterVolume(next);
        }
      },
      {
        id: 'music',
        name: 'MUSIC VOLUME',
        type: 'slider',
        getValue: () => Math.round(this.audioManager.settings.musicVolume * 100),
        onChange: (delta) => {
          const next = Math.max(0, Math.min(1, this.audioManager.settings.musicVolume + delta * 0.05));
          this.audioManager.setMusicVolume(next);
        }
      },
      {
        id: 'sfx',
        name: 'SFX VOLUME',
        type: 'slider',
        getValue: () => Math.round(this.audioManager.settings.sfxVolume * 100),
        onChange: (delta) => {
          const next = Math.max(0, Math.min(1, this.audioManager.settings.sfxVolume + delta * 0.05));
          this.audioManager.setSfxVolume(next);
          this.audioManager.playHover();
        }
      },
      {
        id: 'crt',
        name: 'CRT SCANLINES',
        type: 'toggle',
        getValue: () => (this.audioManager.settings.crtFilter ? 'ENABLED' : 'DISABLED'),
        onToggle: () => {
          this.audioManager.toggleCrt();
          this.audioManager.playSelect();
        }
      },
      {
        id: 'fullscreen',
        name: 'FULLSCREEN',
        type: 'toggle',
        getValue: () => (this.scale.isFullscreen ? 'ON' : 'OFF'),
        onToggle: () => {
          if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
          } else {
            this.scale.startFullscreen();
          }
          this.audioManager.playSelect();
        }
      },
      {
        id: 'save_toggle',
        name: 'TEST SAVE DATA',
        type: 'button',
        getValue: () => (this.saveManager.hasSave() ? '[DELETE SAVE]' : '[CREATE SAVE]'),
        onToggle: () => {
          if (this.saveManager.hasSave()) {
            this.saveManager.deleteSave();
            this.audioManager.playBack();
          } else {
            this.saveManager.createSave();
            this.audioManager.playSelect();
          }
        }
      },
      {
        id: 'back',
        name: 'RETURN TO MENU',
        type: 'button',
        onToggle: () => this.goBack()
      }
    ];

    // Render Setting Rows
    const startY = height / 2 - 76;
    const spacing = 27;

    this.items.forEach((item, index) => {
      const rowY = startY + index * spacing;
      const rowContainer = this.add.container(width / 2, rowY);

      // Label
      const label = this.add.text(-170, 0, item.name, {
        fontFamily: "'Cinzel Decorative', 'MedievalSharp', serif",
        fontSize: '11px',
        color: index === 0 ? '#f4dec3' : '#a29285',
        letterSpacing: 2
      }).setOrigin(0, 0.5);
      rowContainer.add(label);

      let valText: Phaser.GameObjects.Text | undefined;
      let thumb: Phaser.GameObjects.Sprite | undefined;
      let barFill: Phaser.GameObjects.Rectangle | undefined;

      if (item.type === 'slider') {
        const track = this.add.image(70, 0, 'ui_slider_track').setOrigin(0.5, 0.5);
        track.setScale(0.7, 0.8);
        rowContainer.add(track);

        const trackW = 140;
        barFill = this.add.rectangle(0, 0, 0, 4, 0x9b2226).setOrigin(0, 0.5);
        rowContainer.add(barFill);

        thumb = this.add.sprite(0, 0, 'ui_slider_thumb').setScale(0.8);
        rowContainer.add(thumb);

        valText = this.add.text(160, 0, `${item.getValue?.()}%`, {
          fontFamily: "'VT323', monospace",
          fontSize: '13px',
          color: '#d4af37'
        }).setOrigin(0, 0.5);
        rowContainer.add(valText);

        track.setInteractive({ useHandCursor: true });
        track.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
          if (!this.canAcceptInput) return;
          const localX = pointer.x - (width / 2 + 70 - trackW / 2);
          const ratio = Math.max(0, Math.min(1, localX / trackW));
          if (item.id === 'master') this.audioManager.setMasterVolume(ratio);
          if (item.id === 'music') this.audioManager.setMusicVolume(ratio);
          if (item.id === 'sfx') this.audioManager.setSfxVolume(ratio);
          this.selectedIndex = index;
          this.refreshUI();
          this.audioManager.playHover();
        });
      } else if (item.type === 'toggle' || item.type === 'button') {
        const valStr = item.getValue ? String(item.getValue()) : '';
        valText = this.add.text(120, 0, valStr, {
          fontFamily: "'Cinzel Decorative', 'MedievalSharp', serif",
          fontSize: '11px',
          color: '#c9965d'
        }).setOrigin(0.5, 0.5);
        rowContainer.add(valText);
      }

      const hitRect = new Phaser.Geom.Rectangle(-180, -12, 360, 24);
      rowContainer.setSize(360, 24);
      rowContainer.setInteractive(hitRect, Phaser.Geom.Rectangle.Contains);

      rowContainer.on('pointerover', () => {
        if (!this.canAcceptInput) return;
        if (this.selectedIndex !== index) {
          this.selectedIndex = index;
          this.audioManager.playHover();
          this.refreshUI();
        }
      });

      rowContainer.on('pointerdown', () => {
        if (!this.canAcceptInput) return;
        if (item.type === 'toggle' || item.type === 'button') {
          item.onToggle?.();
          this.refreshUI();
        }
      });

      this.itemViews.push({ container: rowContainer, label, valText, thumb, barFill });
    });

    // Dagger Cursor
    this.cursor = this.add.sprite(width / 2 - 185, startY, 'ui_cursor');
    this.cursor.setOrigin(0.5, 0.5);

    // Setup Keyboard Controls
    this.setupKeyboardInput();

    // Footer Hint
    this.add.text(width / 2, height / 2 + 122, '[UP/DOWN] NAVIGATE • [LEFT/RIGHT] ADJUST • [ENTER] SELECT • [ESC] BACK', {
      fontFamily: "'VT323', monospace",
      fontSize: '11px',
      color: '#655762',
      letterSpacing: 1.5
    }).setOrigin(0.5, 0.5);

    this.refreshUI();

    // Debounce input to prevent key bleeding from previous scene
    this.time.delayedCall(200, () => {
      this.canAcceptInput = true;
    });

    this.events.on('shutdown', () => {
      this.input.keyboard?.removeAllListeners();
    });
  }

  private refreshUI(): void {
    const { height } = this.scale;
    const startY = height / 2 - 76;
    const spacing = 27;

    this.items.forEach((item, idx) => {
      const view = this.itemViews[idx];
      const isSelected = idx === this.selectedIndex;

      view.label.setColor(isSelected ? '#f4dec3' : '#9d8a7c');

      if (item.type === 'slider') {
        const trackW = 140;
        const trackLeft = 70 - trackW / 2;
        let val = 0;
        if (item.id === 'master') val = this.audioManager.settings.masterVolume;
        if (item.id === 'music') val = this.audioManager.settings.musicVolume;
        if (item.id === 'sfx') val = this.audioManager.settings.sfxVolume;

        if (view.thumb) {
          view.thumb.x = trackLeft + trackW * val;
          view.thumb.setTint(isSelected ? 0xffffff : 0xaa9988);
        }
        if (view.barFill) {
          view.barFill.x = trackLeft;
          view.barFill.width = trackW * val;
        }
        if (view.valText) {
          view.valText.setText(`${Math.round(val * 100)}%`);
          view.valText.setColor(isSelected ? '#fff2b2' : '#c89d4b');
        }
      } else if (item.type === 'toggle' || item.type === 'button') {
        if (view.valText && item.getValue) {
          view.valText.setText(String(item.getValue()));
          view.valText.setColor(isSelected ? '#fff2b2' : '#c89d4b');
        }
      }
    });

    this.tweens.add({
      targets: this.cursor,
      y: startY + this.selectedIndex * spacing,
      duration: 100,
      ease: 'Cubic.easeOut'
    });
  }

  private setupKeyboardInput(): void {
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (!this.canAcceptInput) return;

      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W': {
          this.selectedIndex = (this.selectedIndex - 1 + this.items.length) % this.items.length;
          this.audioManager.playHover();
          this.refreshUI();
          break;
        }
        case 'ArrowDown':
        case 's':
        case 'S': {
          this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
          this.audioManager.playHover();
          this.refreshUI();
          break;
        }
        case 'ArrowLeft':
        case 'a':
        case 'A': {
          const item = this.items[this.selectedIndex];
          if (item.type === 'slider') {
            item.onChange?.(-1);
            this.refreshUI();
          }
          break;
        }
        case 'ArrowRight':
        case 'd':
        case 'D': {
          const item = this.items[this.selectedIndex];
          if (item.type === 'slider') {
            item.onChange?.(1);
            this.refreshUI();
          }
          break;
        }
        case 'Enter':
        case ' ': {
          const item = this.items[this.selectedIndex];
          if (item.type === 'toggle' || item.type === 'button') {
            item.onToggle?.();
            this.refreshUI();
          }
          break;
        }
        case 'Escape': {
          this.goBack();
          break;
        }
      }
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
