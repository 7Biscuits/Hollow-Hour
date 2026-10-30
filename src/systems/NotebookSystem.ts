import { ClueEntry, SuspectProfile, CaseObjective, SuspectStatus } from '../types';
import { INITIAL_SUSPECTS, INITIAL_OBJECTIVES, CLUE_CATALOG } from '../data/NotebookCatalog';

export class NotebookSystem {
  private static instance: NotebookSystem | null = null;
  private clues: ClueEntry[] = [];
  private suspects: SuspectProfile[] = [];
  private objectives: CaseObjective[] = [];
  private discoveredRooms: Set<string> = new Set(['entrance_hall']);
  private listeners: Array<() => void> = [];

  private constructor() {
    this.resetToDefaults();
  }

  public static getInstance(): NotebookSystem {
    if (!NotebookSystem.instance) {
      NotebookSystem.instance = new NotebookSystem();
    }
    return NotebookSystem.instance;
  }

  public static resetInstance(): void {
    NotebookSystem.instance = new NotebookSystem();
  }

  public resetToDefaults(): void {
    this.clues = [];
    this.suspects = JSON.parse(JSON.stringify(INITIAL_SUSPECTS));
    this.objectives = JSON.parse(JSON.stringify(INITIAL_OBJECTIVES));
    this.discoveredRooms = new Set(['entrance_hall']);
    this.notifyListeners();
  }

  public addClue(clueOrId: ClueEntry | string): boolean {
    const clue = typeof clueOrId === 'string' ? CLUE_CATALOG[clueOrId] : clueOrId;
    if (!clue) {
      console.warn(`[NotebookSystem] Clue not found in catalog: ${clueOrId}`);
      return false;
    }

    if (this.hasClue(clue.id)) {
      return false;
    }

    this.clues.push({
      ...clue,
      discoveredAt: clue.discoveredAt || Date.now()
    });
    this.notifyListeners();
    return true;
  }

  public hasClue(id: string): boolean {
    return this.clues.some(c => c.id === id);
  }

  public getClues(): ClueEntry[] {
    return [...this.clues];
  }

  public getClue(id: string): ClueEntry | undefined {
    return this.clues.find(c => c.id === id);
  }

  public getSuspects(): SuspectProfile[] {
    return [...this.suspects];
  }

  public getSuspect(id: string): SuspectProfile | undefined {
    return this.suspects.find(s => s.id === id);
  }

  public updateSuspectStatus(suspectId: string, status: SuspectStatus, newNote?: string): void {
    const suspect = this.suspects.find(s => s.id === suspectId);
    if (suspect) {
      suspect.status = status;
      if (newNote && !suspect.notes.includes(newNote)) {
        suspect.notes.push(newNote);
      }
      this.notifyListeners();
    }
  }

  public getObjectives(): CaseObjective[] {
    return [...this.objectives];
  }

  public addObjective(objective: CaseObjective): void {
    if (!this.objectives.some(o => o.id === objective.id)) {
      this.objectives.push({ ...objective });
      this.notifyListeners();
    }
  }

  public completeObjective(id: string): void {
    const obj = this.objectives.find(o => o.id === id);
    if (obj && !obj.completed) {
      obj.completed = true;
      this.notifyListeners();
    }
  }

  public isObjectiveCompleted(id: string): boolean {
    const obj = this.objectives.find(o => o.id === id);
    return obj ? obj.completed : false;
  }

  public discoverRoom(roomId: string): void {
    if (!this.discoveredRooms.has(roomId)) {
      this.discoveredRooms.add(roomId);
      this.notifyListeners();
    }
  }

  public getDiscoveredRooms(): string[] {
    return Array.from(this.discoveredRooms);
  }

  public isRoomDiscovered(roomId: string): boolean {
    return this.discoveredRooms.has(roomId);
  }

  public onChange(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (e) {
        console.error('[NotebookSystem] Listener error', e);
      }
    }
  }

  public serialize(): {
    clues: ClueEntry[];
    suspects: SuspectProfile[];
    objectives: CaseObjective[];
    discoveredRooms: string[];
  } {
    return {
      clues: JSON.parse(JSON.stringify(this.clues)),
      suspects: JSON.parse(JSON.stringify(this.suspects)),
      objectives: JSON.parse(JSON.stringify(this.objectives)),
      discoveredRooms: Array.from(this.discoveredRooms)
    };
  }

  public deserialize(data: {
    clues?: ClueEntry[];
    suspects?: SuspectProfile[];
    objectives?: CaseObjective[];
    discoveredRooms?: string[];
  }): void {
    if (Array.isArray(data.clues)) this.clues = data.clues;
    if (Array.isArray(data.suspects)) this.suspects = data.suspects;
    if (Array.isArray(data.objectives)) this.objectives = data.objectives;
    if (Array.isArray(data.discoveredRooms)) this.discoveredRooms = new Set(data.discoveredRooms);
    this.notifyListeners();
  }
}
