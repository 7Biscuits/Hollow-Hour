import { StoryChapter } from '../types';
import { NotebookSystem } from './NotebookSystem';

export class StoryManager {
  private static instance: StoryManager | null = null;
  private currentChapter: StoryChapter = 'chapter_1_arrival';
  private flags: Map<string, any> = new Map();
  private unlockedDoors: Set<string> = new Set();
  private listeners: Array<(event: string, data?: any) => void> = [];

  private constructor() {
    this.resetToDefaults();
  }

  public static getInstance(): StoryManager {
    if (!StoryManager.instance) {
      StoryManager.instance = new StoryManager();
    }
    return StoryManager.instance;
  }

  public static resetInstance(): void {
    StoryManager.instance = new StoryManager();
  }

  public resetToDefaults(): void {
    this.currentChapter = 'chapter_1_arrival';
    this.flags.clear();
    this.unlockedDoors.clear();

    // Default flags
    this.setFlag('clock_puzzle_solved', false);
    this.setFlag('fireplace_searched', false);
    this.setFlag('cctv_tape_viewed', false);
    this.setFlag('secret_passage_opened', false);
    this.setFlag('victoria_murdered', false);
    this.setFlag('edward_murdered', false);
    this.setFlag('hayes_murdered', false);
    this.setFlag('werewolf_alert', false);
    this.setFlag('ritual_performed', false);
    this.setFlag('bookshelf_puzzle_solved', false);
    this.setFlag('occult_altar_solved', false);
  }

  public getChapter(): StoryChapter {
    return this.currentChapter;
  }

  public setChapter(chapter: StoryChapter): void {
    if (this.currentChapter !== chapter) {
      this.currentChapter = chapter;
      this.emit('chapterChanged', chapter);
    }
  }

  public getFlag<T = any>(key: string, defaultValue?: T): T {
    if (this.flags.has(key)) {
      return this.flags.get(key);
    }
    return defaultValue as T;
  }

  public setFlag(key: string, value: any): void {
    const prev = this.flags.get(key);
    if (prev !== value) {
      this.flags.set(key, value);
      this.emit('flagChanged', { key, value, prev });
    }
  }

  public isDoorUnlocked(doorId: string): boolean {
    return this.unlockedDoors.has(doorId);
  }

  public unlockDoor(doorId: string): void {
    if (!this.unlockedDoors.has(doorId)) {
      this.unlockedDoors.add(doorId);
      this.emit('doorUnlocked', doorId);
    }
  }

  public triggerMurder(victim: 'edward' | 'victoria' | 'hayes'): void {
    if (victim === 'edward' && !this.getFlag('edward_murdered')) {
      this.setFlag('edward_murdered', true);
      this.setChapter('chapter_3_second_murder');
      NotebookSystem.getInstance().updateSuspectStatus(
        'suspect_edward',
        'deceased',
        'Savaged in the library. His spirit confirms the beast possessed Alistair\'s likeness.'
      );
      this.emit('characterMurdered', 'edward');
    } else if (victim === 'victoria' && !this.getFlag('victoria_murdered')) {
      this.setFlag('victoria_murdered', true);
      this.setChapter('chapter_4_conspiracy');
      NotebookSystem.getInstance().updateSuspectStatus(
        'suspect_victoria',
        'deceased',
        'Slain in the master bedroom. Her spirit confessed Alistair sought immortality in the beast.'
      );
      this.emit('characterMurdered', 'victoria');
    } else if (victim === 'hayes' && !this.getFlag('hayes_murdered')) {
      this.setFlag('hayes_murdered', true);
      this.setChapter('chapter_5_experiment');
      NotebookSystem.getInstance().updateSuspectStatus(
        'suspect_hayes',
        'deceased',
        'Killed beside the crypt altar before he could ignite the silver nitrate.'
      );
      this.emit('characterMurdered', 'hayes');
    }
  }

  public getUnlockedDoors(): string[] {
    return Array.from(this.unlockedDoors);
  }

  public on(listener: (event: string, data?: any) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emit(event: string, data?: any): void {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch (e) {
        console.error('[StoryManager] Listener error', e);
      }
    }
  }

  public serialize(): {
    chapter: StoryChapter;
    flags: Record<string, any>;
    unlockedDoors: string[];
  } {
    const flagsObj: Record<string, any> = {};
    this.flags.forEach((val, key) => {
      flagsObj[key] = val;
    });

    return {
      chapter: this.currentChapter,
      flags: flagsObj,
      unlockedDoors: Array.from(this.unlockedDoors)
    };
  }

  public deserialize(data: {
    chapter?: StoryChapter;
    flags?: Record<string, any>;
    unlockedDoors?: string[];
  }): void {
    if (data.chapter) this.currentChapter = data.chapter;
    if (data.flags) {
      this.flags.clear();
      for (const [k, v] of Object.entries(data.flags)) {
        this.flags.set(k, v);
      }
    }
    if (Array.isArray(data.unlockedDoors)) {
      this.unlockedDoors = new Set(data.unlockedDoors);
    }
    this.emit('stateLoaded');
  }
}
