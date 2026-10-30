# THE HOLLOW HOUR — Gothic 2D Pixel-Art Survival Horror

An atmospheric, browser-native 2D pixel-art gothic survival horror game inspired by **Lamentum**, **Silent Hill**, and classic survival horror titles. Built in **Phaser 3**, **TypeScript**, and **Vite**.

---

## 🕯️ Game Premise

October 30th, 1892. The iron gates of Blackwood Manor groan shut behind Detective Graves. Lord Alistair Blackthorn, terminally ill, sought biological immortality through radical lycanthropic metempsychosis. As midnight deepens and the **Hollow Hour (3:33 AM)** strikes, an apex predator breaks out of the sub-cellar laboratory. 

Solve intricate Victorian mechanical puzzles, survive the stalking beast in dark corridors, commune with spectral family apparitions, and decide the fate of Blackwood Manor across three branching narrative endings.

---

## 🎮 Key Features

- **16-Bit Victorian Gothic Pixel Art**:
  - Handcrafted procedural pixel art adhering to the *Lamentum* color palette: charcoal blacks, muted burgundy, desaturated greens, and warm candlelight.
  - Multi-room mansion: Entrance Hall, Main Corridor, Library Archives, Master Suite, Security Surveillance Room, and Sub-Cellar Ritual Crypt.
  - Dynamic 2D lighting: real-time darkness overlay with a 135px directional flashlight cone that rotates with the player and warm glowing wall sconces.

- **Classic Survival Horror Systems**:
  - **Grid Inventory (`[TAB]` / `[I]`)**: 10-slot pocket system with item examination, combination, and contextual world usage.
  - **Detective Case Notebook (`[N]` / `[J]`)**: Clue catalog, dynamic Suspect profiles with living/deceased/spectral statuses, live Case Objectives, and mansion floor plan map.
  - **Interactive Puzzles**:
    - *Antique Grandfather Clock*: Manipulate hour and minute arbors to align with the stopped Hollow Hour (3:33) to release the Tarnished Brass Key.
    - *CCTV Security Console*: 5-channel cathode-ray monitor array with scanlines and magnetic tape drive displaying werewolf containment breach.
    - *Occult Grimoire Bookcase*: Pull three grimoires in sequence to slide open a hidden subterranean passageway.
    - *Concentric Obsidian Altar*: Rotate three celestial discs (Full Moon, Wolf Sigil, Blood Chalice) to reveal the Ceremonial Athame.

- **Werewolf AI & Stealth Survival**:
  - 7-state finite state machine: `dormant`, `patrol`, `investigate`, `detected`, `chase`, `attack`, `search`.
  - Multi-sensory perception: 135px 80° vision cone with raycasting against walls, plus footstep hearing vibrations (sprinting alerts from 150px away).
  - Victorian mahogany wardrobes (`[E] HIDE`) providing full concealment from the beast with a tension-building heartbeat pulse audio loop.
  - Vitality HUD bar with damage screen shake, lacerations, and reactive blood vignette overlay.

- **Three Branching Endings (`EndingScene.ts`)**:
  - **Ending A — The Severed Curse** (*Canon Exorcism*): Plunge the Ceremonial Athame through the Silver Sigil into the lunar nexus at 3:33 AM, severing Alistair's tether and releasing the spirits at dawn.
  - **Ending B — The Hollow Heir** (*Dark Transference*): Slice your palm over the circle, merging your soul with the predatory beast to inherit eternal night.
  - **Ending C — Ash and Memory** (*Tragic Immolation*): Shatter the oil lantern into the subterranean chemical vats, burning Blackwood Manor and the beast to ash.

- **Procedural Web Audio Engine**:
  - Synthesized ambient horror drones, grandfather clock pendulum ticks, creaking wood floorboards when sprinting, echoing water drips, beast growls, and howls.

---

## 🕹️ Controls

| Action | Primary Key | Secondary Key |
|---|---|---|
| **Move Detective** | `W` / `A` / `S` / `D` | Arrow Keys |
| **Sprint / Run** | Hold `Shift` | — |
| **Interact / Inspect / Talk** | `E` | `Space` / Click |
| **Open Inventory (Pockets)** | `Tab` | `I` |
| **Examine Item** | `Enter` / `E` | Click slot |
| **Use Item** | `U` | Click Use |
| **Combine Item** | `C` | — |
| **Detective Case Notebook** | `N` | `J` |
| **Hide in Wardrobe / Step Out** | `E` | `Space` |
| **Pause / Return / Back** | `Esc` | — |

---

## 🏛️ Project Architecture

