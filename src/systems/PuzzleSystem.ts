import { StoryManager } from './StoryManager';
import { InventorySystem } from './InventorySystem';
import { NotebookSystem } from './NotebookSystem';

export interface IPuzzleController {
  id: string;
  name: string;
  isSolved(): boolean;
  solve(): boolean;
  reset(): void;
  getState(): any;
  restoreState(state: any): void;
}

/**
 * ClockPuzzleController
 * The Grandfather Clock puzzle in the Entrance Hall.
 * Alistair Vance's notes and the seized pocket watch point to the Hollow Hour: 3:33.
 * Aligning the hands to Hour 3 and Minute ~33 unlocks the brass secret compartment.
 */
export class ClockPuzzleController implements IPuzzleController {
  public readonly id = 'puzzle_grandfather_clock';
  public readonly name = 'The Hollow Hour Pendulum Clock';

  private hour: number = 12; // 1 to 12
  private minute: number = 0; // 0 to 59
  private solved: boolean = false;
  private hasHandInserted: boolean = false;

  private story: StoryManager;
  private inventory: InventorySystem;
  private notebook: NotebookSystem;

  constructor() {
    this.story = StoryManager.getInstance();
    this.inventory = InventorySystem.getInstance();
    this.notebook = NotebookSystem.getInstance();
  }

  public insertClockHand(): boolean {
    if (this.hasHandInserted) return true;

    if (this.inventory.hasItem('item_clock_hand')) {
      this.inventory.removeItem('item_clock_hand');
      this.hasHandInserted = true;
      return true;
    }
    return false;
  }

  public isHandInserted(): boolean {
    return this.hasHandInserted;
  }

  public setHandInserted(val: boolean): void {
    this.hasHandInserted = val;
  }

  public setTime(hour: number, minute: number): boolean {
    this.hour = Math.max(1, Math.min(12, hour));
    this.minute = (minute + 60) % 60;
    return this.checkSolution();
  }

  public rotateHour(steps: number): void {
    let newH = this.hour + steps;
    while (newH > 12) newH -= 12;
    while (newH < 1) newH += 12;
    this.hour = newH;
    this.checkSolution();
  }

  public rotateMinute(minutesDelta: number): void {
    this.minute = (this.minute + minutesDelta + 60) % 60;
    this.checkSolution();
  }

  public getTime(): { hour: number; minute: number } {
    return { hour: this.hour, minute: this.minute };
  }

  public checkSolution(): boolean {
    // Solved when hour is 3 and minute is between 30 and 36 (i.e. ~3:33)
    if (this.hour === 3 && Math.abs(this.minute - 33) <= 2) {
      return this.solve();
    }
    return false;
  }

  public isSolved(): boolean {
    return this.solved;
  }

  public solve(): boolean {
    if (this.solved) return true;

    this.solved = true;
    this.hour = 3;
    this.minute = 33;
    this.hasHandInserted = true;

    // Rewards & progression
    this.story.setFlag('clock_puzzle_solved', true);
    this.inventory.addItem('item_brass_key');
    this.notebook.addClue('clue_grandfather_clock');
    this.notebook.completeObjective('obj_solve_clock');

    return true;
  }

  public reset(): void {
    this.solved = false;
    this.hour = 12;
    this.minute = 0;
    this.hasHandInserted = false;
  }

  public getState(): any {
    return {
      hour: this.hour,
      minute: this.minute,
      solved: this.solved,
      hasHandInserted: this.hasHandInserted
    };
  }

  public restoreState(state: any): void {
    if (!state) return;
    this.hour = state.hour ?? 12;
    this.minute = state.minute ?? 0;
    this.solved = Boolean(state.solved);
    this.hasHandInserted = Boolean(state.hasHandInserted);
  }
}

/**
 * BookshelfPuzzleController
 * The Occult Library Bookcase.
 * Alistair hid a counterweighted revolving wall mechanism behind three specific occult volumes.
 * Target sequence: Book III (Compendium Lycanthropica), Book II (De Vermis Mysteriis), Book IV (The Hollow Hour).
 * Indices: [2, 1, 3].
 */
export class BookshelfPuzzleController implements IPuzzleController {
  public readonly id = 'puzzle_bookshelf';
  public readonly name = 'The Grimoire Sequence';

  private targetSequence: number[] = [2, 1, 3];
  private currentPulls: number[] = [];
  private solved: boolean = false;

  private story: StoryManager;
  private inventory: InventorySystem;
  private notebook: NotebookSystem;

  constructor() {
    this.story = StoryManager.getInstance();
    this.inventory = InventorySystem.getInstance();
    this.notebook = NotebookSystem.getInstance();
  }

