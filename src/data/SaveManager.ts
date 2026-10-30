import { SaveData } from '../types';

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
    const save: SaveData = {
      slot: 1,
      chapter: 'Chapter I: The Veiled Foyer',
      location: 'Blackwood Manor - West Wing',
      timestamp: Date.now(),
      playtimeMinutes: 42,
      health: 85,
      inventoryCount: 4,
      ...custom
    };

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch (e) {
      console.error('Failed to save game', e);
    }

    return save;
  }

  public deleteSave(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.error('Failed to clear save', e);
    }
  }
}
