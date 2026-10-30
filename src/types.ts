export interface GameSettings {
  masterVolume: number; // 0 to 1
  musicVolume: number;  // 0 to 1
  sfxVolume: number;    // 0 to 1
  fullscreen: boolean;
  crtFilter: boolean;
  displayMode: 'pixel-fit' | 'fill';
}

export interface SaveData {
  slot: number;
  chapter: string;
  location: string;
  timestamp: number;
  playtimeMinutes: number;
  health: number;
  inventoryCount: number;
}