  public pullBook(bookIndex: number): { success: boolean; solved: boolean; reset: boolean } {
    if (this.solved) {
      return { success: true, solved: true, reset: false };
    }

    const expectedIndex = this.targetSequence[this.currentPulls.length];
    if (bookIndex === expectedIndex) {
      this.currentPulls.push(bookIndex);
      if (this.currentPulls.length === this.targetSequence.length) {
        this.solve();
        return { success: true, solved: true, reset: false };
      }
      return { success: true, solved: false, reset: false };
    } else {
      // Sequence broken
      this.currentPulls = [];
      return { success: false, solved: false, reset: true };
    }
  }

  public getCurrentPulls(): number[] {
    return [...this.currentPulls];
  }

  public isSolved(): boolean {
    return this.solved;
  }

  public solve(): boolean {
    if (this.solved) return true;
    this.solved = true;
    this.currentPulls = [...this.targetSequence];

    // Progression & Rewards
    this.story.setFlag('bookshelf_puzzle_solved', true);
    if (!this.inventory.hasItem('item_silver_sigil')) {
      this.inventory.addItem('item_silver_sigil');
    }
    this.notebook.addClue('clue_hidden_compartment');
    return true;
  }

  public reset(): void {
    this.solved = false;
    this.currentPulls = [];
  }

  public getState(): any {
    return {
      solved: this.solved,
      currentPulls: this.currentPulls
    };
  }

  public restoreState(state: any): void {
    if (!state) return;
    this.solved = Boolean(state.solved);
    this.currentPulls = Array.isArray(state.currentPulls) ? state.currentPulls : [];
  }
}

/**
 * CCTVPuzzleController
 * Security Room surveillance monitor terminal with 5 camera feeds.
 * Camera 5 requires Surveillance Reel #3 (item_cctv_tape) to be inserted.
 * Reviewing the werewolf footage completes the investigation objective and logs the evidence.
 */
export class CCTVPuzzleController implements IPuzzleController {
  public readonly id = 'puzzle_cctv';
  public readonly name = 'Security Surveillance Console';

  private currentChannel: number = 1; // 1 to 5
  private tapeInserted: boolean = false;
  private reviewedWerewolf: boolean = false;

  private story: StoryManager;
  private inventory: InventorySystem;
  private notebook: NotebookSystem;

  constructor() {
    this.story = StoryManager.getInstance();
    this.inventory = InventorySystem.getInstance();
    this.notebook = NotebookSystem.getInstance();
  }

  public getChannel(): number {
    return this.currentChannel;
  }

  public setChannel(ch: number): { allowed: boolean; isTapeReel: boolean; discovered: boolean } {
    this.currentChannel = Math.max(1, Math.min(5, ch));

    if (this.currentChannel === 5) {
      if (!this.tapeInserted) {
        return { allowed: false, isTapeReel: true, discovered: false };
      }

      const justDiscovered = !this.reviewedWerewolf;
      if (justDiscovered) {
        this.solve();
      }
      return { allowed: true, isTapeReel: true, discovered: justDiscovered };
    }

    return { allowed: true, isTapeReel: false, discovered: false };
  }

  public isTapeInserted(): boolean {
    return this.tapeInserted;
  }

  public insertTape(): boolean {
    if (this.tapeInserted) return true;

    if (this.inventory.hasItem('item_cctv_tape')) {
      this.inventory.removeItem('item_cctv_tape');
      this.tapeInserted = true;
      this.story.setFlag('cctv_tape_inserted', true);
      return true;
    }
    return false;
  }

  public isSolved(): boolean {
    return this.reviewedWerewolf;
  }

  public solve(): boolean {
    this.reviewedWerewolf = true;
    this.tapeInserted = true;
    this.story.setFlag('cctv_footage_reviewed', true);
    this.story.setFlag('cctv_werewolf_discovered', true);
    this.notebook.addClue('clue_cctv_werewolf');
    this.notebook.completeObjective('obj_check_cctv');
    return true;
  }

  public reset(): void {
    this.currentChannel = 1;
    this.tapeInserted = false;
    this.reviewedWerewolf = false;
  }

  public getState(): any {
    return {
      currentChannel: this.currentChannel,
      tapeInserted: this.tapeInserted,
      reviewedWerewolf: this.reviewedWerewolf
    };
  }

  public restoreState(state: any): void {
    if (!state) return;
    this.currentChannel = state.currentChannel ?? 1;
    this.tapeInserted = Boolean(state.tapeInserted);
    this.reviewedWerewolf = Boolean(state.reviewedWerewolf);
  }
}

/**
 * OccultPuzzleController
 * Sub-Cellar Ritual Altar concentric stone rings.
 * Target alignment: Outer: 0 (Full Moon), Middle: 3 (Wolf Head), Inner: 4 (Chalice).
 */
export class OccultPuzzleController implements IPuzzleController {
  public readonly id = 'puzzle_occult_altar';
  public readonly name = 'Crypt Alchemical Sigil Altar';

