import { describe, it, expect, beforeEach } from 'vitest';
import { PuzzleManager, BookshelfPuzzleController } from '../systems/PuzzleSystem';
import { InventorySystem } from '../systems/InventorySystem';
import { NotebookSystem } from '../systems/NotebookSystem';
import { StoryManager } from '../systems/StoryManager';

describe('Phase 5 Investigation and Puzzle Systems', () => {
  let inventory: InventorySystem;
  let notebook: NotebookSystem;
  let story: StoryManager;
  let puzzles: PuzzleManager;

  beforeEach(() => {
    InventorySystem.resetInstance();
    NotebookSystem.resetInstance();
    StoryManager.resetInstance();
    PuzzleManager.resetInstance();

    inventory = InventorySystem.getInstance();
    notebook = NotebookSystem.getInstance();
    story = StoryManager.getInstance();
    puzzles = PuzzleManager.getInstance();
  });

  describe('BookshelfPuzzleController', () => {
    it('initializes with unsolved state and empty pulls', () => {
      const bookshelf = puzzles.getBookshelfPuzzle();
      expect(bookshelf.isSolved()).toBe(false);
      expect(bookshelf.getCurrentPulls()).toEqual([]);
    });

    it('resets sequence if wrong book index is pulled', () => {
      const bookshelf = puzzles.getBookshelfPuzzle();
      // Target is 2, 1, 3
      const step1 = bookshelf.pullBook(0); // Wrong!
      expect(step1.success).toBe(false);
      expect(step1.reset).toBe(true);
      expect(bookshelf.getCurrentPulls()).toEqual([]);
    });

    it('advances sequence with correct pulls and solves on final book', () => {
      const bookshelf = puzzles.getBookshelfPuzzle();

      const step1 = bookshelf.pullBook(2);
      expect(step1.success).toBe(true);
      expect(step1.solved).toBe(false);
      expect(bookshelf.getCurrentPulls()).toEqual([2]);

      const step2 = bookshelf.pullBook(1);
      expect(step2.success).toBe(true);
      expect(step2.solved).toBe(false);
      expect(bookshelf.getCurrentPulls()).toEqual([2, 1]);

      const step3 = bookshelf.pullBook(3);
      expect(step3.success).toBe(true);
      expect(step3.solved).toBe(true);
      expect(bookshelf.isSolved()).toBe(true);

      // Verify progression rewards
      expect(story.getFlag('bookshelf_puzzle_solved')).toBe(true);
      expect(inventory.hasItem('item_silver_sigil')).toBe(true);
      expect(notebook.hasClue('clue_hidden_compartment')).toBe(true);
    });

    it('serializes and restores state', () => {
      const bookshelf = puzzles.getBookshelfPuzzle();
      bookshelf.pullBook(2);
      bookshelf.pullBook(1);

      const state = bookshelf.getState();
      expect(state.currentPulls).toEqual([2, 1]);

      const newBookshelf = new BookshelfPuzzleController();
      newBookshelf.restoreState(state);
      expect(newBookshelf.getCurrentPulls()).toEqual([2, 1]);
    });
  });

  describe('CCTVPuzzleController', () => {
    it('allows viewing channels 1 to 4 freely', () => {
      const cctv = puzzles.getCCTVPuzzle();
      const ch1 = cctv.setChannel(1);
      expect(ch1.allowed).toBe(true);
      expect(ch1.isTapeReel).toBe(false);

      const ch4 = cctv.setChannel(4);
      expect(ch4.allowed).toBe(true);
      expect(cctv.getChannel()).toBe(4);
    });

    it('refuses channel 5 until Surveillance Reel #3 is inserted', () => {
      const cctv = puzzles.getCCTVPuzzle();
      const ch5NoTape = cctv.setChannel(5);
      expect(ch5NoTape.allowed).toBe(false);
      expect(ch5NoTape.isTapeReel).toBe(true);
      expect(cctv.isTapeInserted()).toBe(false);
    });

    it('inserts tape from inventory and unlocks channel 5 with werewolf clue', () => {
      const cctv = puzzles.getCCTVPuzzle();
      inventory.addItem('item_cctv_tape');

      const inserted = cctv.insertTape();
      expect(inserted).toBe(true);
      expect(cctv.isTapeInserted()).toBe(true);
      expect(inventory.hasItem('item_cctv_tape')).toBe(false);

      const ch5 = cctv.setChannel(5);
      expect(ch5.allowed).toBe(true);
      expect(ch5.discovered).toBe(true);
      expect(cctv.isSolved()).toBe(true);

      expect(story.getFlag('cctv_werewolf_discovered')).toBe(true);
      expect(notebook.hasClue('clue_cctv_werewolf')).toBe(true);
      expect(notebook.isObjectiveCompleted('obj_check_cctv')).toBe(true);
    });
  });

  describe('OccultPuzzleController', () => {
    it('initializes with default concentric ring positions', () => {
      const altar = puzzles.getOccultPuzzle();
      expect(altar.isSolved()).toBe(false);
      expect(altar.getRingPositions()).toEqual([4, 7, 1]);
    });

    it('rotates active rings and solves upon matching celestial target [0, 3, 4]', () => {
      const altar = puzzles.getOccultPuzzle();

      // Outer ring (target 0, current 4) -> rotate +4
      altar.setActiveRing(0);
      altar.rotateActiveRing(4);
      expect(altar.getRingPositions()[0]).toBe(0);

      // Middle ring (target 3, current 7) -> rotate +4 (7 + 4 = 11 % 8 = 3)
      altar.setActiveRing(1);
      altar.rotateActiveRing(4);
      expect(altar.getRingPositions()[1]).toBe(3);

      // Inner ring (target 4, current 1) -> rotate +3 (1 + 3 = 4)
      altar.setActiveRing(2);
      const solved = altar.rotateActiveRing(3);
      expect(solved).toBe(true);
      expect(altar.isSolved()).toBe(true);

      // Verify rewards and unlocks
      expect(story.getFlag('occult_altar_solved')).toBe(true);
      expect(inventory.hasItem('item_iron_key')).toBe(true);
      expect(notebook.hasClue('clue_basement_altar')).toBe(true);
      expect(notebook.isObjectiveCompleted('obj_occult_altar')).toBe(true);
    });
  });

  describe('PuzzleManager Registry and Serialization', () => {
    it('serializes and deserializes all registered puzzles', () => {
      const clock = puzzles.getClockPuzzle();
      clock.setTime(3, 33);
      expect(clock.isSolved()).toBe(true);

      const cctv = puzzles.getCCTVPuzzle();
      cctv.solve();

      const serialized = puzzles.serialize();
      expect(serialized['puzzle_grandfather_clock'].solved).toBe(true);
      expect(serialized['puzzle_cctv'].reviewedWerewolf).toBe(true);

      // Reset and restore
      PuzzleManager.resetInstance();
      const freshPuzzles = PuzzleManager.getInstance();
      expect(freshPuzzles.getClockPuzzle().isSolved()).toBe(false);

      freshPuzzles.deserialize(serialized);
      expect(freshPuzzles.getClockPuzzle().isSolved()).toBe(true);
      expect(freshPuzzles.getCCTVPuzzle().isSolved()).toBe(true);
    });
  });
});
