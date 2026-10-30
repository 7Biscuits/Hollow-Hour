import { describe, it, expect, beforeEach } from 'vitest';
import { StoryManager } from '../systems/StoryManager';

describe('StoryManager', () => {
  let story: StoryManager;

  beforeEach(() => {
    StoryManager.resetInstance();
    story = StoryManager.getInstance();
  });

  it('starts at Chapter I with default flags', () => {
    expect(story.getChapter()).toBe('chapter_1_arrival');
    expect(story.getFlag('clock_puzzle_solved')).toBe(false);
  });

  it('sets and retrieves story flags', () => {
    story.setFlag('test_flag', true);
    expect(story.getFlag('test_flag')).toBe(true);

    story.setFlag('counter', 42);
    expect(story.getFlag('counter')).toBe(42);
  });

  it('tracks unlocked doors and emits doorUnlocked event', () => {
    let unlockedDoorId = '';
    story.on((event, data) => {
      if (event === 'doorUnlocked') {
        unlockedDoorId = data;
      }
    });

    expect(story.isDoorUnlocked('door_to_bedroom')).toBe(false);
    story.unlockDoor('door_to_bedroom');
    expect(story.isDoorUnlocked('door_to_bedroom')).toBe(true);
    expect(unlockedDoorId).toBe('door_to_bedroom');
  });

  it('advances story chapters and serializes state', () => {
    story.setChapter('chapter_2_first_murder');
    story.setFlag('victoria_murdered', true);
    story.unlockDoor('door_to_bedroom');

    const serialized = story.serialize();
    expect(serialized.chapter).toBe('chapter_2_first_murder');
    expect(serialized.flags.victoria_murdered).toBe(true);
    expect(serialized.unlockedDoors).toContain('door_to_bedroom');

    StoryManager.resetInstance();
    const newStory = StoryManager.getInstance();
    newStory.deserialize(serialized);

    expect(newStory.getChapter()).toBe('chapter_2_first_murder');
    expect(newStory.getFlag('victoria_murdered')).toBe(true);
    expect(newStory.isDoorUnlocked('door_to_bedroom')).toBe(true);
  });
});