  private ringPositions: [number, number, number] = [4, 7, 1]; // Outer, Middle, Inner (0-7)
  private activeRing: number = 0; // 0: Outer, 1: Middle, 2: Inner
  private solved: boolean = false;

  private story: StoryManager;
  private inventory: InventorySystem;
  private notebook: NotebookSystem;

  constructor() {
    this.story = StoryManager.getInstance();
    this.inventory = InventorySystem.getInstance();
    this.notebook = NotebookSystem.getInstance();
  }

  public getRingPositions(): [number, number, number] {
    return [...this.ringPositions];
  }

  public getActiveRing(): number {
    return this.activeRing;
  }

  public setActiveRing(ringIdx: number): void {
    this.activeRing = Math.max(0, Math.min(2, ringIdx));
  }

  public rotateActiveRing(delta: number): boolean {
    return this.rotateRing(this.activeRing, delta);
  }

  public rotateRing(ringIdx: number, delta: number): boolean {
    if (this.solved) return true;
    this.ringPositions[ringIdx] = (this.ringPositions[ringIdx] + delta + 8) % 8;
    return this.checkSolution();
  }

  public checkSolution(): boolean {
    if (this.ringPositions[0] === 0 && this.ringPositions[1] === 3 && this.ringPositions[2] === 4) {
      return this.solve();
    }
    return false;
  }

  public isSolved(): boolean {
    return this.solved;
  }

  public solve(): boolean {
    if (this.solved) return true;
    this.solved = true;
    this.ringPositions = [0, 3, 4];

    // Rewards & progression
    this.story.setFlag('occult_altar_solved', true);
    if (!this.inventory.hasItem('item_iron_key')) {
      this.inventory.addItem('item_iron_key');
    }
    this.notebook.addClue('clue_basement_altar');
    this.notebook.completeObjective('obj_occult_altar');
    return true;
  }

  public reset(): void {
    this.solved = false;
    this.ringPositions = [4, 7, 1];
    this.activeRing = 0;
  }

  public getState(): any {
    return {
      ringPositions: this.ringPositions,
      activeRing: this.activeRing,
      solved: this.solved
    };
  }

  public restoreState(state: any): void {
    if (!state) return;
    this.ringPositions = Array.isArray(state.ringPositions) && state.ringPositions.length === 3
      ? [state.ringPositions[0], state.ringPositions[1], state.ringPositions[2]]
      : [4, 7, 1];
    this.activeRing = state.activeRing ?? 0;
    this.solved = Boolean(state.solved);
  }
}

/**
 * PuzzleManager
 * Central registry of stateful puzzles.
 */
export class PuzzleManager {
  private static instance: PuzzleManager | null = null;
  private puzzles: Map<string, IPuzzleController> = new Map();

  private constructor() {
    this.register(new ClockPuzzleController());
    this.register(new BookshelfPuzzleController());
    this.register(new CCTVPuzzleController());
    this.register(new OccultPuzzleController());
  }

  public static getInstance(): PuzzleManager {
    if (!PuzzleManager.instance) {
      PuzzleManager.instance = new PuzzleManager();
    }
    return PuzzleManager.instance;
  }

  public static resetInstance(): void {
    PuzzleManager.instance = new PuzzleManager();
  }

  public register(puzzle: IPuzzleController): void {
    this.puzzles.set(puzzle.id, puzzle);
  }

  public getPuzzle<T extends IPuzzleController>(id: string): T | undefined {
    return this.puzzles.get(id) as T;
  }

  public getClockPuzzle(): ClockPuzzleController {
    return this.getPuzzle<ClockPuzzleController>('puzzle_grandfather_clock')!;
  }

  public getBookshelfPuzzle(): BookshelfPuzzleController {
    return this.getPuzzle<BookshelfPuzzleController>('puzzle_bookshelf')!;
  }

  public getCCTVPuzzle(): CCTVPuzzleController {
    return this.getPuzzle<CCTVPuzzleController>('puzzle_cctv')!;
  }

  public getOccultPuzzle(): OccultPuzzleController {
    return this.getPuzzle<OccultPuzzleController>('puzzle_occult_altar')!;
  }

  public isPuzzleSolved(id: string): boolean {
    return this.puzzles.get(id)?.isSolved() ?? false;
  }

  public serialize(): Record<string, any> {
    const data: Record<string, any> = {};
    this.puzzles.forEach((puzzle, id) => {
      data[id] = puzzle.getState();
    });
    return data;
  }

  public deserialize(data: Record<string, any>): void {
    if (!data) return;
    for (const [id, state] of Object.entries(data)) {
      const puzzle = this.puzzles.get(id);
      if (puzzle) {
        puzzle.restoreState(state);
      }
    }
  }
}
