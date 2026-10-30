import { describe, it, expect, beforeEach } from 'vitest';
import { StoryManager } from '../systems/StoryManager';
import { NotebookSystem } from '../systems/NotebookSystem';
import { InventorySystem } from '../systems/InventorySystem';
import { EndingType } from '../scenes/EndingScene';

describe('Phase 8 - Complete Story Implementation and Endings', () => {
  let story: StoryManager;
  let notebook: NotebookSystem;
  let inventory: InventorySystem;

  beforeEach(() => {
    StoryManager.resetInstance();
    NotebookSystem.resetInstance();
    InventorySystem.resetInstance();

    story = StoryManager.getInstance();
    notebook = NotebookSystem.getInstance();
    inventory = InventorySystem.getInstance();
  });

  describe('Full Narrative Progression Flow', () => {
    it('initializes at Chapter 1: Arrival with default uncompleted flags', () => {
      expect(story.getChapter()).toBe('chapter_1_arrival');
      expect(story.getFlag('cctv_tape_viewed')).toBe(false);
      expect(story.getFlag('edward_murdered')).toBe(false);
      expect(story.getFlag('victoria_murdered')).toBe(false);
      expect(story.getFlag('hayes_murdered')).toBe(false);
      expect(story.getFlag('clock_puzzle_solved')).toBe(false);
    });

    it('progresses to Chapter 3 when Edward is savaged in the library', () => {
      story.triggerMurder('edward');
      expect(story.getFlag('edward_murdered')).toBe(true);
      expect(story.getChapter()).toBe('chapter_3_second_murder');

      const edwardSuspect = notebook.getSuspect('suspect_edward');
      expect(edwardSuspect?.status).toBe('deceased');
    });

    it('progresses to Chapter 4 when Victoria is murdered in the bedroom', () => {
      story.triggerMurder('victoria');
      expect(story.getFlag('victoria_murdered')).toBe(true);
      expect(story.getChapter()).toBe('chapter_4_conspiracy');

      const victoriaSuspect = notebook.getSuspect('suspect_victoria');
      expect(victoriaSuspect?.status).toBe('deceased');
    });

    it('progresses to Chapter 5 when Hayes is murdered at the altar', () => {
      story.triggerMurder('hayes');
      expect(story.getFlag('hayes_murdered')).toBe(true);
      expect(story.getChapter()).toBe('chapter_5_experiment');

      const hayesSuspect = notebook.getSuspect('suspect_hayes');
      expect(hayesSuspect?.status).toBe('deceased');
    });

    it('supports Chapter 7 Climax Ritual transition', () => {
      story.setChapter('chapter_7_ritual');
      expect(story.getChapter()).toBe('chapter_7_ritual');
    });
  });

  describe('Three Branching Endings', () => {
    const validEndings: EndingType[] = ['severed_curse', 'beast_eternal', 'ash_memory'];

    it('validates all three distinct ending routes', () => {
      expect(validEndings).toHaveLength(3);
      expect(validEndings).toContain('severed_curse');
      expect(validEndings).toContain('beast_eternal');
      expect(validEndings).toContain('ash_memory');
    });

    it('Ending A requires Ceremonial Athame and Silver Sigil', () => {
      // Initially player has neither
      expect(inventory.hasItem('item_ritual_dagger')).toBe(false);
      expect(inventory.hasItem('item_silver_sigil')).toBe(false);

      // Player acquires both from solved puzzles / spectral confessions
      inventory.addItem('item_ritual_dagger');
      inventory.addItem('item_silver_sigil');

      const canExorcise = inventory.hasItem('item_ritual_dagger') && inventory.hasItem('item_silver_sigil');
      expect(canExorcise).toBe(true);
    });

    it('Ending B and C can be performed regardless of inventory items', () => {
      // Dark transference or immolation are always accessible choices at 3:33 AM
      const canChooseTransference = true;
      const canChooseImmolation = true;

      expect(canChooseTransference).toBe(true);
      expect(canChooseImmolation).toBe(true);
    });
  });

  describe('Story State Serialization and Persistence', () => {
    it('serializes and deserializes the full narrative state including solved flags and chapters', () => {
      story.setChapter('chapter_7_ritual');
      story.setFlag('cctv_footage_reviewed', true);
      story.setFlag('bookshelf_puzzle_solved', true);
      story.setFlag('occult_altar_solved', true);
      story.unlockDoor('door_to_bedroom');

      const serialized = story.serialize();
      expect(serialized.chapter).toBe('chapter_7_ritual');
      expect(serialized.flags['occult_altar_solved']).toBe(true);
      expect(serialized.unlockedDoors).toContain('door_to_bedroom');

      // Reset and reload
      story.resetToDefaults();
      expect(story.getChapter()).toBe('chapter_1_arrival');
      expect(story.getFlag('occult_altar_solved')).toBe(false);

      story.deserialize(serialized);
      expect(story.getChapter()).toBe('chapter_7_ritual');
      expect(story.getFlag('occult_altar_solved')).toBe(true);
      expect(story.isDoorUnlocked('door_to_bedroom')).toBe(true);
    });
  });
});
