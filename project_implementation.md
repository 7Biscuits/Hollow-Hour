# TASK: Implement THE HOLLOW HOUR — Phase-Wise Game Development

You are the lead game developer responsible for implementing **THE HOLLOW HOUR**, a 2D browser-based pixel-art survival horror game.

Refer to `PROJECT_CONTEXT.md` for the complete story, visual direction, technical stack, gameplay requirements and architectural guidelines.

Your task is to develop the game through clearly defined phases. Do not attempt to implement the entire game in one pass.

The game takes inspiration from Lamentum, particularly its gothic horror atmosphere, detailed pixel-art environments, dark mansion interiors and survival-horror presentation.

## DEVELOPMENT RULES

Before starting:

1. Inspect the existing repository and understand its current implementation.
2. Read `PROJECT_CONTEXT.md` thoroughly.
3. Identify existing dependencies, scenes, assets and systems.
4. Create a `DEVELOPMENT_ROADMAP.md` documenting all phases and their completion status.
5. Create or update `ARCHITECTURE.md` to document the project structure and important system relationships.
6. Establish a consistent resolution, pixel-art scaling strategy, input system and asset conventions.

**Mandatory technology stack:**
- Phaser
- TypeScript
- Vite
- Phaser Arcade Physics
- Tiled Map Editor
- Aseprite / Pixelorama assets
- Vitest
- Playwright
- Git

Do not introduce another game engine or unnecessary frameworks.

---

# PHASE 1 — Project Foundation

**Objective:** Establish a working browser-based game project.

Tasks:
- Configure Phaser with TypeScript and Vite.
- Establish the game configuration and rendering settings.
- Set the base resolution and pixel-art scaling.
- Configure keyboard and mouse input.
- Create the initial scene architecture.
- Create reusable scene and game-object conventions.
- Configure asset loading and error handling.
- Set up the initial project directory structure.
- Add basic automated testing infrastructure.

**Expected result:** A browser-playable project with a working loading screen and basic game scene.

**Completion criteria:** The game launches successfully in Chrome without console errors.

# PHASE 2 — Main Menu and Game UI

**Objective:** Establish the game's visual identity.

Tasks:
- Implement the main menu.
- Add the title THE HOLLOW HOUR.
- Create atmospheric mansion artwork for the background.
- Add New Game, Continue, Settings and Credits.
- Implement menu navigation and interaction animations.
- Add volume settings and fullscreen functionality.
- Implement pause menu foundations.
- Establish consistent typography, colours and UI styling.

**Expected result:** A polished main menu that feels like a professional gothic pixel-art horror game.

# PHASE 3 — Player and Environment Foundation

**Objective:** Create the core exploration experience.

Tasks:
- Implement the detective character.
- Add directional movement and animations.
- Implement collision detection.
- Create reusable interactive objects.
- Implement doors and room transitions.
- Integrate the mansion tileset.
- Build the initial mansion rooms:
  - Entrance hall.
  - Main hallway.
  - Library.
  - Bedroom.
  - Security room.
  - Basement.
- Add atmospheric lighting and environmental effects.

**Expected result:** The detective can explore interconnected mansion rooms and interact with objects.

# PHASE 4 — Core Gameplay Systems

**Objective:** Implement reusable systems that support the entire game.

Tasks:
- Interaction system.
- Dialogue system.
- Inventory system.
- Evidence collection.
- Detective notebook.
- Story progression manager.
- Puzzle management system.
- Save and load system.
- Audio manager.

Make these systems modular and reusable.

Use data-driven dialogue and puzzle definitions wherever practical.

**Expected result:** A functional gameplay foundation that supports the investigation.

# PHASE 5 — Investigation and Puzzle Gameplay

**Objective:** Implement the detective experience.

Tasks:
- Add inspectable objects and environmental clues.
- Implement the grandfather clock puzzle.
- Add evidence collection and notebook entries.
- Implement CCTV camera feeds.
- Allow switching between surveillance cameras.
- Add recordings and surveillance evidence.
- Implement the hidden passage discovery.
- Add occult symbol puzzles.
- Connect puzzle completion to story progression.

**Expected result:** The player can investigate the mansion, collect evidence and solve puzzles to unlock new areas.

# PHASE 6 — Characters, Ghosts and Dialogue

**Objective:** Implement the narrative interaction systems.

Tasks:
- Implement living family members.
- Create character-specific dialogue.
- Implement ghost appearances triggered by character deaths.
- Add ghost interaction and conversation sequences.
- Connect dialogue choices to evidence and story flags.
- Ensure characters appear and disappear according to story progression.
- Integrate character animations and audio.

