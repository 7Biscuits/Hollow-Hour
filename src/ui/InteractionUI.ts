import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';

export class InteractionUI {
  private scene: Phaser.Scene;
  private promptContainer: Phaser.GameObjects.Container;
  private promptText: Phaser.GameObjects.Text;
  private promptBg: Phaser.GameObjects.Rectangle;
  private isPromptVisible = false;

  private modalContainer: Phaser.GameObjects.Container;
  private modalTitle: Phaser.GameObjects.Text;
  private modalDesc: Phaser.GameObjects.Text;
  private modalDetails: Phaser.GameObjects.Text;
  private modalDismissText: Phaser.GameObjects.Text;
  private isModalOpen = false;
  private onModalCloseCallback?: () => void;
  private audioManager: AudioManager;

  private roomBannerText: Phaser.GameObjects.Text;
  private roomBannerBg: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.audioManager = AudioManager.getInstance();

    // 1. Contextual Interaction Prompt Pill (floats near player head)
    this.promptContainer = scene.add.container(320, 200);
    this.promptContainer.setDepth(1100);
    this.promptContainer.setAlpha(0);

    this.promptBg = scene.add.rectangle(0, 0, 180, 20, 0x140e17, 0.92);
    this.promptBg.setStrokeStyle(1, 0x8a1828);
    this.promptContainer.add(this.promptBg);

    this.promptText = scene.add.text(0, 0, '[E] INSPECT', {
      fontFamily: "'Cinzel Decorative', 'MedievalSharp', serif",
      fontSize: '9px',
      fontStyle: 'bold',
      color: '#f5e4cd',
      stroke: '#08060a',
      strokeThickness: 2,
      letterSpacing: 1.5
    }).setOrigin(0.5, 0.5);
    this.promptContainer.add(this.promptText);

    // 2. Inspection Modal Dialog
    this.modalContainer = scene.add.container(320, 180);
    this.modalContainer.setDepth(1500);
    this.modalContainer.setVisible(false);

    // Scrim
    const scrim = scene.add.rectangle(0, 0, 640, 360, 0x000000, 0.72);
    scrim.setInteractive();
    this.modalContainer.add(scrim);

    // Main Box
    const box = scene.add.rectangle(0, 0, 430, 220, 0x0c0810, 0.97);
    box.setStrokeStyle(2, 0x5a1824);
    this.modalContainer.add(box);

    const innerBorder = scene.add.rectangle(0, 0, 420, 210, 0x000000, 0);
    innerBorder.setStrokeStyle(1, 0x8a6e45, 0.4);
    this.modalContainer.add(innerBorder);

    // Corner Ornate flourishes
    const c1 = scene.add.image(-208, -103, 'ui_frame').setOrigin(0, 0);
    const c2 = scene.add.image(208, -103, 'ui_frame').setOrigin(1, 0).setFlipX(true);
    const c3 = scene.add.image(-208, 103, 'ui_frame').setOrigin(0, 1).setFlipY(true);
    const c4 = scene.add.image(208, 103, 'ui_frame').setOrigin(1, 1).setFlipX(true).setFlipY(true);
    this.modalContainer.add([c1, c2, c3, c4]);

