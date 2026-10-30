import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';
import { NotebookSystem } from '../systems/NotebookSystem';

export type EndingType = 'severed_curse' | 'beast_eternal' | 'ash_memory';

export interface EndingData {
  ending: EndingType;
}

interface EndingContent {
  title: string;
  subtitle: string;
  texture: string;
  paragraphs: string[];
  outcome: string;
  accentColor: string;
}

const ENDINGS: Record<EndingType, EndingContent> = {
  severed_curse: {
    title: 'THE SEVERED CURSE',
    subtitle: 'ENDING A — EXORCISM AT DAWN',
    texture: 'ending_dawn',
    paragraphs: [
      'The silver sigil flashed with blinding intensity as the ceremonial athame pierced the obsidian nexus. A thunderous roar shook the foundations—not of a beast, but of a man released from agonizing torment.',
      'Across the crypt flagstones, the lupine monstrosity collapsed, its monstrous frame unraveling into pale, dissipating mist. The tormented spirits of Victoria, Edward, and Dr. Hayes offered solemn nods of gratitude before dissolving into the aether.',
      'Detective Graves ascended into the courtyard as the iron gates creaked open under his touch. Behind him, the dawn sun pierced the gothic clouds, bathing Blackwood Manor in golden light. The Hollow Hour has passed.'
    ],
    outcome: 'EXORCISED (CANON VICTORY)',
    accentColor: '#f59e0b'
  },
  beast_eternal: {
    title: 'THE HOLLOW HEIR',
    subtitle: 'ENDING B — THE TRANSFERENCE EMBRACED',
    texture: 'ending_beast',
    paragraphs: [
      'You cast the dagger aside and pressed your open palm onto the concentric crimson runes. The lunar pulse surged into your veins like molten silver, scorching away reason, regret, and mortality.',
      'Detective Graves fell to his knees as bone splintered and sinew rewrote itself under coarse charcoal fur. The consciousness of Alistair Blackthorn did not perish—it joined yours in an unholy apex predator, hungry and eternal.',
      'When police constables breach the gates of Blackwood Manor tomorrow night, they will find only an empty trenchcoat, a discarded fedora, and fresh claw marks leading deep into the shadows of the woods.'
    ],
    outcome: 'POSSESSED (DARK ENDING)',
    accentColor: '#ef4444'
  },
  ash_memory: {
    title: 'ASH AND MEMORY',
    subtitle: 'ENDING C — THE IMMOLATION',
    texture: 'ending_fire',
    paragraphs: [
      'Realizing the corruption of Blackwood Manor could never be severed by mere prayers, you smashed your lantern into the alchemical drums. A torrent of blue and orange fire erupted, turning the crypt into an inescapable inferno.',
      'The beast shrieked in terror as the flames consumed flesh, grimoires, and the obsidian altar alike. You leaned against the locked door as the masonry collapsed around you, knowing that no horror would escape into the world of men.',
      'By morning, nothing remained of Blackwood Manor but smoldering ruins and towering chimneys. The terrible secrets of the Hollow Hour were reduced to ash and silence.'
    ],
    outcome: 'MARTYRDOM (TRAGIC ENDING)',
    accentColor: '#ea580c'
  }
};

export class EndingScene extends Phaser.Scene {
  private audioManager!: AudioManager;
  private endingType: EndingType = 'severed_curse';
  private canAcceptInput = false;

  constructor() {
    super('EndingScene');
  }

  public init(data?: EndingData): void {
    this.endingType = data?.ending || 'severed_curse';
  }

  public create(): void {
    this.audioManager = AudioManager.getInstance();
    this.canAcceptInput = false;
    const { width, height } = this.scale;

    const content = ENDINGS[this.endingType] || ENDINGS.severed_curse;

    // Atmospheric dark backdrop
    this.add.rectangle(width / 2, height / 2, width, height, 0x060408).setOrigin(0.5, 0.5);

    // Audio cue
    if (this.endingType === 'severed_curse') {
      this.audioManager.playGhostChime();
    } else if (this.endingType === 'beast_eternal') {
      this.audioManager.playWerewolfHowl();
    } else {
      this.audioManager.playHorrorSting();
    }

    // Main layout container (600 x 330)
    const panelW = 600;
    const panelH = 330;
    const panel = this.add.rectangle(width / 2, height / 2, panelW, panelH, 0x0c0810, 0.94);
    panel.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(content.accentColor).color);

    // Corner Ornate flourishes
    this.add.image(width / 2 - panelW / 2 + 2, height / 2 - panelH / 2 + 2, 'ui_frame').setOrigin(0, 0);
    this.add.image(width / 2 + panelW / 2 - 2, height / 2 - panelH / 2 + 2, 'ui_frame').setOrigin(1, 0).setFlipX(true);
    this.add.image(width / 2 - panelW / 2 + 2, height / 2 + panelH / 2 - 2, 'ui_frame').setOrigin(0, 1).setFlipY(true);
    this.add.image(width / 2 + panelW / 2 - 2, height / 2 + panelH / 2 - 2, 'ui_frame').setOrigin(1, 1).setFlipX(true).setFlipY(true);

