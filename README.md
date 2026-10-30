# THE HOLLOW HOUR — Gothic Survival Horror Main Menu

An atmospheric, visually polished main menu for the 2D pixel-art gothic survival horror game **THE HOLLOW HOUR**, inspired by **Lamentum** and classic survival horror games.

---

## Features

- **Victorian Gothic Pixel Art**:
  - Multi-tiered Victorian mansion with gabled spires, chimneys, mullioned gothic windows, and mansard slate roofs.
  - Dark overcast night sky with a veiled pale moon and slow-drifting cloud wisps.
  - Bare gnarled dead trees framing the estate, wrought iron spear-top gates, lanterns, and weathered gravestones.
  - Wet cobblestone pathway with subtle ambient illumination.
  - Volumetric, multi-layered parallax fog drifting across the estate.
  - Floating dust spores, embers, and random distant sheet-lightning flashes accompanied by low thunder.
  - Consistent pixel scaling with crisp, unblurred pixel rendering (`pixelArt: true`, `roundPixels: true`).

- **Interactive Main Menu**:
  - Prominent gothic horror title: **THE HOLLOW HOUR** with breathing glow and subtitle.
  - Menu options with gothic dagger cursor and wine-red backlight glow:
    1. **NEW GAME**: Transitions into the prologue chapter scene.
    2. **CONTINUE**: Dynamically disabled if no save game exists; enabled when save data is detected.
    3. **SETTINGS**: Volume sliders, CRT filter toggle, and fullscreen mode.
    4. **CREDITS**: Gothic attribution and tributes to Lamentum and survival horror classics.
    5. **EXIT TO DESKTOP**: Gothic confirmation modal.
  - Full keyboard navigation (`W`/`S` or `↑`/`↓` to navigate, `Enter`/`Space` to select, `Esc` to go back) and mouse hover/click support.

- **Atmospheric Procedural Audio**:
  - Low, oppressive sub-bass horror drone (diminished intervals, slow modulated low-pass filter).
  - Wind hiss and subtle ambient resonance.
  - Periodic eerie clock chimes echoing in the distance.
  - Procedurally generated UI sound effects:
    - *Hover*: Eerie hollow click.
    - *Select*: Resonant gothic brass/iron chime.
    - *Disabled*: Muted dull thud.
    - *Back*: Soft wooden release.
    - *Thunder*: Deep sub rumble with filtered noise.

- **Gothic Settings & Persistence**:
  - Master, Music, and SFX volume sliders (0–100%).
  - CRT scanline / chromatic aberration overlay toggle.
  - Fullscreen display toggle.
  - Built-in test save data toggling for testing the Continue button.
  - Settings and saves persisted in `localStorage`.

---

## Architecture

```
src/
├── audio/
│   └── AudioManager.ts       # Web Audio horror soundscape & SFX manager
├── data/
│   └── SaveManager.ts        # Save slot detection & management
├── scenes/
│   ├── BootScene.ts          # Generates procedural pixel textures & sets animations
│   ├── MenuScene.ts          # Main menu scene with atmospheric background & options
│   ├── SettingsScene.ts      # Gothic settings interface with sliders & toggles
│   ├── CreditsScene.ts       # Credits & attribution interface
│   └── GameScene.ts          # Prologue transition / game-start scene
├── ui/
│   └── MenuButton.ts         # Modular interactive menu button with keyboard/mouse support
├── utils/
│   └── PixelArtGenerator.ts  # Canvas-based procedural 16-bit pixel-art generator
├── config.ts                 # Phaser game configuration (FIT scaling, WebGL, pixelArt)
├── main.ts                   # Entry point and event binding
└── types.ts                  # TypeScript interfaces for settings and saves
```

---

## Running the Project

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
