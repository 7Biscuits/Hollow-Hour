import Phaser from 'phaser';
import { DialogueSystem } from '../systems/DialogueSystem';
import { DialogueNode, DialogueChoice } from '../types';
import { AudioManager } from '../audio/AudioManager';

export class DialogueUI {
  private scene: Phaser.Scene;
  private dialogueSystem: DialogueSystem;
  private audio: AudioManager;

  private container!: Phaser.GameObjects.Container;
  private isOpen: boolean = false;

  // UI Components
  private portraitImage!: Phaser.GameObjects.Image;
  private speakerNameText!: Phaser.GameObjects.Text;
  private speakerTitleText!: Phaser.GameObjects.Text;
  private dialogueBodyText!: Phaser.GameObjects.Text;
  private advanceHintText!: Phaser.GameObjects.Text;
  private choicesContainer!: Phaser.GameObjects.Container;

  private currentFullText: string = '';
  private displayedCharCount: number = 0;
  private isTypewriting: boolean = false;
  private typewriterTimer?: Phaser.Time.TimerEvent;

  private selectedChoiceIndex: number = 0;
  private activeChoices: DialogueChoice[] = [];
  private choiceTexts: Phaser.GameObjects.Text[] = [];

  private onCloseCallback?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.dialogueSystem = DialogueSystem.getInstance();
    this.audio = AudioManager.getInstance();
    this.createUI();
    this.bindEvents();
  }

  private createUI(): void {
    const { width, height } = this.scene.scale;

    this.container = this.scene.add.container(0, 0).setDepth(3500).setVisible(false);

    // Dialogue Box Background Panel at the bottom
    const boxY = height - 60;
    const boxW = 600;
    const boxH = 100;

    const bgRect = this.scene.add.rectangle(width / 2, boxY, boxW, boxH, 0x0c090e, 0.95);
    bgRect.setStrokeStyle(2, 0x6e4f30);
    bgRect.setInteractive(); // Block click through
    this.container.add(bgRect);

    const innerRect = this.scene.add.rectangle(width / 2, boxY, boxW - 8, boxH - 8, 0x140e16, 0.9);
    innerRect.setStrokeStyle(1, 0x3d2717);
    this.container.add(innerRect);

    // Portrait Frame (left side)
    const portX = width / 2 - 245;
    const portY = boxY;

    const portBorder = this.scene.add.rectangle(portX, portY, 56, 56, 0x241711);
    portBorder.setStrokeStyle(1, 0x8a6d45);
    this.container.add(portBorder);

    this.portraitImage = this.scene.add.image(portX, portY, 'portrait_graves').setScale(1.1);
    this.container.add(this.portraitImage);

    // Speaker Name & Title (top-left of text area)
    const textStartX = width / 2 - 200;

    this.speakerNameText = this.scene.add.text(textStartX, boxY - 36, 'SPEAKER NAME', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#f59e0b',
      stroke: '#241416',
      strokeThickness: 2
    });
    this.container.add(this.speakerNameText);

    this.speakerTitleText = this.scene.add.text(textStartX + 180, boxY - 34, '', {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '10px',
      fontStyle: 'italic',
      color: '#8d6e4f'
    });
    this.container.add(this.speakerTitleText);

    // Dialogue Body Text
    this.dialogueBodyText = this.scene.add.text(textStartX, boxY - 18, '', {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '11px',
      color: '#e2ccaf',
      wordWrap: { width: 440 },
      lineSpacing: 4
    });
    this.container.add(this.dialogueBodyText);

    // Advance Prompt Hint
    this.advanceHintText = this.scene.add.text(width / 2 + 270, boxY + 36, '[E / SPACE] ▶', {
      fontFamily: "'VT323', monospace",
      fontSize: '12px',
      color: '#c5a07c'
    }).setOrigin(1, 0.5);
    this.container.add(this.advanceHintText);

    // Choices Container (overlays the text area when choices exist)
    this.choicesContainer = this.scene.add.container(textStartX, boxY - 18);
    this.container.add(this.choicesContainer);
  }

  private bindEvents(): void {
    this.dialogueSystem.on((event: string, data?: any) => {
      if (event === 'dialogueStarted') {
        this.openDialogueNode(data as DialogueNode);
      } else if (event === 'lineAdvanced') {
        this.displayLine(data.line);
      } else if (event === 'dialogueEnded') {
        this.close();
      }
    });
  }

  public startDialogue(nodeId: string, onClose?: () => void): void {
    this.onCloseCallback = onClose;
    const ok = this.dialogueSystem.startDialogue(nodeId);
    if (!ok && onClose) {
      onClose();
    }
  }

  private openDialogueNode(node: DialogueNode): void {
    this.isOpen = true;
    this.container.setVisible(true);

    this.speakerNameText.setText(node.speaker.toUpperCase());
    this.speakerTitleText.setText(node.speakerTitle || '');

    if (node.portrait && this.scene.textures.exists(node.portrait)) {
      this.portraitImage.setTexture(node.portrait).setVisible(true);
    } else {
      this.portraitImage.setVisible(false);
    }

    this.choicesContainer.removeAll(true);
    this.choicesContainer.setVisible(false);
    this.dialogueBodyText.setVisible(true);

    const initialLine = this.dialogueSystem.getCurrentLine();
    if (initialLine) {
      this.displayLine(initialLine);
    }
  }

  private displayLine(lineText: string): void {
    this.currentFullText = lineText;
    this.displayedCharCount = 0;
    this.isTypewriting = true;
    this.dialogueBodyText.setText('');
    this.advanceHintText.setText('...');

    if (this.typewriterTimer) {
      this.typewriterTimer.remove(false);
    }

    this.typewriterTimer = this.scene.time.addEvent({
      delay: 18,
      callback: () => {
        this.displayedCharCount++;
        this.dialogueBodyText.setText(this.currentFullText.substring(0, this.displayedCharCount));

        if (this.displayedCharCount >= this.currentFullText.length) {
          this.finishTypewriting();
        }
      },
      repeat: this.currentFullText.length - 1
    });
  }

  private finishTypewriting(): void {
    if (this.typewriterTimer) {
      this.typewriterTimer.remove(false);
    }
    this.isTypewriting = false;
    this.dialogueBodyText.setText(this.currentFullText);

    if (this.dialogueSystem.isAtChoices()) {
      this.showChoices();
    } else {
      this.advanceHintText.setText('[E / SPACE] ▶');
    }
  }

  private showChoices(): void {
    this.activeChoices = this.dialogueSystem.getAvailableChoices();
    this.selectedChoiceIndex = 0;
    this.advanceHintText.setText('[UP/DOWN] CHOOSE    [E/ENTER] CONFIRM');

    this.choicesContainer.removeAll(true);
    this.choiceTexts = [];
    this.dialogueBodyText.setVisible(false);
    this.choicesContainer.setVisible(true);

    this.activeChoices.forEach((choice, idx) => {
      const y = idx * 18;
      const isSelected = idx === this.selectedChoiceIndex;

      const txt = this.scene.add.text(0, y, `${isSelected ? '▶ ' : '   '}${choice.text}`, {
        fontFamily: "'MedievalSharp', serif",
        fontSize: '11px',
        fontStyle: isSelected ? 'bold' : 'normal',
        color: isSelected ? '#f59e0b' : '#c5a07c'
      });

      txt.setInteractive({ useHandCursor: true });
      txt.on('pointerdown', () => {
        this.selectedChoiceIndex = idx;
        this.confirmChoice();
      });
      txt.on('pointerover', () => {
        if (this.selectedChoiceIndex !== idx) {
          this.selectedChoiceIndex = idx;
          this.audio.playHover();
          this.refreshChoiceHighlight();
        }
      });

      this.choiceTexts.push(txt);
      this.choicesContainer.add(txt);
    });
  }

  private refreshChoiceHighlight(): void {
    this.choiceTexts.forEach((txt, idx) => {
      const isSelected = idx === this.selectedChoiceIndex;
      txt.setText(`${isSelected ? '▶ ' : '   '}${this.activeChoices[idx].text}`);
      txt.setColor(isSelected ? '#f59e0b' : '#c5a07c');
      txt.setFontStyle(isSelected ? 'bold' : 'normal');
    });
  }

  public advance(): void {
    if (!this.isOpen) return;

    if (this.isTypewriting) {
      this.finishTypewriting();
      return;
    }

    if (this.dialogueSystem.isAtChoices()) {
      this.confirmChoice();
      return;
    }

    this.audio.playHover();
    const hasMore = this.dialogueSystem.advance();
    if (!hasMore) {
      this.close();
    }
  }

  public navigateChoices(delta: number): void {
    if (!this.dialogueSystem.isAtChoices() || this.activeChoices.length <= 1) return;

    this.selectedChoiceIndex = (this.selectedChoiceIndex + delta + this.activeChoices.length) % this.activeChoices.length;
    this.audio.playHover();
    this.refreshChoiceHighlight();
  }

  private confirmChoice(): void {
    if (this.activeChoices.length === 0) return;

    this.audio.playSelect();
    this.dialogueSystem.selectChoice(this.selectedChoiceIndex);
  }

  public close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.container.setVisible(false);
    if (this.typewriterTimer) {
      this.typewriterTimer.remove(false);
    }
    this.dialogueSystem.endDialogue();
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }

  public getIsOpen(): boolean {
    return this.isOpen;
  }
}
