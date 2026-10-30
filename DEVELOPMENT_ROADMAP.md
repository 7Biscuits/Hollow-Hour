# THE HOLLOW HOUR — Development Roadmap

This roadmap tracks all development phases for **THE HOLLOW HOUR**, an atmospheric 2D pixel-art survival horror game inspired by *Lamentum*.

---

## Phase Status Summary

| Phase | Description | Status | Completion Date |
|---|---|---|---|
| **Phase 1** | Project Foundation & Architecture | **COMPLETED** | Oct 30, 2026 |
| **Phase 2** | Main Menu & Game UI | **COMPLETED** | Oct 30, 2026 |
| **Phase 3** | Player & Environment Foundation | **COMPLETED** | Oct 30, 2026 |
| **Phase 4** | Core Gameplay Systems | **COMPLETED** | Oct 30, 2026 |
| **Phase 5** | Investigation & Puzzle Gameplay | **COMPLETED** | Oct 30, 2026 |
| **Phase 6** | Characters, Ghosts & Dialogue | **COMPLETED** | Oct 30, 2026 |
| **Phase 7** | Werewolf AI & Horror Mechanics | **COMPLETED** | Oct 30, 2026 |
| **Phase 8** | Complete Story Implementation | **COMPLETED** | Oct 30, 2026 |
| **Phase 9** | Audio, Animation & Visual Polish | **COMPLETED** | Oct 30, 2026 |
| **Phase 10** | Testing & Deployment | **COMPLETED** | Oct 30, 2026 |

---

## Phase Details

### Phase 1 — Project Foundation
- [x] Configure Phaser with TypeScript and Vite.
- [x] Establish game configuration and rendering settings (WebGL with Canvas fallback).
- [x] Set base virtual resolution (640x360, 16:9) and pixel-art scaling (`pixelArt: true`, `roundPixels: true`).
- [x] Configure keyboard and mouse input handling.
- [x] Set up Arcade Physics with top-down zero gravity.
- [x] Create modular scene architecture (`BootScene`, `MenuScene`, `SettingsScene`, `CreditsScene`, `GameScene`).
- [x] Reusable scene and game-object conventions (`MenuButton`).
- [x] Automated testing infrastructure (Vitest + happy-dom unit tests + Puppeteer browser test suite).
- [x] Verify browser execution with zero console errors.

### Phase 2 — Main Menu and Game UI
- [x] Prominent gothic horror title: **THE HOLLOW HOUR** with atmospheric breathing glow.
- [x] Detailed pixel-art Victorian mansion background with lit mullioned windows.
- [x] Multi-layered parallax fog, drifting cloud wisps, and floating dust motes.
- [x] Menu options: New Game, Continue, Settings, Credits, Exit to Desktop.
- [x] Continue button dynamically disabled when no save exists, enabled when save data is present.
- [x] Gothic dagger selection cursor with smooth animations and audio feedback.
- [x] Gothic settings screen with Master, Music, SFX sliders, CRT scanline toggle, and fullscreen toggle.
- [x] Working persistence via `SaveManager` and `AudioManager` (`localStorage`).
- [x] Exit confirmation modal.
- [x] Gothic typography (`Cinzel Decorative`, `MedievalSharp`, `VT323`).

### Phase 3 — Player and Environment Foundation
- [x] Implement detective character entity with top-down 8-directional movement.
- [x] Detective walk and idle frame-by-frame animations (4-directional 16-bit sprite sheets).
- [x] Mansion room layouts (Entrance Hall, Main Hallway, Library, Bedroom, Security Room, Basement).
- [x] Split perimeter wall collisions with doorway gaps and room transition triggers.
- [x] Interactive object highlights and contextual inspection prompt (`[E] INSPECT`).
- [x] Flashlight cone following player facing direction and dynamic 2D lighting overlay with warm sconce/fireplace halos.
- [x] Gothic modal inspection dialog for clue observation.

### Phase 4 — Core Gameplay Systems
- [x] Comprehensive interaction system with object states and locked conditions.
- [x] Branching Dialogue system for NPCs, clues, and ghosts with portrait support.
- [x] Grid/slot Inventory system with item examination, usage, and combination.
- [x] Evidence collection system and Detective Case Notebook (clues, suspects, map, objectives).
- [x] Story progression state manager (event flags, murder stages, timeline tracking).
- [x] Puzzle management foundation (reusable stateful puzzle controllers).
- [x] Enhanced Save & Load serialization for full world state.
- [x] Ambient audio & sound effects integration across systems.
- [x] Detective notebook and evidence tracking.
- [x] Story progression flags and state management.

