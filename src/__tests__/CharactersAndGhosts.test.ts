import { describe, it, expect, beforeEach } from 'vitest';
import { StoryManager } from '../systems/StoryManager';
import { NotebookSystem } from '../systems/NotebookSystem';
import { InventorySystem } from '../systems/InventorySystem';
import { DialogueSystem } from '../systems/DialogueSystem';
import { AudioManager } from '../audio/AudioManager';

describe('Phase 6 Characters, Ghosts and Dialogue Systems', () => {
  let story: StoryManager;
  let notebook: NotebookSystem;
  let inventory: InventorySystem;
  let dialogue: DialogueSystem;
  let audio: AudioManager;

  beforeEach(() => {
    StoryManager.resetInstance();
    NotebookSystem.resetInstance();
    InventorySystem.resetInstance();
    DialogueSystem.resetInstance();

    story = StoryManager.getInstance();
    notebook = NotebookSystem.getInstance();
    inventory = InventorySystem.getInstance();
    dialogue = DialogueSystem.getInstance();
    audio = AudioManager.getInstance();
  });

  describe('StoryManager Murder Progression', () => {
    it('triggers Edward\'s murder and updates suspect profile', () => {
      expect(story.getFlag('edward_murdered')).toBe(false);
      const initialProfile = notebook.getSuspect('suspect_edward');
      expect(initialProfile?.status).toBe('alive');

      story.triggerMurder('edward');

      expect(story.getFlag('edward_murdered')).toBe(true);
      expect(story.getChapter()).toBe('chapter_3_second_murder');

      const updatedProfile = notebook.getSuspect('suspect_edward');
      expect(updatedProfile?.status).toBe('deceased');
      expect(updatedProfile?.notes.some(n => n.includes('Savaged in the library'))).toBe(true);
    });

    it('triggers Victoria\'s murder and updates suspect profile', () => {
      expect(story.getFlag('victoria_murdered')).toBe(false);

      story.triggerMurder('victoria');

      expect(story.getFlag('victoria_murdered')).toBe(true);
      expect(story.getChapter()).toBe('chapter_4_conspiracy');

      const updatedProfile = notebook.getSuspect('suspect_victoria');
      expect(updatedProfile?.status).toBe('deceased');
      expect(updatedProfile?.notes.some(n => n.includes('Slain in the master bedroom'))).toBe(true);
    });

    it('triggers Hayes\' murder and updates suspect profile', () => {
      expect(story.getFlag('hayes_murdered')).toBe(false);

      story.triggerMurder('hayes');

      expect(story.getFlag('hayes_murdered')).toBe(true);
      expect(story.getChapter()).toBe('chapter_5_experiment');

      const updatedProfile = notebook.getSuspect('suspect_hayes');
      expect(updatedProfile?.status).toBe('deceased');
    });
  });

  describe('Character & Ghost Dialogue Trees', () => {
    it('executes Dr. Robert Hayes living dialogue and grants clues/items', () => {
      dialogue.startDialogue('hayes_intro');
      expect(dialogue.getCurrentSpeaker()).toBe('Dr. Robert Hayes');

      // Select prescriptions branch
      const choiceSelected = dialogue.selectChoice(0);
      expect(choiceSelected).toBe(true);
      expect(dialogue.getCurrentNode()?.id).toBe('hayes_prescriptions');

      // Verifies node enter rewards
      expect(notebook.hasClue('clue_hayes_revelation')).toBe(true);
      expect(inventory.hasItem('item_laudanum')).toBe(true);
    });

    it('executes Edward\'s Ghost spectral dialogue and gives witness clue', () => {
      dialogue.startDialogue('edward_ghost_intro');
      expect(dialogue.getCurrentSpeaker()).toBe('Edward\'s Ghost');
      expect(notebook.hasClue('clue_edward_warning')).toBe(true);

      // Inquire about the riddle
      dialogue.selectChoice(0);
      expect(dialogue.getCurrentNode()?.id).toBe('edward_ghost_riddle');
    });

    it('executes Victoria\'s Ghost spectral dialogue and grants confession and silver sigil', () => {
      dialogue.startDialogue('victoria_ghost_intro');
      expect(dialogue.getCurrentSpeaker()).toBe('Victoria\'s Ghost');
      expect(notebook.hasClue('clue_victoria_confession')).toBe(true);

      // Ask how to destroy the creature
      dialogue.selectChoice(0);
      expect(dialogue.getCurrentNode()?.id).toBe('victoria_ghost_revelation');

      // Ask for formula/alignment
      dialogue.selectChoice(0);
      expect(dialogue.getCurrentNode()?.id).toBe('victoria_ghost_formula');
      expect(inventory.hasItem('item_silver_sigil')).toBe(true);
    });

    it('executes Dr. Hayes\' Ghost dialogue and dispenses the ceremonial athame', () => {
      dialogue.startDialogue('hayes_ghost_intro');
      expect(dialogue.getCurrentSpeaker()).toBe('Hayes\' Ghost');

      dialogue.selectChoice(0);
      expect(dialogue.getCurrentNode()?.id).toBe('hayes_ghost_athame');
      expect(inventory.hasItem('item_ritual_dagger')).toBe(true);
    });
  });

  describe('Spectral Audio Synthesizer', () => {
    it('plays ghost chime and horror sting without throwing', () => {
      expect(() => audio.playGhostChime()).not.toThrow();
      expect(() => audio.playHorrorSting()).not.toThrow();
    });
  });
});
