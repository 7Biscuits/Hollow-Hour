import Phaser from 'phaser';
import { InventorySystem } from '../systems/InventorySystem';
import { InventoryItem } from '../types';
import { AudioManager } from '../audio/AudioManager';

export class InventoryUI {
  private scene: Phaser.Scene;
  private inventory: InventorySystem;
  private audio: AudioManager;

  private container!: Phaser.GameObjects.Container;
  private isOpen: boolean = false;
  private selectedIndex: number = 0;
  private combineSourceIndex: number | null = null;

  // UI Components
  private slotSprites: Phaser.GameObjects.Sprite[] = [];
  private slotIcons: Phaser.GameObjects.Image[] = [];
  private itemTitleText!: Phaser.GameObjects.Text;
  private itemCategoryText!: Phaser.GameObjects.Text;
  private itemDescText!: Phaser.GameObjects.Text;
  private actionHintText!: Phaser.GameObjects.Text;
  private bannerText!: Phaser.GameObjects.Text;

  private onUseCallback?: (item: InventoryItem) => void;
  private onCloseCallback?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.inventory = InventorySystem.getInstance();
    this.audio = AudioManager.getInstance();
    this.createUI();
  }

  private createUI(): void {
    const { width, height } = this.scene.scale;

    this.container = this.scene.add.container(0, 0).setDepth(3000).setVisible(false);

    // 1. Dark semi-transparent scrim
    const scrim = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x060408, 0.88);
    scrim.setInteractive(); // Block click-through to game
    this.container.add(scrim);

    // 2. Gothic Frame / Panel (520x280)
    const panelBg = this.scene.add.rectangle(width / 2, height / 2, 520, 270, 0x140e16, 0.98);
    panelBg.setStrokeStyle(2, 0x7a5a3a);
    this.container.add(panelBg);

    const innerPanel = this.scene.add.rectangle(width / 2, height / 2, 510, 260, 0x0f0b12, 0.9);
    innerPanel.setStrokeStyle(1, 0x4a321e);
    this.container.add(innerPanel);

    // Header Title
    this.bannerText = this.scene.add.text(width / 2, height / 2 - 115, 'INSPECTOR\'S POCKETS', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#e2ccaf',
      stroke: '#3b1016',
      strokeThickness: 3,
      letterSpacing: 3
    }).setOrigin(0.5, 0.5);
    this.container.add(this.bannerText);

    // Close button / hint
    const closeHint = this.scene.add.text(width / 2 + 230, height / 2 - 115, '[TAB / ESC]', {
      fontFamily: "'VT323', monospace",
      fontSize: '13px',
      color: '#8d6e4f'
    }).setOrigin(1, 0.5);
    this.container.add(closeHint);

    // Left Grid: 10 Slots (2 rows of 5)
    const startX = width / 2 - 220;
    const startY = height / 2 - 55;
    const slotSize = 42;

    for (let i = 0; i < 10; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = startX + col * (slotSize + 6) + 21;
      const y = startY + row * (slotSize + 8) + 21;

      // Slot background
      const slot = this.scene.add.sprite(x, y, 'ui_slot').setScale(1.15);
      slot.setInteractive({ useHandCursor: true });

      const slotIdx = i;
      slot.on('pointerdown', () => {
        this.selectSlot(slotIdx);
      });
      slot.on('pointerover', () => {
        if (this.selectedIndex !== slotIdx) {
          this.audio.playHover();
          this.selectSlot(slotIdx);
        }
      });

      // Item icon
      const icon = this.scene.add.image(x, y, 'icon_key_brass').setScale(0.95).setVisible(false);

      this.slotSprites.push(slot);
      this.slotIcons.push(icon);
      this.container.add(slot);
      this.container.add(icon);
    }

    // Divider line
    const divider = this.scene.add.line(width / 2 + 35, height / 2 + 10, 0, -85, 0, 85, 0x4a321e);
    this.container.add(divider);

    // Right Side: Item Details Panel
    const detailX = width / 2 + 50;

    this.itemTitleText = this.scene.add.text(detailX, height / 2 - 80, '', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#f59e0b',
      stroke: '#241416',
      strokeThickness: 2
    });
    this.container.add(this.itemTitleText);

    this.itemCategoryText = this.scene.add.text(detailX, height / 2 - 62, '', {
      fontFamily: "'VT323', monospace",
      fontSize: '12px',
      color: '#9ca3af',
      letterSpacing: 2
    });
    this.container.add(this.itemCategoryText);

    this.itemDescText = this.scene.add.text(detailX, height / 2 - 40, '', {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '10px',
      color: '#d5c5aa',
      wordWrap: { width: 190 },
      lineSpacing: 4
    });
    this.container.add(this.itemDescText);

    // Bottom Action Prompts
    this.actionHintText = this.scene.add.text(width / 2, height / 2 + 105, '[E / ENTER] EXAMINE    [U] USE    [C] COMBINE    [TAB / ESC] CLOSE', {
      fontFamily: "'VT323', monospace",
      fontSize: '12px',
      color: '#c5a07c',
      letterSpacing: 2
    }).setOrigin(0.5, 0.5);
    this.container.add(this.actionHintText);
  }

  public open(onUse?: (item: InventoryItem) => void, onClose?: () => void): void {
    this.onUseCallback = onUse;
    this.onCloseCallback = onClose;
    this.isOpen = true;
    this.combineSourceIndex = null;
    this.container.setVisible(true);
    this.refreshSlots();
    this.selectSlot(0);
    this.audio.playSelect();
  }

  public close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.combineSourceIndex = null;
    this.container.setVisible(false);
    this.audio.playBack();
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }

  public getIsOpen(): boolean {
    return this.isOpen;
  }

  public refreshSlots(): void {
    const items = this.inventory.getItems();

    for (let i = 0; i < 10; i++) {
      const item = items[i];
      if (item && item.icon && this.scene.textures.exists(item.icon)) {
        this.slotIcons[i].setTexture(item.icon).setVisible(true);
      } else {
        this.slotIcons[i].setVisible(false);
      }
    }
    this.updateDetails();
  }

  public selectSlot(index: number): void {
    if (index < 0 || index >= 10) return;

    this.selectedIndex = index;

    for (let i = 0; i < 10; i++) {
      if (i === this.selectedIndex) {
        this.slotSprites[i].setTexture('ui_slot_selected');
      } else {
        this.slotSprites[i].setTexture('ui_slot');
      }
    }

    this.updateDetails();
  }

  private updateDetails(): void {
    const item = this.inventory.getItemAt(this.selectedIndex);

    if (item) {
      this.itemTitleText.setText(item.name);
      this.itemCategoryText.setText(`[ ${item.category.toUpperCase()} ]`);
      this.itemDescText.setText(item.description);

      if (this.combineSourceIndex !== null) {
        const sourceItem = this.inventory.getItemAt(this.combineSourceIndex);
        this.actionHintText.setText(`Combine [${sourceItem?.name}] with [${item.name}]? Press [C] or [ENTER]`);
      } else {
        const useHint = item.canUse ? '[U] USE    ' : '';
        this.actionHintText.setText(`[E / ENTER] EXAMINE    ${useHint}[C] COMBINE    [TAB / ESC] CLOSE`);
      }
    } else {
      this.itemTitleText.setText('Empty Slot');
      this.itemCategoryText.setText('[ UNUSED ]');
      this.itemDescText.setText('There is nothing here. Deep shadows fill the empty pocket.');
      this.actionHintText.setText('[TAB / ESC] CLOSE');
    }
  }

  public handleInput(key: string, code?: string): void {
    if (!this.isOpen) return;

    if (code === 'Escape' || key === 'Escape' || code === 'Tab' || key === 'Tab' || code === 'KeyI' || key === 'i') {
      this.close();
      return;
    }

    switch (key) {
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (this.selectedIndex < 9) {
          this.audio.playHover();
          this.selectSlot(this.selectedIndex + 1);
        }
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (this.selectedIndex > 0) {
          this.audio.playHover();
          this.selectSlot(this.selectedIndex - 1);
        }
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (this.selectedIndex + 5 < 10) {
          this.audio.playHover();
          this.selectSlot(this.selectedIndex + 5);
        }
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (this.selectedIndex - 5 >= 0) {
          this.audio.playHover();
          this.selectSlot(this.selectedIndex - 5);
        }
        break;
      case 'Enter':
        const itemAtSlot = this.inventory.getItemAt(this.selectedIndex);
        if (itemAtSlot && itemAtSlot.canUse) {
          this.triggerUse();
        } else {
          this.triggerExamineOrCombine();
        }
        break;
      case 'e':
      case 'E':
      case 'KeyE':
        this.triggerExamineOrCombine();
        break;
      case 'u':
      case 'U':
      case 'KeyU':
        this.triggerUse();
        break;
      case 'c':
      case 'C':
      case 'KeyC':
        this.startOrExecuteCombine();
        break;
      case 'Escape':
      case 'Tab':
      case 'i':
      case 'I':
        this.close();
        break;
    }
  }

  private triggerExamineOrCombine(): void {
    if (this.combineSourceIndex !== null) {
      this.startOrExecuteCombine();
      return;
    }

    const item = this.inventory.getItemAt(this.selectedIndex);
    if (!item) {
      this.audio.playDisabled();
      return;
    }

    this.audio.playSelect();
    // Show full examine text in description
    this.itemDescText.setText(item.examineText);
  }

  private triggerUse(): void {
    const item = this.inventory.getItemAt(this.selectedIndex);
    if (!item || !item.canUse) {
      this.audio.playDisabled();
      return;
    }

    this.audio.playSelect();
    const chosen = item;
    this.close();
    if (this.onUseCallback) {
      this.onUseCallback(chosen);
    }
  }

  private startOrExecuteCombine(): void {
    const currentItem = this.inventory.getItemAt(this.selectedIndex);
    if (!currentItem) {
      this.audio.playDisabled();
      return;
    }

    if (this.combineSourceIndex === null) {
      this.combineSourceIndex = this.selectedIndex;
      this.audio.playSelect();
      this.actionHintText.setText(`Select item to combine with [${currentItem.name}] and press [C]`);
    } else if (this.combineSourceIndex === this.selectedIndex) {
      this.combineSourceIndex = null;
      this.audio.playBack();
      this.updateDetails();
    } else {
      const sourceItem = this.inventory.getItemAt(this.combineSourceIndex);
      if (sourceItem) {
        const result = this.inventory.combine(sourceItem.id, currentItem.id);
        if (result.success) {
          this.audio.playSelect();
          this.itemDescText.setText(result.message);
        } else {
          this.audio.playDisabled();
          this.itemDescText.setText(result.message);
        }
      }
      this.combineSourceIndex = null;
      this.refreshSlots();
    }
  }
}