### Phase 5 — Investigation and Puzzle Gameplay
- [x] Grandfather clock puzzle (The Hollow Hour 3:33 arbor manipulation dispensing Brass Key).
- [x] CCTV security surveillance console with 5 switchable cameras, scanlines, and CRT bezel.
- [x] CCTV magnetic tape drive (Surveillance Reel #3 insertion displaying werewolf containment breach).
- [x] Occult library bookshelf puzzle with grimoire pull sequence.
- [x] Dynamic hidden passage discovery connecting Library directly to Sub-Cellar crypt.
- [x] Sub-Cellar ritual altar concentric dial puzzle with rotating celestial rings dispensing Wrought Iron Key.
- [x] Seamless connection of puzzle solutions to story flags, inventory items, and detective notebook evidence.

### Phase 6 — Characters, Ghosts and Dialogue
- [x] Living family members & physician entities (Victoria Vance, Edward Vance, Dr. Robert Hayes).
- [x] Story-driven murder progression triggers (Edward savaged in Library, Victoria slain in Bedroom, Hayes slain at Altar).
- [x] Dynamic ghost appearances replacing deceased characters with floating ethereal hover, cyan/violet light halos, and soul mist.
- [x] Blood pool crime decals (`blood_pool_decal`) marking tragedy scenes.
- [x] Branching character dialogues and spectral revelations with portraits.
- [x] Synthesis of spectral ghost chimes and dissonant horror chords via Web Audio API.
- [x] Automatic notebook suspect profile status synchronization (`status: 'deceased'`).

### Phase 7 — Werewolf AI and Horror Mechanics
- [x] Werewolf 16-bit sprite sheet and 8 directional animations (`werewolf_sheet`, idle and walk in 4 directions).
- [x] State-based AI architecture (`dormant`, `patrol`, `investigate`, `detected`, `chase`, `attack`, `search`).
- [x] Multi-sensory perception: vision cone with wall raycast obstruction, running footstep hearing (150px vs 45px), and flashlight detection.
- [x] Floating state indicators (crimson exclamation mark for alert/chase, searching eye for losing line of sight).
- [x] Interactive Victorian Carved Mahogany Wardrobes in Hallway, Library, and Bedroom (`[E] HIDE IN WARDROBE`).
- [x] Full hiding immunity from beast perception, accompanied by rhythmic heartbeat audio pulse.
- [x] Detective Vitality HUD (`VITALITY: 100%`), melee attack lacerations dealing 25 damage, camera shake, and reactive blood vignette.
- [x] Medicinal Laudanum item usage from inventory to heal vitality (+40 HP).
- [x] Audio synthesizers: `playWerewolfGrowl()`, `playWerewolfHowl()`, `playHeartbeat()`, `playDamageLaceration()`.

### Phase 8 — Complete Story Implementation
- [x] Complete 10-minute chronological investigation narrative arc spanning Chapters 1 through 7.
- [x] Climax showdown at 3:33 AM in the Sub-Cellar Ritual Crypt.
- [x] `ClimaxChoiceModal` (`THE HOLLOW HOUR — 3:33 AM`) offering 3 distinct branching narrative choices.
- [x] Three fully realized narrative endings with custom 16-bit pixel art illustration cards (`EndingScene.ts`, `PixelArtGenerator.ts`):
  - **Ending A — The Severed Curse** (`ending_dawn`): Exorcism at dawn, liberating the family spirits.
  - **Ending B — The Hollow Heir** (`ending_beast`): Dark transference, Detective Graves claims the eternal beast.
  - **Ending C — Ash and Memory** (`ending_fire`): Tragic immolation, burning Blackwood Manor to smoldering ash.
- [x] Case Summary statistics (Clues solved, Objectives completed, Verdict).
- [x] Smooth scene transitions and return to Main Menu / Credits.

### Phase 9 — Audio, Animation and Visual Polish
- [x] Atmospheric horror soundscapes synthesized with Web Audio API (`playClockTick`, `playFloorboardCreak`, `playWaterDrip`, `playThunder`).
- [x] Room-specific acoustic properties (Entrance Hall pendulum ticking, wood floor creaks when running in Hallway/Library/Bedroom, subterranean water drips in crypt).
- [x] Floating illuminated dust motes particle simulation (`particle_dust`) drift across all mansion rooms.
- [x] Dynamic ambient sheet lightning flashes with camera shakes and delayed thunder rumbles.
- [x] Polished room transitions, CRT filter shaders, and responsive UI scaling.

### Phase 10 — Testing and Deployment
- [x] End-to-end full game completion test suite (`scripts/test_phase10_full_game_e2e.js`) covering full investigation from Prologue to Ending and return to Menu.
- [x] 13 Vitest test suites (78 unit tests passing cleanly).
- [x] 0 TypeScript compilation errors (`npx tsc --noEmit`).
- [x] Optimized production build (`npm run build`) ready for web distribution.
