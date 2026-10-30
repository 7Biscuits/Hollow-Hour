# THE HOLLOW HOUR — Asset Manifest & Palette Reference

This document catalogs all visual, audio, and font assets used in **THE HOLLOW HOUR**.

---

## Gothic Horror Color Palette (Lamentum Inspired)

| Color Name | Hex Code | Visual Application |
|---|---|---|
| **Charcoal Black** | `#040307`, `#08060a` | Deep shadows, night sky, silhouettes, tree trunks |
| **Dark Murk Violet** | `#130e19`, `#19121e` | Distant horizons, stone shadow undertones |
| **Deep Burgundy** | `#45101a`, `#2b0b12` | Crimson highlights, plaque borders, title accents |
| **Blood Wine** | `#8a1828`, `#9b2226` | Slider fills, title glow tints, gemstone cores |
| **Dark Mahogany Brown** | `#1c1013`, `#261a15` | Weathered wooden doors, furniture, dagger grip |
| **Faded Granite Grey** | `#221b27`, `#332a39` | Weathered masonry, chimneys, gravestones |
| **Desaturated Moss Green** | `#141a14`, `#1a241b` | Dead weeds, brambles, overgrown foliage |
| **Aged Brass / Gold** | `#8a6e45`, `#c89d4b` | Ornate corner rivets, dagger guard, slider diamond |
| **Tallow Ivory / Parchment**| `#bfa382`, `#d6cca8` | Candle wax, highlighted text, UI labels |
| **Warm Candlelight Amber** | `#ffaa44`, `#ffe89c` | Window lights, lantern flames, candle cores |

---

## Procedural Pixel-Art Textures (`PixelArtGenerator`)

| Texture Key | Dimensions | Type | Description |
|---|---|---|---|
| `mansion_sky` | 640 x 360 | Canvas | Stormy night sky, pale cratered moon, cloud bands |
| `mansion_building` | 640 x 360 | Canvas | Victorian mansion facade, rooflines, mullioned windows |
| `mansion_foreground` | 640 x 360 | Canvas | Cobblestone path, wrought iron gates, lanterns, trees |
| `fog_layer_1` | 640 x 180 | Canvas (Tile) | Seamless midground drifting fog |
| `fog_layer_2` | 640 x 180 | Canvas (Tile) | Seamless foreground drifting fog |
| `candle_anim` | 72 x 32 (18x32/frame) | SpriteSheet | 4-frame candle flicker with tallow drips & iron sconce |
| `ui_cursor` | 24 x 24 | Canvas | Gothic dagger with crimson gem pommel and brass guard |
| `ui_plaque` | 230 x 175 | Canvas | Dark slate backing with blood-red border & rivets |
| `ui_frame` | 64 x 64 | Canvas | Ornate corner filigree with trefoil knots |
| `ui_slider_track` | 200 x 12 | Canvas | Weathered iron track with blood groove |
| `ui_slider_thumb` | 16 x 16 | Canvas | Brass diamond thumb with faceted ruby center |
| `particle_dust` | 4 x 4 | Canvas | Floating ambient dust mote |
| `window_glow` | 96 x 96 | Canvas | Radial warm amber light gradient for candles/windows |

---

## Typography

- **Title & Primary Gothic Accents**: `'Cinzel Decorative'`, serif (Google Fonts).
- **Secondary Narrative & Subtitles**: `'MedievalSharp'`, serif (Google Fonts).
- **Technical, Retro & Hints**: `'VT323'`, monospace (Google Fonts).

---

## Audio Registry (`AudioManager`)

| Sound Identifier | Synthesizer / Source | Category | Description |
|---|---|---|---|
| `horror_drone` | Web Audio Dual Saw/Tri + Sine | Ambient | Deep 36.7Hz/55Hz sub drone with 103.8Hz tension |
| `wind_hiss` | Web Audio Bandpass Noise | Ambient | Modulated breathing wind hiss layer |
| `eerie_chime` | Web Audio Sine + Reverb Decay | Ambient | Random melancholy piano/clock harmonics |
| `ui_hover` | Web Audio Triangle sweep | SFX | Hollow wooden tick on menu selection |
| `ui_select` | Web Audio Sine Dual Harmonics | SFX | Resonant gothic iron/brass gong |
| `ui_back` | Web Audio Sine drop | SFX | Soft wooden release |
| `ui_disabled` | Web Audio Square low pulse | SFX | Heavy muted dull thud |
| `thunder` | Web Audio Brown Noise Lowpass | SFX | Deep resonant thunder rumble |