    // Title & Subtitle
    this.add.text(width / 2, 34, content.title, {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#fef08a',
      stroke: '#3b1016',
      strokeThickness: 3,
      letterSpacing: 4
    }).setOrigin(0.5, 0.5);

    this.add.text(width / 2, 54, `— ${content.subtitle} —`, {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '11px',
      color: content.accentColor,
      letterSpacing: 2
    }).setOrigin(0.5, 0.5);

    // Left Column: Artwork Card (280x160)
    const artX = width / 2 - 145;
    const artY = 155;
    this.add.image(artX, artY, content.texture).setOrigin(0.5, 0.5);

    // Right Column: Narrative Scroll & Case Summary
    const rightX = width / 2 + 10;
    const rightW = 275;

    // Narrative text box
    const narrativeText = content.paragraphs.join('\n\n');
    this.add.text(rightX, 74, narrativeText, {
      fontFamily: "'MedievalSharp', serif",
      fontSize: '9.5px',
      color: '#d4c5b3',
      lineSpacing: 4,
      wordWrap: { width: rightW, useAdvancedWrap: true }
    }).setOrigin(0, 0);

    // Bottom Case Summary strip
    const summaryBoxY = 252;
    const summaryBox = this.add.rectangle(width / 2, summaryBoxY, panelW - 40, 36, 0x07040a, 0.85);
    summaryBox.setStrokeStyle(1, 0x3d1c24);

    const notebook = NotebookSystem.getInstance();
    const cluesDiscovered = notebook.getClues().length;
    const objectivesDone = notebook.getObjectives().filter(o => o.completed).length;

    this.add.text(width / 2 - 240, summaryBoxY, `CLUES SOLVED: ${cluesDiscovered}/8`, {
      fontFamily: "'VT323', monospace",
      fontSize: '13px',
      color: '#c5a07c'
    }).setOrigin(0, 0.5);

    this.add.text(width / 2 - 80, summaryBoxY, `OBJECTIVES: ${objectivesDone}/5`, {
      fontFamily: "'VT323', monospace",
      fontSize: '13px',
      color: '#c5a07c'
    }).setOrigin(0, 0.5);

    this.add.text(width / 2 + 70, summaryBoxY, `VERDICT: ${content.outcome}`, {
      fontFamily: "'VT323', monospace",
      fontSize: '13px',
      color: content.accentColor
    }).setOrigin(0, 0.5);

    // Navigation Buttons at Bottom
    const btnY = 305;
    this.createButton(width / 2 - 95, btnY, 'RETURN TO MAIN MENU', () => {
      this.returnToMenu();
    });

    this.createButton(width / 2 + 95, btnY, 'VIEW CREDITS', () => {
      this.viewCredits();
    });

    // Keyboard navigation
    this.input.keyboard?.on('keydown-ENTER', () => {
      if (this.canAcceptInput) this.returnToMenu();
    });
    this.input.keyboard?.on('keydown-SPACE', () => {
      if (this.canAcceptInput) this.returnToMenu();
    });
    this.input.keyboard?.on('keydown-ESC', () => {
      if (this.canAcceptInput) this.returnToMenu();
    });

    // Fade in
    this.cameras.main.fadeIn(800, 0, 0, 0);
    this.time.delayedCall(400, () => {
      this.canAcceptInput = true;
    });
  }

  private createButton(x: number, y: number, text: string, onClick: () => void): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 160, 24, 0x180d1e, 0.9);
    bg.setStrokeStyle(1, 0x6e2838);

    const txt = this.add.text(0, 0, text, {
      fontFamily: "'VT323', monospace",
      fontSize: '13px',
      color: '#c2b09b',
      letterSpacing: 2
    }).setOrigin(0.5, 0.5);

    container.add([bg, txt]);

    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerover', () => {
      bg.setFillStyle(0x351224);
      bg.setStrokeStyle(1, 0xf59e0b);
      txt.setColor('#fef08a');
      this.audioManager.playHover();
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(0x180d1e);
      bg.setStrokeStyle(1, 0x6e2838);
      txt.setColor('#c2b09b');
    });
    bg.on('pointerdown', () => {
      this.audioManager.playSelect();
      onClick();
    });

    return container;
  }

  private returnToMenu(): void {
    if (!this.canAcceptInput) return;
    this.canAcceptInput = false;
    this.audioManager.playSelect();
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }

  private viewCredits(): void {
    if (!this.canAcceptInput) return;
    this.canAcceptInput = false;
    this.audioManager.playSelect();
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('CreditsScene');
    });
  }
}
