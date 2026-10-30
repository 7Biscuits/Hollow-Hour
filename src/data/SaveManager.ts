import { SaveData } from '../types';
import { InventorySystem } from '../systems/InventorySystem';
import { NotebookSystem } from '../systems/NotebookSystem';
import { StoryManager } from '../systems/StoryManager';
import { PuzzleManager } from '../systems/PuzzleSystem';

const SAVE_KEY = 'the_hollow_hour_save_slot_1';

export class SaveManager {
  private static instance: SaveManager;

  private constructor() {}

  public static getInstance(): SaveManager {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  public hasSave(): boolean {
    try {
      const data = localStorage.getItem(SAVE_KEY);
      return data !== null && data.length > 0;
    } catch {
      return false;
    }
  }

  public getSave(): SaveData | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SaveData;
    } catch (e) {
      console.warn('Failed to parse save data', e);
      return null;
    }
  }

  public createSave(custom?: Partial<SaveData>): SaveData {
    const inventory = InventorySystem.getInstance();
    const notebook = NotebookSystem.getInstance();
    const story = StoryManager.getInstance();
    const puzzleManager = PuzzleManager.getInstance();

    const storyState = story.serialize();
    const notebookState = notebook.serialize();

    const save: SaveData = {
      slot: 1,
      chapter: 'Chapter I: The Hollow Hour',
      location: 'Blackwood Manor - Entrance Hall',
      timestamp: Date.now(),
      playtimeMinutes: custom?.playtimeMinutes ?? 42,
      health: custom?.health !== undefined ? custom.health : 85,
      inventoryCount: inventory.getCount(),
      inventory: inventory.serialize(),
      clues: notebookState.clues,
      suspects: notebookState.suspects,
      objectives: notebookState.objectives,
      discoveredRooms: notebookState.discoveredRooms,
      storyFlags: storyState.flags,
      unlockedDoors: storyState.unlockedDoors,
      solvedPuzzles: puzzleManager.serialize(),
      ...custom
    };

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch (e) {
      console.error('Failed to save game', e);
    }

    return save;
  }

  public loadSave(): boolean {
    const save = this.getSave();
    if (!save) return false;

    if (save.inventory) {
      InventorySystem.getInstance().deserialize(save.inventory);
    }
    NotebookSystem.getInstance().deserialize({
      clues: save.clues,
      suspects: save.suspects,
      objectives: save.objectives,
      discoveredRooms: save.discoveredRooms
    });
    StoryManager.getInstance().deserialize({
      flags: save.storyFlags,
      unlockedDoors: save.unlockedDoors
    });
    if (save.solvedPuzzles) {
      PuzzleManager.getInstance().deserialize(save.solvedPuzzles);
    }

    return true;
  }

  public deleteSave(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.error('Failed to clear save', e);
    }
  }
}
