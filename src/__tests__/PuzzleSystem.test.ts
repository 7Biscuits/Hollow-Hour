import { describe, it, expect, beforeEach } from 'vitest';
import { PuzzleManager, ClockPuzzleController } from '../systems/PuzzleSystem';
import { InventorySystem } from '../systems/InventorySystem';
import { NotebookSystem } from '../systems/NotebookSystem';
import { StoryManager } from '../systems/StoryManager';

describe('PuzzleSystem & ClockPuzzleController', () => {
  let puzzleManager: PuzzleManager;
  let clock: ClockPuzzleController;

  beforeEach(() => {
    InventorySystem.resetInstance();
    NotebookSystem.resetInstance();
    StoryManager.resetInstance();
    PuzzleManager.resetInstance();

    puzzleManager = PuzzleManager.getInstance();
    clock = puzzleManager.getClockPuzzle();
  });

  it('initializes unsolved at 12:00', () => {
    expect(clock.isSolved()).toBe(false);
    expect(clock.getTime()).toEqual({ hour: 12, minute: 0 });
  });

  it('rotates hour and minute hands', () => {
    clock.rotateHour(3);
    expect(clock.getTime().hour).toBe(3);

    clock.rotateMinute(30);
    expect(clock.getTime().minute).toBe(30);
  });

  it('does not solve at arbitrary time', () => {
    clock.setTime(5, 20);
    expect(clock.isSolved()).toBe(false);
  });

  it('solves at the Hollow Hour (3:33) and dispenses the Tarnished Brass Key', () => {
    const inventory = InventorySystem.getInstance();
    const story = StoryManager.getInstance();
    const notebook = NotebookSystem.getInstance();

    expect(inventory.hasItem('item_brass_key')).toBe(false);
    expect(story.getFlag('clock_puzzle_solved')).toBe(false);

    // Set to 3:33
    const solved = clock.setTime(3, 33);
    expect(solved).toBe(true);
    expect(clock.isSolved()).toBe(true);

    // Rewards & progression check
    expect(inventory.hasItem('item_brass_key')).toBe(true);
    expect(story.getFlag('clock_puzzle_solved')).toBe(true);
    expect(notebook.hasClue('clue_grandfather_clock')).toBe(true);

    const clockObj = notebook.getObjectives().find(o => o.id === 'obj_solve_clock');
    expect(clockObj?.completed).toBe(true);
  });
});
