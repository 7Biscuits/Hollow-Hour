import { describe, it, expect, beforeEach } from 'vitest';
import { DialogueSystem } from '../systems/DialogueSystem';
import { InventorySystem } from '../systems/InventorySystem';
import { NotebookSystem } from '../systems/NotebookSystem';
import { StoryManager } from '../systems/StoryManager';

describe('DialogueSystem', () => {
  let dialogue: DialogueSystem;

  beforeEach(() => {
    InventorySystem.resetInstance();
    NotebookSystem.resetInstance();
    StoryManager.resetInstance();
    DialogueSystem.resetInstance();

    dialogue = DialogueSystem.getInstance();
  });

  it('starts dialogue node and displays speaker and lines', () => {
    const started = dialogue.startDialogue('victoria_intro');
    expect(started).toBe(true);
    expect(dialogue.isActive()).toBe(true);

    const node = dialogue.getCurrentNode();
    expect(node?.speaker).toBe('Victoria Vance');
    expect(dialogue.getCurrentLine()).toContain('Inspector Graves');
  });

  it('advances through dialogue lines sequentially', () => {
    dialogue.startDialogue('victoria_intro');
    expect(dialogue.hasMoreLines()).toBe(true);

    dialogue.advance();
    expect(dialogue.getCurrentLine()).toContain('Alistair was');

    dialogue.advance();
    expect(dialogue.getCurrentLine()).toContain('iron bolts');
    expect(dialogue.hasMoreLines()).toBe(false);
    expect(dialogue.isAtChoices()).toBe(true);
  });

  it('presents branching dialogue choices and transitions nodes', () => {
    dialogue.startDialogue('victoria_intro');
    dialogue.advance();
    dialogue.advance();

    const choices = dialogue.getAvailableChoices();
    expect(choices.length).toBe(3);

    // Select second choice: Alistair's unusual obsessions
    dialogue.selectChoice(1);
    expect(dialogue.getCurrentNode()?.id).toBe('victoria_occult');

    // Victoria gives the clock hand item and clue
    const inventory = InventorySystem.getInstance();
    const notebook = NotebookSystem.getInstance();
    expect(inventory.hasItem('item_clock_hand')).toBe(true);
    expect(notebook.hasClue('clue_grandfather_clock')).toBe(true);
  });

  it('ends dialogue cleanly', () => {
    dialogue.startDialogue('victoria_dismiss');
    expect(dialogue.isActive()).toBe(true);

    dialogue.advance();
    expect(dialogue.isActive()).toBe(false);
  });
});
