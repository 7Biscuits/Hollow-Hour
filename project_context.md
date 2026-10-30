# PROJECT CONTEXT: THE HOLLOW HOUR

You are working on a 2D browser-based survival horror game titled **THE HOLLOW HOUR**. This document establishes the game's vision, narrative, visual identity, technical stack and development principles. Treat it as the foundational reference for all future development tasks.

## 1. Game Overview

**Title:** The Hollow Hour

**Genre:** 2D Pixel-Art Survival Horror / Mystery / Detective Adventure

**Platform:** Web browser (desktop-first)

**Perspective:** Top-down 2D with a slight three-quarter visual feel.

**Expected gameplay duration:** Approximately 10 minutes.

The game revolves around a detective investigating a mysterious death at an isolated Victorian mansion. As the investigation progresses, the detective uncovers a supernatural conspiracy involving a werewolf, the deceased mansion owner and the ghosts of murdered family members.

The gameplay combines:
- Mansion exploration.
- Detective-style investigation.
- Environmental storytelling.
- Puzzle solving.
- Ghost interactions and dialogue.
- Security camera surveillance.
- Werewolf encounters and chase sequences.
- A final confrontation with multiple possible endings.

## 2. Story and Narrative Context

The story takes place in an isolated Victorian mansion belonging to the Blackthorn family.

Lord Alistair Blackthorn supposedly died three days before the detective arrives. His death was initially believed to be natural, but several inconsistencies prompt an investigation.

Unknown to the detective, Alistair's consciousness was transferred into a werewolf through an occult ritual. His wife Margaret helped him perform the experiment in an attempt to preserve his existence.

The ritual succeeded partially. Alistair's consciousness now inhabits the werewolf, but his human memories are gradually disappearing.

The werewolf has returned to the mansion and is hunting the remaining family members. It kills them to recover fragments of their memories and regain its former identity.

The detective arrives to investigate Alistair's death without knowing anything about the supernatural events.

**Important narrative rules:**
- The detective must initially believe this is an ordinary investigation.
- The detective does not initially know about the werewolf or the consciousness-transfer experiment.
- The werewolf's identity as Alistair should be gradually revealed through evidence, surveillance footage and conversations.
- A family member's ghost only appears after that character has been killed.
- Ghosts provide information that helps the detective reconstruct the events.
- The werewolf should remain a recurring threat throughout the game.
- The detective eventually becomes affected by the supernatural events, leading to the final confrontation and multiple possible endings.

Maintain narrative consistency whenever introducing new characters, events, dialogue or gameplay mechanics.

## 3. Visual Design and Art Direction

The game's primary visual inspiration is **Lamentum**, particularly its gothic pixel-art environments and atmospheric survival-horror presentation.

The game should look like a professionally developed indie pixel-art horror adventure.

**Visual characteristics:**
- Detailed pixel-art environments.
- Gothic Victorian architecture.
- Old wooden furniture, dusty libraries, antique clocks and candlelit rooms.
- Dark corridors, abandoned bedrooms and underground laboratories.
- Muted and desaturated colour palettes.
- Deep shadows and carefully controlled lighting.
- Subtle fog, dust particles and environmental animations.
- Detailed character sprites and frame-by-frame animations.

**Colour palette:**
- Charcoal black.
- Dark brown.
- Desaturated green.
- Faded grey.
- Deep burgundy.
- Muted beige.
- Occasional dark red accents.

**Atmosphere:**

The game should feel unsettling, isolated and mysterious. Horror should emerge through environmental storytelling, lighting, sound design, creature encounters and suspense rather than relying entirely on jump scares.

Avoid:
- Cartoonish character designs.
- Bright, saturated environments.
- Generic fantasy aesthetics.
- Smooth vector graphics.
- Inconsistent pixel-art styles.
- Unnecessary visual clutter.

Maintain consistent pixel density, sprite proportions, tile dimensions and lighting across the entire game.

## 4. Technical Stack (Mandatory)

The game is a browser-native 2D game.

Use the following technologies:

| Component | Technology |
|---|---|
| Game framework | Phaser |
| Programming language | TypeScript |
| Build tool | Vite |
| Rendering | WebGL with Canvas fallback |
| Physics | Phaser Arcade Physics |
| Level design | Tiled Map Editor |
| Animation | Phaser Animation System |
| Pixel art | Aseprite / Pixelorama |
| Image editing | Krita |
| Audio | Phaser Audio System |
| Testing | Vitest + Playwright |
| Version control | Git + GitHub |
| Deployment | Vercel / Cloudflare Pages |