```
src/
├── audio/
│   └── AudioManager.ts           # Procedural Web Audio synthesizers & volume persistence
├── config.ts                     # Phaser 3 640x360 virtual resolution & scale settings
├── data/
│   ├── DialogueCatalog.ts        # Branching narrative dialogue trees & ghost portraits
│   ├── ItemCatalog.ts            # Consumable, key, tool & curio item definitions
│   ├── NotebookCatalog.ts        # Case clues, objectives, suspects & mansion rooms
│   └── SaveManager.ts            # Persistent save game state serialization
├── entities/
│   ├── Detective.ts              # Top-down player entity with walking/sprinting & vitality
│   ├── InteractiveObject.ts      # World objects, hiding wardrobes, doors & puzzle triggers
│   ├── NPC.ts                    # Living characters and floating spectral apparitions
│   └── Werewolf.ts               # State-based predatory AI with vision/hearing perception
├── main.ts                       # Entry point and global keyboard/audio binding
├── scenes/
│   ├── BootScene.ts              # Registers procedural pixel-art textures and animations
│   ├── CreditsScene.ts           # Attribution & survival horror tributes
│   ├── EndingScene.ts            # Narrative epilogue screens with custom ending illustrations
│   ├── GameScene.ts              # Core exploration, lighting, entity updates & climax
│   ├── MenuScene.ts              # Atmospheric gothic main menu & options
│   └── SettingsScene.ts          # Volume sliders, CRT filter toggle, and display settings
├── systems/
│   ├── DialogueSystem.ts         # Branching dialogue state machine
│   ├── InventorySystem.ts        # 10-slot grid inventory, combination & usage
│   ├── NotebookSystem.ts         # Clues, suspect profiles, case objectives & map
│   ├── PuzzleSystem.ts           # Clock, CCTV, Bookcase & Occult Altar controllers
│   └── StoryManager.ts           # Event flags, murder progression & chapter tracking
├── types.ts                      # Core TypeScript interfaces & story chapter types
├── ui/
│   ├── BookshelfPuzzleModal.ts   # Grimoire bookcase sequence interface
│   ├── CCTVModal.ts              # Surveillance console with 5 feeds & reel playback
│   ├── ClimaxChoiceModal.ts      # 3:33 AM fate choice modal in crypt
│   ├── ClockPuzzleModal.ts       # Grandfather clock hour/minute hand manipulation
│   ├── DialogueUI.ts             # Character dialogue box with portraits
│   ├── InteractionUI.ts          # Floating prompt pill & inspection modal
│   ├── InventoryUI.ts            # 10-slot inventory modal
│   ├── MenuButton.ts             # Gothic dagger button component
│   ├── NotebookUI.ts             # Case notebook with 4 switchable tabs
│   └── OccultPuzzleModal.ts      # Concentric rotating stone discs interface
├── utils/
│   └── PixelArtGenerator.ts      # 3,100+ lines of procedural 16-bit Victorian pixel art
└── world/
    ├── CharacterManager.ts       # Character spawning, murders & ghost replacements
    ├── LightingSystem.ts         # Dynamic 2D darkness overlay & flashlight cone
    ├── MansionData.ts            # 6 Victorian room layouts, colliders & objects
    └── RoomManager.ts            # Room rendering, doorway colliders & transitions
```

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Run development server (Vite on port 3000)
npm run dev

# 3. Run all Vitest unit test suites (78 tests)
npm test

# 4. Check TypeScript types
npx tsc --noEmit

# 5. Build for production distribution
npm run build

# 6. Preview production build
npm run preview
```

---

## 🧪 Automated Browser Test Suites

The project includes automated browser test suites using Puppeteer with zero console errors:

```bash
# Phase 3: Player movement, lighting, inspection
node scripts/test_phase3_exploration.js

# Phase 4: Inventory, notebook, clock puzzle
node scripts/test_phase4_systems.js

# Phase 5: CCTV surveillance, bookcase passage, occult altar
node scripts/test_phase5_investigation.js

# Phase 6: Character dialogue, murders, spectral ghosts
node scripts/test_phase6_narrative.js

# Phase 7: Werewolf AI, wardrobe hiding, damage & healing
node scripts/test_phase7_werewolf.js

# Phase 8: Climax confrontation and 3 branching endings
node scripts/test_phase8_story_endings.js

# Phase 9: Audio synthesizers, dust motes & lightning
node scripts/test_phase9_polish.js

# Phase 10: Full end-to-end game playthrough from start to finish
node scripts/test_phase10_full_game_e2e.js
```