**Expected result:** Characters and ghosts interact with the player in a narrative-consistent manner.

# PHASE 7 — Werewolf AI and Horror Mechanics

**Objective:** Implement the main antagonist and survival mechanics.

Tasks:
- Create the werewolf character and animations.
- Implement a state-based AI architecture.
- Add patrol behaviour.
- Add investigation behaviour.
- Add player detection.
- Add chase and attack behaviour.
- Implement scripted encounters.
- Add environmental sound cues.
- Integrate the werewolf into CCTV footage.
- Add hiding and escape mechanics.
- Implement chase sequences.

The werewolf should feel like a persistent threat rather than an enemy that simply appears at predetermined locations.

**Expected result:** A functional werewolf AI system with multiple behaviours and scripted story encounters.

# PHASE 8 — Complete Story Implementation

**Objective:** Connect all systems into the complete 10-minute experience.

Implement the narrative in chronological order:

1. Detective arrives at the mansion.
2. Initial investigation of Alistair's death.
3. First family member is murdered.
4. Their ghost appears and provides information.
5. Detective investigates CCTV footage.
6. Second family member is murdered.
7. Their ghost reveals further information.
8. Detective discovers the hidden laboratory.
9. The consciousness-transfer experiment is revealed.
10. Werewolf hunts the detective.
11. Detective discovers the connection between Alistair and the werewolf.
12. Final encounter and ritual mechanism.
13. Multiple possible endings.

Ensure that story events, dialogue, evidence, deaths and room transitions are connected through the game-state system.

**Expected result:** A complete playable narrative from beginning to end.

# PHASE 9 — Audio, Animation and Visual Polish

**Objective:** Improve the overall presentation.

Tasks:
- Refine character animations.
- Improve werewolf animations.
- Add ghost visual effects.
- Improve lighting and shadows.
- Add fog, particles and environmental movement.
- Integrate ambient background music.
- Add footsteps, creaking doors and creature sounds.
- Improve transitions and cutscenes.
- Polish all UI elements.
- Maintain visual consistency across every room.

**Expected result:** A cohesive and atmospheric survival-horror experience.

# PHASE 10 — Testing and Deployment

**Objective:** Prepare the game for public browser access.

Tasks:
- Test all gameplay systems.
- Test all puzzles and story progression paths.
- Verify that no dialogue or story triggers become inaccessible.
- Test both endings.
- Test keyboard and mouse controls.
- Test browser scaling and different screen resolutions.
- Optimize rendering and asset loading.
- Identify memory leaks and performance issues.
- Run automated tests.
- Use Playwright for end-to-end browser testing.
- Fix all critical bugs.
- Prepare the production build.
- Deploy the game to Vercel or Cloudflare Pages.

**Expected result:** A fully playable, stable browser game accessible through a public URL.

---

# EXECUTION STRATEGY

Follow these instructions throughout development:

### 1. Implement one phase at a time

Do not begin implementing all ten phases simultaneously.

Start with Phase 1. Once it is complete, test it and report the results before proceeding.

### 2. Each phase must be independently testable

At the end of every phase:
- Run the project.
- Test the newly implemented functionality.
- Fix errors.
- Verify that existing functionality still works.
- Update the development roadmap.
- Document important architectural decisions.

### 3. Maintain existing implementations

Never regenerate the entire project simply because a new feature is being introduced.

Inspect existing files, reuse existing components and make focused modifications.

### 4. Asset quality matters

Do not fill the game with unrelated placeholder images, emoji or generic stock graphics.

If final artwork is unavailable, use clearly identified temporary assets that follow the established pixel-art dimensions, palette and style.

Keep all asset references organized so replacements do not require rewriting gameplay code.

### 5. Maintain documentation

Keep the following files updated:

- `PROJECT_CONTEXT.md`
- `DEVELOPMENT_ROADMAP.md`
- `ARCHITECTURE.md`
- `ASSET_MANIFEST.md`
- `PROGRESS.md`

### 6. Phase completion report

After completing each phase, provide:

- Features implemented.
- Files created or modified.
- Technical decisions made.
- Tests performed and their results.
- Known issues.
- Remaining tasks.
- Confirmation that the game still runs.

Do not mark a phase complete if its completion criteria have not been met.

---

# FIRST ACTION

Start with **Phase 1 — Project Foundation**.

Inspect the existing repository, understand its current state and implement Phase 1 only.

Do not start Phase 2 until Phase 1 has been successfully implemented and verified.

Prioritize clean architecture, browser compatibility, maintainability and compatibility with AI-assisted development throughout the project.