Do not use Godot, Unity or another game engine.

Do not introduce React or another frontend framework unless a specific requirement genuinely justifies it. Phaser should handle the actual game rendering and gameplay.

All gameplay logic should be written in TypeScript.

## 5. Planned Gameplay Systems

The game will eventually contain the following independent systems:

**Player System**
- Detective movement.
- Directional animations.
- Environmental interactions.
- Object inspection.

**Werewolf AI**
- Patrol behaviour.
- Investigation of sounds and disturbances.
- Player detection.
- Chase behaviour.
- Attack behaviour.
- State-based AI.

**Dialogue System**
- Conversations with living characters.
- Ghost interactions.
- Dialogue choices.
- Story progression triggers.

**Investigation System**
- Evidence collection.
- Clue inspection.
- Detective notebook.
- Connecting clues and reconstructing events.

**CCTV System**
- Multiple surveillance cameras positioned throughout the mansion.
- Switchable camera feeds.
- Surveillance footage and recorded events.
- Tracking the werewolf's movements.
- Using surveillance information to solve puzzles.

**Puzzle System**
- Environmental puzzles.
- Clock-based puzzles.
- Evidence-based deductions.
- Symbol combinations.
- Final ritual mechanism.

**Inventory System**
- Collectible items.
- Keys and important objects.
- Evidence management.
- Item inspection.

**World System**
- Multiple connected mansion rooms.
- Doors and locked areas.
- Collision detection.
- Interactive furniture and objects.
- Environmental effects.

**Audio System**
- Background ambience.
- Footsteps.
- Creaking doors.
- Distant sounds.
- Werewolf audio cues.
- Dialogue and interaction sounds.

**UI System**
- Main menu.
- Pause menu.
- Inventory.
- Detective notebook.
- Dialogue interface.
- CCTV interface.
- Settings.
- Ending screens.

## 6. Development Architecture

The project must be modular and maintainable.

Follow these principles:

- Use Phaser scenes for distinct game screens and environments.
- Use reusable TypeScript classes for entities and gameplay systems.
- Use event-driven communication where appropriate.
- Keep game state separate from presentation.
- Use state machines for complex character and enemy behaviour.
- Keep dialogue, puzzle definitions and other content data-driven where practical.
- Avoid tightly coupling unrelated systems.
- Keep asset files organized by category.
- Use strong TypeScript typing.
- Write reusable components instead of duplicating logic.

Avoid placing all gameplay functionality inside one large scene or one giant TypeScript file.

## 7. AI-Agent Development Guidelines

This project will primarily be developed using AI coding agents such as Codex and Antigravity.

Consequently, maintain an architecture that is easy for AI agents to understand, navigate, modify and test.

Follow these rules:

1. Inspect the existing repository before making changes.
2. Preserve existing architecture and working implementations.
3. Never reinitialize or regenerate the entire project unnecessarily.
4. Make incremental, focused modifications.
5. Read only the files relevant to the assigned task unless broader inspection is necessary.
6. Do not independently rewrite shared systems without understanding their dependencies.
7. Avoid unnecessary dependencies and overengineering.
8. Test implementations in the actual browser.
9. Fix existing errors before introducing additional complexity.
10. Keep documentation updated when architecture or shared interfaces change.

The codebase should remain understandable and predictable even when multiple AI agents work on different subsystems.

## 8. Overall Quality Expectations

The final game should feel like a cohesive, polished indie horror experience rather than a collection of disconnected mechanics.

Prioritize:
- Consistent art direction.
- Atmospheric environments.
- Smooth player movement.
- Responsive controls.
- Meaningful exploration.
- Coherent storytelling.
- Functional puzzles.
- Intelligent enemy behaviour.
- Seamless transitions between scenes.
- Reliable browser performance.

The visual quality and atmosphere are just as important as the underlying gameplay functionality.

## 9. Core Development Principle

**Build a cohesive gothic survival-horror experience, not merely a functional collection of game mechanics.**

Every new feature, asset, interface, animation and gameplay system must fit the established identity of THE HOLLOW HOUR.

Use this document as the project's persistent design and technical reference for all future implementation tasks.