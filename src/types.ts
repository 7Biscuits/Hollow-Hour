export interface GameSettings {
  masterVolume: number; // 0 to 1
  musicVolume: number;  // 0 to 1
  sfxVolume: number;    // 0 to 1
  fullscreen: boolean;
  crtFilter: boolean;
  displayMode: 'pixel-fit' | 'fill';
}

export type ItemCategory = 'key' | 'tool' | 'document' | 'curio' | 'consumable';

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  description: string;
  examineText: string;
  icon: string;
  canUse: boolean;
  targetId?: string; // e.g. door id or object id where it can be applied
  canCombineWith?: string[]; // IDs of compatible items
}

export type ClueCategory = 'mansion' | 'victim' | 'suspect' | 'occult';

export interface ClueEntry {
  id: string;
  title: string;
  category: ClueCategory;
  roomFound: string;
  description: string;
  discoveredAt: number; // timestamp
}

export type SuspectStatus = 'alive' | 'deceased' | 'ghost' | 'unknown';

export interface SuspectProfile {
  id: string;
  name: string;
  relation: string;
  portrait: string;
  status: SuspectStatus;
  bio: string;
  notes: string[];
}

export interface CaseObjective {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  chapter: string;
}

export type StoryChapter =
  | 'chapter_1_arrival'
  | 'chapter_2_first_murder'
  | 'chapter_3_cctv'
  | 'chapter_3_second_murder'
  | 'chapter_4_conspiracy'
  | 'chapter_4_second_murder'
  | 'chapter_5_experiment'
  | 'chapter_5_secret_lab'
  | 'chapter_6_werewolf_hunt'
  | 'chapter_7_ritual';

export interface DialogueChoice {
  text: string;
  targetNodeId: string;
  requiresFlag?: string;
  requiresItem?: string;
  requiresClue?: string;
  action?: {
    setFlag?: string;
    giveItemId?: string;
    addClueId?: string;
  };
}

export interface DialogueNode {
  id: string;
  speaker: string;
  speakerTitle?: string;
  portrait?: string;
  lines: string[];
  choices?: DialogueChoice[];
  nextId?: string; // If no choices, transitions to nextId or closes if undefined
  onNodeEnter?: {
    setFlag?: string;
    giveItemId?: string;
    addClueId?: string;
  };
}

export interface PuzzleState {
  id: string;
  solved: boolean;
  stateData?: Record<string, any>;
}

export interface SaveData {
  slot: number;
  chapter: string;
  location: string;
  timestamp: number;
  playtimeMinutes: number;
  health: number;
  inventoryCount: number;
  playerState?: {
    room: string;
    x: number;
    y: number;
    facing: 'up' | 'down' | 'left' | 'right';
  };
  inventory?: InventoryItem[];
  clues?: ClueEntry[];
  objectives?: CaseObjective[];
  suspects?: SuspectProfile[];
  storyFlags?: Record<string, any>;
  solvedPuzzles?: Record<string, boolean>;
  unlockedDoors?: string[];
  discoveredRooms?: string[];
}
