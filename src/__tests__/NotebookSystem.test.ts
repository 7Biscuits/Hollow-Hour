import { describe, it, expect, beforeEach } from 'vitest';
import { NotebookSystem } from '../systems/NotebookSystem';

describe('NotebookSystem', () => {
  let notebook: NotebookSystem;

  beforeEach(() => {
    NotebookSystem.resetInstance();
    notebook = NotebookSystem.getInstance();
  });

  it('initializes with default suspects, objectives and starting room', () => {
    expect(notebook.getSuspects().length).toBeGreaterThanOrEqual(4);
    expect(notebook.getObjectives().length).toBeGreaterThanOrEqual(3);
    expect(notebook.isRoomDiscovered('entrance_hall')).toBe(true);
    expect(notebook.getClues().length).toBe(0);
  });

  it('records new clues and prevents duplicates', () => {
    const added1 = notebook.addClue('clue_grandfather_clock');
    expect(added1).toBe(true);
    expect(notebook.hasClue('clue_grandfather_clock')).toBe(true);
    expect(notebook.getClues().length).toBe(1);

    const duplicate = notebook.addClue('clue_grandfather_clock');
    expect(duplicate).toBe(false);
    expect(notebook.getClues().length).toBe(1);
  });

  it('updates suspect status and adds investigative notes', () => {
    notebook.updateSuspectStatus('suspect_victoria', 'deceased', 'Found lifeless with puncture marks on the neck.');
    const victoria = notebook.getSuspect('suspect_victoria');
    expect(victoria).toBeDefined();
    expect(victoria?.status).toBe('deceased');
    expect(victoria?.notes).toContain('Found lifeless with puncture marks on the neck.');
  });

  it('completes active objectives', () => {
    const obj = notebook.getObjectives().find(o => o.id === 'obj_solve_clock');
    expect(obj?.completed).toBe(false);

    notebook.completeObjective('obj_solve_clock');
    const updated = notebook.getObjectives().find(o => o.id === 'obj_solve_clock');
    expect(updated?.completed).toBe(true);
  });

  it('tracks room discovery on the mansion map', () => {
    expect(notebook.isRoomDiscovered('basement')).toBe(false);
    notebook.discoverRoom('basement');
    expect(notebook.isRoomDiscovered('basement')).toBe(true);
  });
});
