import { describe, it, expect, beforeEach } from 'vitest';
import { SaveManager } from '../data/SaveManager';

describe('SaveManager', () => {
  let saveManager: SaveManager;

  beforeEach(() => {
    localStorage.clear();
    saveManager = SaveManager.getInstance();
  });

  it('reports no save when storage is empty', () => {
    expect(saveManager.hasSave()).toBe(false);
    expect(saveManager.getSave()).toBeNull();
  });

  it('creates and retrieves a valid save game slot', () => {
    saveManager.createSave({
      chapter: 'Chapter I: The Arrival',
      location: 'Entrance Foyer'
    });

    expect(saveManager.hasSave()).toBe(true);
    const loaded = saveManager.getSave();
    expect(loaded).not.toBeNull();
    expect(loaded?.chapter).toBe('Chapter I: The Arrival');
    expect(loaded?.location).toBe('Entrance Foyer');
    expect(loaded?.health).toBe(85);
  });

  it('deletes existing save game slot', () => {
    saveManager.createSave();
    expect(saveManager.hasSave()).toBe(true);

    saveManager.deleteSave();
    expect(saveManager.hasSave()).toBe(false);
    expect(saveManager.getSave()).toBeNull();
  });
});
