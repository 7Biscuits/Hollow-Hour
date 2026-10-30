import Phaser from 'phaser';
import { NotebookSystem } from '../systems/NotebookSystem';
import { AudioManager } from '../audio/AudioManager';

type NotebookTab = 'clues' | 'suspects' | 'objectives' | 'map';

export class NotebookUI {
  private scene: Phaser.Scene;
  private notebook: NotebookSystem;
  private audio: AudioManager;

  private container!: Phaser.GameObjects.Container;
  private isOpen: boolean = false;
  private activeTab: NotebookTab = 'clues';
  private selectedListIndex: number = 0;

  // UI Elements
  private tabButtons: Map<NotebookTab, Phaser.GameObjects.Text> = new Map();
  private leftPageContainer!: Phaser.GameObjects.Container;
  private rightPageContainer!: Phaser.GameObjects.Container;

  private onCloseCallback?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.notebook = NotebookSystem.getInstance();
    this.audio = AudioManager.getInstance();
    this.createUI();
  }

  private createUI(): void {
    const { width, height } = this.scene.scale;

    this.container = this.scene.add.container(0, 0).setDepth(3000).setVisible(false);

    // 1. Dark scrim
    const scrim = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x060408, 0.88);
    scrim.setInteractive();
    this.container.add(scrim);

    // 2. Open Notebook Book Spread (480x280)
    const book = this.scene.add.image(width / 2, height / 2, 'ui_notebook_page');
    this.container.add(book);

    // Header Tabs
    const tabs: Array<{ id: NotebookTab; label: string; x: number }> = [
      { id: 'clues', label: '[1] CLUES', x: width / 2 - 160 },
      { id: 'suspects', label: '[2] SUSPECTS', x: width / 2 - 60 },
      { id: 'objectives', label: '[3] OBJECTIVES', x: width / 2 + 50 },
      { id: 'map', label: '[4] MANSION MAP', x: width / 2 + 160 }
    ];

    for (const t of tabs) {
      const tabText = this.scene.add.text(t.x, height / 2 - 128, t.label, {
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#5a3d24'
      }).setOrigin(0.5, 0.5);

      tabText.setInteractive({ useHandCursor: true });
      tabText.on('pointerdown', () => {
        this.switchTab(t.id);
      });
      tabText.on('pointerover', () => {
        if (this.activeTab !== t.id) {
          tabText.setColor('#c5a07c');
        }
      });
      tabText.on('pointerout', () => {
        if (this.activeTab !== t.id) {
          tabText.setColor('#5a3d24');
        }
      });

      this.tabButtons.set(t.id, tabText);
      this.container.add(tabText);
    }

    // Left & Right Page Content Containers
    this.leftPageContainer = this.scene.add.container(0, 0);
    this.rightPageContainer = this.scene.add.container(0, 0);
    this.container.add(this.leftPageContainer);
    this.container.add(this.rightPageContainer);

    // Bottom Navigation Hint
    const bottomHint = this.scene.add.text(width / 2, height / 2 + 128, '[Q / E / 1-4] SWITCH TABS    [UP / DOWN] SELECT    [N / ESC] CLOSE NOTEBOOK', {
      fontFamily: "'VT323', monospace",
      fontSize: '11px',
      color: '#5a3d24',
      letterSpacing: 2
    }).setOrigin(0.5, 0.5);
    this.container.add(bottomHint);
  }

  public open(onClose?: () => void): void {
    this.onCloseCallback = onClose;
    this.isOpen = true;
    this.selectedListIndex = 0;
    this.container.setVisible(true);
    this.renderActiveTab();
    this.audio.playSelect();
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

  public switchTab(tab: NotebookTab): void {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.selectedListIndex = 0;
    this.audio.playHover();
    this.renderActiveTab();
  }

  private updateTabHighlight(): void {
    this.tabButtons.forEach((btn, tab) => {
      if (tab === this.activeTab) {
        btn.setColor('#8a1c24');
        btn.setFontSize('12px');
      } else {
        btn.setColor('#5a3d24');
        btn.setFontSize('11px');
      }
    });
  }

  private renderActiveTab(): void {
    this.updateTabHighlight();
    this.leftPageContainer.removeAll(true);
    this.rightPageContainer.removeAll(true);

    switch (this.activeTab) {
      case 'clues':
        this.renderCluesTab();
        break;
      case 'suspects':
        this.renderSuspectsTab();
        break;
      case 'objectives':
        this.renderObjectivesTab();
        break;
      case 'map':
        this.renderMapTab();
        break;
    }
  }

  // --- 1. Clues Tab ---
  private renderCluesTab(): void {
    const { width, height } = this.scene.scale;
    const clues = this.notebook.getClues();

    // Left Page Title
    const title = this.scene.add.text(width / 2 - 120, height / 2 - 105, 'DISCOVERED CLUES', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#3a2417'
    }).setOrigin(0.5, 0.5);
    this.leftPageContainer.add(title);

    if (clues.length === 0) {
      const empty = this.scene.add.text(width / 2 - 120, height / 2 - 20, 'No tangible clues recorded yet.\nInspect objects in the mansion.', {
        fontFamily: "'MedievalSharp', serif",
        fontSize: '10px',
        color: '#6c5339',
        align: 'center'
      }).setOrigin(0.5, 0.5);
      this.leftPageContainer.add(empty);
    } else {
      clues.forEach((clue, idx) => {
        const y = height / 2 - 80 + idx * 24;
        const isSelected = idx === this.selectedListIndex;

        const row = this.scene.add.text(width / 2 - 210, y, `${isSelected ? '▶ ' : '  '}${clue.title}`, {
          fontFamily: "'MedievalSharp', serif",
          fontSize: '10px',
          fontStyle: isSelected ? 'bold' : 'normal',
          color: isSelected ? '#7f1d1d' : '#2c1e13'
        });

        row.setInteractive({ useHandCursor: true });
        row.on('pointerdown', () => {
          this.selectedListIndex = idx;
          this.audio.playHover();
          this.renderActiveTab();
        });

        this.leftPageContainer.add(row);
      });
    }

    // Right Page: Clue Detail
    const selectedClue = clues[this.selectedListIndex] || clues[0];
    if (selectedClue) {
      const clueTitle = this.scene.add.text(width / 2 + 120, height / 2 - 105, selectedClue.title, {
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: '12px',
        fontStyle: 'bold',
        color: '#7f1d1d'
      }).setOrigin(0.5, 0.5);
      this.rightPageContainer.add(clueTitle);

      const meta = this.scene.add.text(width / 2 + 40, height / 2 - 80, `Location: ${selectedClue.roomFound}\nCategory: ${selectedClue.category.toUpperCase()}`, {
        fontFamily: "'VT323', monospace",
        fontSize: '12px',
        color: '#6c5339'
      });
      this.rightPageContainer.add(meta);

      const desc = this.scene.add.text(width / 2 + 40, height / 2 - 40, selectedClue.description, {
        fontFamily: "'MedievalSharp', serif",
        fontSize: '10px',
        color: '#2c1e13',
        wordWrap: { width: 175 },
        lineSpacing: 4
      });
      this.rightPageContainer.add(desc);
    }
  }

  // --- 2. Suspects Tab ---
  private renderSuspectsTab(): void {
    const { width, height } = this.scene.scale;
    const suspects = this.notebook.getSuspects();

    // Left Page List
    const title = this.scene.add.text(width / 2 - 120, height / 2 - 105, 'PERSONS OF INTEREST', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#3a2417'
    }).setOrigin(0.5, 0.5);
    this.leftPageContainer.add(title);

    suspects.forEach((suspect, idx) => {
      const y = height / 2 - 80 + idx * 36;
      const isSelected = idx === this.selectedListIndex;

      const nameText = this.scene.add.text(width / 2 - 210, y, `${isSelected ? '▶ ' : '  '}${suspect.name}`, {
        fontFamily: "'MedievalSharp', serif",
        fontSize: '11px',
        fontStyle: isSelected ? 'bold' : 'normal',
        color: isSelected ? '#7f1d1d' : '#2c1e13'
      });

      const statusBadge = this.scene.add.text(width / 2 - 200, y + 14, `[Status: ${suspect.status.toUpperCase()}]`, {
        fontFamily: "'VT323', monospace",
        fontSize: '11px',
        color: suspect.status === 'ghost' ? '#0d9488' : suspect.status === 'deceased' ? '#991b1b' : '#15803d'
      });

      nameText.setInteractive({ useHandCursor: true });
      nameText.on('pointerdown', () => {
        this.selectedListIndex = idx;
        this.audio.playHover();
        this.renderActiveTab();
      });

      this.leftPageContainer.add(nameText);
      this.leftPageContainer.add(statusBadge);
    });

    // Right Page: Profile & Portrait
    const selected = suspects[this.selectedListIndex] || suspects[0];
    if (selected) {
      if (selected.portrait && this.scene.textures.exists(selected.portrait)) {
        const portrait = this.scene.add.image(width / 2 + 70, height / 2 - 70, selected.portrait).setScale(1.2);
        this.rightPageContainer.add(portrait);
      }

      const pName = this.scene.add.text(width / 2 + 110, height / 2 - 85, selected.name, {
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: '12px',
        fontStyle: 'bold',
        color: '#7f1d1d'
      });
      this.rightPageContainer.add(pName);

      const pRel = this.scene.add.text(width / 2 + 110, height / 2 - 68, selected.relation, {
        fontFamily: "'MedievalSharp', serif",
        fontSize: '9px',
        fontStyle: 'italic',
        color: '#6c5339',
        wordWrap: { width: 110 }
      });
      this.rightPageContainer.add(pRel);

      const bio = this.scene.add.text(width / 2 + 40, height / 2 - 32, selected.bio, {
        fontFamily: "'MedievalSharp', serif",
        fontSize: '9px',
        color: '#2c1e13',
        wordWrap: { width: 180 },
        lineSpacing: 3
      });
      this.rightPageContainer.add(bio);

      const notesTitle = this.scene.add.text(width / 2 + 40, height / 2 + 35, 'Detective\'s Notes:', {
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#3a2417'
      });
      this.rightPageContainer.add(notesTitle);

      const notesBody = this.scene.add.text(width / 2 + 40, height / 2 + 50, selected.notes.map(n => `• ${n}`).join('\n'), {
        fontFamily: "'MedievalSharp', serif",
        fontSize: '9px',
        color: '#4a321e',
        wordWrap: { width: 180 },
        lineSpacing: 3
      });
      this.rightPageContainer.add(notesBody);
    }
  }

  // --- 3. Objectives Tab ---
  private renderObjectivesTab(): void {
    const { width, height } = this.scene.scale;
    const objectives = this.notebook.getObjectives();

    const title = this.scene.add.text(width / 2 - 120, height / 2 - 105, 'CASE OBJECTIVES', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#3a2417'
    }).setOrigin(0.5, 0.5);
    this.leftPageContainer.add(title);

    objectives.forEach((obj, idx) => {
      const y = height / 2 - 80 + idx * 46;
      const check = obj.completed ? '[✓]' : '[ ]';
      const color = obj.completed ? '#15803d' : '#2c1e13';

      const row = this.scene.add.text(width / 2 - 210, y, `${check} ${obj.title}`, {
        fontFamily: "'MedievalSharp', serif",
        fontSize: '11px',
        fontStyle: 'bold',
        color: color
      });

      const desc = this.scene.add.text(width / 2 - 195, y + 15, obj.description, {
        fontFamily: "'MedievalSharp', serif",
        fontSize: '9px',
        color: '#6c5339',
        wordWrap: { width: 180 },
        lineSpacing: 2
      });

      this.leftPageContainer.add(row);
      this.leftPageContainer.add(desc);
    });

    // Right Page: Deduction Notes
    const rTitle = this.scene.add.text(width / 2 + 120, height / 2 - 105, 'INVESTIGATION SUMMARY', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#3a2417'
    }).setOrigin(0.5, 0.5);
    this.rightPageContainer.add(rTitle);

    const summary = this.scene.add.text(width / 2 + 40, height / 2 - 80,
      'Alistair Vance was found murdered behind locked doors.\n\nKey suspects:\n• Victoria Vance (Widow)\n• Edward Vance (Nephew)\n• Dr. Robert Hayes (Physician)\n\nCritical priority: Investigate the stopped clock in the entrance hall and inspect CCTV footage in the security console.', {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '10px',
      color: '#2c1e13',
      wordWrap: { width: 180 },
      lineSpacing: 4
    });
    this.rightPageContainer.add(summary);
  }

  // --- 4. Mansion Map Tab ---
  private renderMapTab(): void {
    const { width, height } = this.scene.scale;

    const title = this.scene.add.text(width / 2, height / 2 - 105, 'BLACKWOOD MANOR — GROUND & LOWER FLOORS', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#3a2417'
    }).setOrigin(0.5, 0.5);
    this.leftPageContainer.add(title);

    // Floorplan Layout Nodes
    const rooms = [
      { id: 'library', name: 'LIBRARY', x: width / 2 - 120, y: height / 2 - 30 },
      { id: 'main_hallway', name: 'MAIN HALLWAY', x: width / 2, y: height / 2 - 30 },
      { id: 'security_room', name: 'SECURITY ROOM', x: width / 2 + 120, y: height / 2 - 30 },
      { id: 'bedroom', name: 'MASTER BEDROOM', x: width / 2 - 120, y: height / 2 + 45 },
      { id: 'entrance_hall', name: 'ENTRANCE HALL', x: width / 2, y: height / 2 + 45 },
      { id: 'basement', name: 'BASEMENT SANCTUM', x: width / 2 + 120, y: height / 2 + 45 }
    ];

    for (const r of rooms) {
      const isDiscovered = this.notebook.isRoomDiscovered(r.id);

      // Room Box
      const box = this.scene.add.rectangle(r.x, r.y, 90, 48, isDiscovered ? 0xd5c5aa : 0x241711);
      box.setStrokeStyle(1, isDiscovered ? 0x5a3d24 : 0x140e16);
      this.leftPageContainer.add(box);

      const label = this.scene.add.text(r.x, r.y, isDiscovered ? r.name : '???', {
        fontFamily: "'VT323', monospace",
        fontSize: '11px',
        color: isDiscovered ? '#2c1e13' : '#6c5339',
        align: 'center'
      }).setOrigin(0.5, 0.5);
      this.leftPageContainer.add(label);
    }
  }

  public handleInput(key: string, code?: string): void {
    if (!this.isOpen) return;

    if (code === 'Escape' || key === 'Escape' || code === 'KeyN' || key === 'n' || key === 'N' || code === 'KeyJ' || key === 'j') {
      this.close();
      return;
    }

    switch (key) {
      case '1':
      case 'Digit1':
        this.switchTab('clues');
        break;
      case '2':
      case 'Digit2':
        this.switchTab('suspects');
        break;
      case '3':
      case 'Digit3':
        this.switchTab('objectives');
        break;
      case '4':
      case 'Digit4':
        this.switchTab('map');
        break;
      case 'q':
      case 'Q':
        this.cycleTab(-1);
        break;
      case 'e':
      case 'E':
        this.cycleTab(1);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.navigateList(1);
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.navigateList(-1);
        break;
      case 'Escape':
      case 'n':
      case 'N':
      case 'j':
      case 'J':
        this.close();
        break;
    }
  }

  private cycleTab(direction: number): void {
    const tabs: NotebookTab[] = ['clues', 'suspects', 'objectives', 'map'];
    const currentIdx = tabs.indexOf(this.activeTab);
    const nextIdx = (currentIdx + direction + tabs.length) % tabs.length;
    this.switchTab(tabs[nextIdx]);
  }

  private navigateList(delta: number): void {
    const maxItems = this.activeTab === 'clues'
      ? this.notebook.getClues().length
      : this.activeTab === 'suspects'
      ? this.notebook.getSuspects().length
      : 0;

    if (maxItems <= 1) return;

    this.selectedListIndex = (this.selectedListIndex + delta + maxItems) % maxItems;
    this.audio.playHover();
    this.renderActiveTab();
  }
}
