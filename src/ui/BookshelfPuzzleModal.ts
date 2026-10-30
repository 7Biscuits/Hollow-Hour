import Phaser from 'phaser';
import { PuzzleManager, BookshelfPuzzleController } from '../systems/PuzzleSystem';
import { AudioManager } from '../audio/AudioManager';

export class BookshelfPuzzleModal {
  private scene: Phaser.Scene;
  private puzzle: BookshelfPuzzleController;
  private audio: AudioManager;

  private container!: Phaser.GameObjects.Container;
  private isOpen: boolean = false;

  private bookImages: Phaser.GameObjects.Image[] = [];
  private bookBaseY: number = 0;
  private statusText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;

  private onCloseCallback?: () => void;

  private bookTitles = [
    'I. Anatomia Humana',
    'II. De Vermis Mysteriis',
    'III. Compendium Lycanthropica',
    'IV. The Hollow Hour & Transmutation',
    'V. Chronicles of Blackwood'
  ];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.puzzle = PuzzleManager.getInstance().getBookshelfPuzzle();
    this.audio = AudioManager.getInstance();
    this.createUI();
  }

  private createUI(): void {
    const { width, height } = this.scale;

    this.container = this.scene.add.container(0, 0).setDepth(3200).setVisible(false);

    // Dark Scrim
    const scrim = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x060408, 0.92);
    scrim.setInteractive();
    this.container.add(scrim);

    // Bookshelf Backing Frame (460x240)
    const shelfX = width / 2;
    const shelfY = height / 2;
    const shelfFrame = this.scene.add.image(shelfX, shelfY, 'ui_bookshelf_frame');
    this.container.add(shelfFrame);

    // Header Title
    const title = this.scene.add.text(width / 2, height / 2 - 100, 'THE OCCULT ARCHIVE - BOOKCASE MECHANISM', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#e2ccaf',
      stroke: '#3b1016',
      strokeThickness: 3,
      letterSpacing: 2
    }).setOrigin(0.5, 0.5);
    this.container.add(title);

    // Spawn 5 Books on the shelf
    const startX = width / 2 - 120;
    const spacing = 60;
    this.bookBaseY = height / 2 + 5;

    for (let i = 0; i < 5; i++) {
      const bx = startX + i * spacing;
      const bookImg = this.scene.add.image(bx, this.bookBaseY, `ui_book_${i}`).setInteractive({ useHandCursor: true });
      bookImg.setData('index', i);

      // Label below book
      const label = this.scene.add.text(bx, this.bookBaseY + 68, `[${i + 1}]`, {
        fontFamily: "'VT323', monospace",
        fontSize: '13px',
        color: '#c5a07c'
      }).setOrigin(0.5, 0.5);

      bookImg.on('pointerdown', () => this.pullBook(i));
      bookImg.on('pointerover', () => {
        bookImg.setTint(0xffd700);
        this.statusText.setText(`Selecting: ${this.bookTitles[i]}`);
      });
      bookImg.on('pointerout', () => {
        bookImg.clearTint();
        this.updateStatus();
      });

      this.bookImages.push(bookImg);
      this.container.add([bookImg, label]);
    }

    // Status / Riddle text
    this.statusText = this.scene.add.text(width / 2, height / 2 + 88, '', {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '10px',
      color: '#d5c5aa',
      align: 'center',
      wordWrap: { width: 420 },
      lineSpacing: 2
    }).setOrigin(0.5, 0.5);
    this.container.add(this.statusText);

    // Footer instructions
    this.hintText = this.scene.add.text(width / 2, height / 2 + 112, '[1 - 5] PULL TOMES IN ORDER    [ESC] STEP BACK', {
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

  public pullBook(index: number): void {
    if (this.puzzle.isSolved()) return;

    this.audio.playHover();
    const result = this.puzzle.pullBook(index);

    if (result.success) {
      // Animate pulled book forward
      this.scene.tweens.add({
        targets: this.bookImages[index],
        y: this.bookBaseY - 14,
        duration: 120,
        ease: 'Quad.easeOut'
      });

      if (result.solved) {
        this.audio.playSelect();
        this.statusText.setText('A heavy stone counterweight thuds behind the wall! The bookshelf pivots open to reveal a hidden descending passage!');
        this.statusText.setColor('#10b981');
      } else {
        this.updateStatus();
      }
    } else {
      // Wrong book, sequence reset
      this.audio.playDisabled();
      // Snap all books back
      this.bookImages.forEach(b => {
        this.scene.tweens.add({
          targets: b,
          y: this.bookBaseY,
          duration: 150,
          ease: 'Bounce.easeOut'
        });
      });
      this.statusText.setText('The internal pins snap back into place with a hollow rattle. The sequence must be reset.');
      this.statusText.setColor('#ef4444');
    }
  }

  private updateDisplay(): void {
    const pulls = this.puzzle.getCurrentPulls();
    this.bookImages.forEach((img, idx) => {
      img.setY(pulls.includes(idx) ? this.bookBaseY - 14 : this.bookBaseY);
    });
    this.updateStatus();
  }

  private updateStatus(): void {
    if (this.puzzle.isSolved()) {
      this.statusText.setText('The hidden passage stands open. A cold stone staircase descends into the Sub-Cellar crypt.');
      this.statusText.setColor('#10b981');
      return;
    }

    const pulls = this.puzzle.getCurrentPulls();
    if (pulls.length === 0) {
      this.statusText.setText('A faint riddle is inscribed into the oak shelf: "First the beast within, then the mysteries of blood, finally the hollow hour."');
      this.statusText.setColor('#d5c5aa');
    } else {
      this.statusText.setText(`Internal latches clicked (${pulls.length}/3). Select the next volume...`);
      this.statusText.setColor('#f59e0b');
    }
  }

  public handleInput(key: string, code?: string): void {
    if (!this.isOpen) return;

    if (code === 'KeyE' || key === 'e' || key === 'E' || code === 'Escape' || key === 'Escape') {
      this.close();
      return;
    }

    const num = parseInt(key, 10);
    if (!isNaN(num) && num >= 1 && num <= 5) {
      this.pullBook(num - 1);
    }
  }
}