    // Title
    this.modalTitle = scene.add.text(0, -80, '', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#e8cfae',
      stroke: '#3b0e16',
      strokeThickness: 3,
      letterSpacing: 3
    }).setOrigin(0.5, 0.5);
    this.modalContainer.add(this.modalTitle);

    // Main Description
    this.modalDesc = scene.add.text(0, -32, '', {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '11px',
      color: '#c2b09c',
      wordWrap: { width: 380 },
      align: 'center',
      lineSpacing: 5
    }).setOrigin(0.5, 0.5);
    this.modalContainer.add(this.modalDesc);

    // Details / Clue findings
    this.modalDetails = scene.add.text(0, 30, '', {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '10px',
      color: '#e59a34',
      wordWrap: { width: 380 },
      align: 'center',
      lineSpacing: 4
    }).setOrigin(0.5, 0.5);
    this.modalContainer.add(this.modalDetails);

    // Dismiss Prompt
    this.modalDismissText = scene.add.text(0, 85, '[ PRESS E / SPACE / ESC TO CLOSE ]', {
      fontFamily: "'VT323', monospace",
      fontSize: '11px',
      color: '#8c7b8e',
      letterSpacing: 2
    }).setOrigin(0.5, 0.5);
    this.modalContainer.add(this.modalDismissText);

    // 3. Room Title Banner (top center)
    this.roomBannerBg = scene.add.rectangle(320, 22, 340, 22, 0x0c0810, 0.9);
    this.roomBannerBg.setStrokeStyle(1, 0x5a1824);
    this.roomBannerBg.setDepth(1200);
    this.roomBannerBg.setAlpha(0);

    this.roomBannerText = scene.add.text(320, 22, '', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#e4c49d',
      letterSpacing: 3
    }).setOrigin(0.5, 0.5);
    this.roomBannerText.setDepth(1201);
    this.roomBannerText.setAlpha(0);
  }

  public showPrompt(text: string, x?: number, y?: number): void {
    this.promptText.setText(text);
    const textW = this.promptText.width;
    this.promptBg.setSize(textW + 28, 20);

    if (x !== undefined && y !== undefined) {
      // Clamp inside screen bounds
      const px = Phaser.Math.Clamp(x, (textW + 32) / 2 + 10, 640 - (textW + 32) / 2 - 10);
      const py = Phaser.Math.Clamp(y, 30, 335);
      this.promptContainer.setPosition(px, py);
    }

    if (!this.isPromptVisible) {
      this.isPromptVisible = true;
      this.scene.tweens.killTweensOf(this.promptContainer);
      this.scene.tweens.add({
        targets: this.promptContainer,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: 'Cubic.easeOut'
      });
    }
  }

  public hidePrompt(): void {
    if (this.isPromptVisible) {
      this.isPromptVisible = false;
      this.scene.tweens.killTweensOf(this.promptContainer);
      this.scene.tweens.add({
        targets: this.promptContainer,
        alpha: 0,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 80,
        ease: 'Cubic.easeIn'
      });
    }
  }

  public openModal(title: string, desc: string, details: string[], onClose?: () => void): void {
    this.isModalOpen = true;
    this.onModalCloseCallback = onClose;

    this.modalTitle.setText(title);
    this.modalDesc.setText(desc);
    this.modalDetails.setText(details.length > 0 ? details.join('\n\n') : '');

    this.modalContainer.setVisible(true);
    this.modalContainer.setAlpha(0);
    this.modalContainer.setScale(0.95);

    this.audioManager.playSelect();

    this.scene.tweens.add({
      targets: this.modalContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 160,
      ease: 'Cubic.easeOut'
    });
  }

  public closeModal(): void {
    if (!this.isModalOpen) return;
    this.isModalOpen = false;

    this.audioManager.playBack();

    this.scene.tweens.add({
      targets: this.modalContainer,
      alpha: 0,
      scaleX: 0.95,
      scaleY: 0.95,
      duration: 120,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.modalContainer.setVisible(false);
        if (this.onModalCloseCallback) {
          this.onModalCloseCallback();
        }
      }
    });
  }

  public getIsOpen(): boolean {
    return this.isModalOpen;
  }

  public showRoomBanner(roomName: string): void {
    this.roomBannerText.setText(`— ${roomName} —`);
    this.scene.tweens.killTweensOf([this.roomBannerBg, this.roomBannerText]);

    this.scene.tweens.add({
      targets: [this.roomBannerBg, this.roomBannerText],
      alpha: 1,
      duration: 350,
      hold: 2400,
      yoyo: true,
      ease: 'Sine.easeInOut'
    });
  }
}
