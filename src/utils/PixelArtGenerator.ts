import Phaser from 'phaser';

/**
 * PixelArtGenerator
 * Procedurally generates authentic 16-bit gothic pixel-art textures
 * adhering to the Lamentum survival-horror color palette:
 * Charcoal black, deep burgundy, dark mahogany brown, faded granite grey,
 * desaturated moss green, and warm flickering candlelight amber.
 */
export class PixelArtGenerator {
  public static generateAll(scene: Phaser.Scene): void {
    if (!scene.textures.exists('mansion_sky')) {
      PixelArtGenerator.generateSky(scene);
    }
    if (!scene.textures.exists('mansion_building')) {
      PixelArtGenerator.generateMansion(scene);
    }
    if (!scene.textures.exists('mansion_foreground')) {
      PixelArtGenerator.generateForeground(scene);
    }
    if (!scene.textures.exists('fog_layer_1')) {
      PixelArtGenerator.generateFog(scene, 'fog_layer_1', 640, 180, 0.16, 0.26);
    }
    if (!scene.textures.exists('fog_layer_2')) {
      PixelArtGenerator.generateFog(scene, 'fog_layer_2', 640, 180, 0.22, 0.38);
    }
    if (!scene.textures.exists('candle_anim')) {
      PixelArtGenerator.generateCandleSheet(scene);
    }
    if (!scene.textures.exists('ui_cursor')) {
      PixelArtGenerator.generateCursor(scene);
    }
    if (!scene.textures.exists('ui_frame')) {
      PixelArtGenerator.generateUiFrame(scene);
    }
    if (!scene.textures.exists('ui_plaque')) {
      PixelArtGenerator.generateMenuPlaque(scene);
    }
    if (!scene.textures.exists('ui_slider')) {
      PixelArtGenerator.generateSliderAssets(scene);
    }
    if (!scene.textures.exists('particle_dust')) {
      PixelArtGenerator.generateDustParticle(scene);
    }
    if (!scene.textures.exists('window_glow')) {
      PixelArtGenerator.generateWindowGlow(scene);
    }
  }

  /**
   * Generates dark night sky with veiled pale moon and cloud wisps
   */
  private static generateSky(scene: Phaser.Scene): void {
    const w = 640;
    const h = 360;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Vertical night gradient (charcoal violet to deep murk)
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#040307');
    grad.addColorStop(0.35, '#0b0811');
    grad.addColorStop(0.65, '#130e19');
    grad.addColorStop(1, '#19121e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Eerie pale moon (upper center-right)
    const mx = 430;
    const my = 75;
    const moonRad = 24;

    // Faint outer moon halo
    const halo = ctx.createRadialGradient(mx, my, 8, mx, my, 65);
    halo.addColorStop(0, 'rgba(215, 205, 185, 0.22)');
    halo.addColorStop(0.5, 'rgba(160, 140, 130, 0.08)');
    halo.addColorStop(1, 'rgba(10, 8, 15, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(mx - 75, my - 75, 150, 150);

    // Moon disc
    ctx.fillStyle = '#bab3a3';
    ctx.beginPath();
    ctx.arc(mx, my, moonRad, 0, Math.PI * 2);
    ctx.fill();

    // Pixel craters / shaded texture on moon
    ctx.fillStyle = '#8a8274';
    ctx.beginPath();
    ctx.arc(mx - 5, my - 4, 7, 0, Math.PI * 2);
    ctx.arc(mx + 7, my + 5, 8, 0, Math.PI * 2);
    ctx.arc(mx + 2, my - 9, 4, 0, Math.PI * 2);
    ctx.fill();

    // Distant mountain / dead forest ridge silhouette at horizon
    ctx.fillStyle = '#08060d';
    ctx.beginPath();
    ctx.moveTo(0, 240);
    for (let x = 0; x <= w; x += 10) {
      const ny = 222 + Math.sin(x * 0.015) * 12 + Math.cos(x * 0.04) * 8;
      ctx.lineTo(x, ny);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Dark cloud bands drifting across moon and sky
    ctx.fillStyle = 'rgba(12, 9, 16, 0.7)';
    for (let i = 0; i < 5; i++) {
      const cy = 35 + i * 35;
      ctx.beginPath();
      ctx.ellipse(320 + (i % 2 === 0 ? 50 : -60), cy, 290, 14 + i * 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    scene.textures.addCanvas('mansion_sky', canvas);
  }

  /**
   * Generates the Gothic Victorian Mansion facade
   */
  private static generateMansion(scene: Phaser.Scene): void {
    const w = 640;
    const h = 360;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    const bx = 320;
    const by = 315;

    // Palette
    const cShadow = '#0a080d';
    const cStoneDark = '#16121b';
    const cStoneMid = '#221b27';
    const cStoneLight = '#332a39';
    const cRoof = '#110e15';
    const cRoofTrim = '#271f2e';
    const cWindowWood = '#120d11';

    // 1. Central Grand Tower & Wings Silhouettes
    // Central main block: x: 225 to 415, height 170
    ctx.fillStyle = cStoneDark;
    ctx.fillRect(bx - 95, by - 170, 190, 170);

    // Left Wing: x: 125 to 225
    ctx.fillRect(bx - 195, by - 130, 100, 130);

    // Right Wing: x: 415 to 515
    ctx.fillRect(bx + 95, by - 130, 100, 130);

    // Far Left Conservatory
    ctx.fillRect(bx - 235, by - 90, 40, 90);
    // Far Right Clock Turret
    ctx.fillRect(bx + 195, by - 150, 40, 150);

    // 2. High Gothic Roofs & Spires
    // Central Gothic Gable Roof
    ctx.fillStyle = cRoof;
    ctx.beginPath();
    ctx.moveTo(bx - 105, by - 170);
    ctx.lineTo(bx, by - 245);
    ctx.lineTo(bx + 105, by - 170);
    ctx.closePath();
    ctx.fill();

    // Spire finial on central roof
    ctx.fillStyle = cRoofTrim;
    ctx.fillRect(bx - 2, by - 265, 4, 20);
    ctx.fillRect(bx - 6, by - 250, 12, 3);

    // Left Wing Mansard Roof
    ctx.beginPath();
    ctx.moveTo(bx - 205, by - 130);
    ctx.lineTo(bx - 145, by - 175);
    ctx.lineTo(bx - 85, by - 130);
    ctx.closePath();
    ctx.fill();

    // Right Clock Turret Spire
    ctx.beginPath();
    ctx.moveTo(bx + 190, by - 150);
    ctx.lineTo(bx + 215, by - 215);
    ctx.lineTo(bx + 240, by - 150);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(bx + 214, by - 228, 2, 14);

    // Chimneys
    ctx.fillStyle = cStoneMid;
    ctx.fillRect(bx - 170, by - 190, 14, 35);
    ctx.fillRect(bx - 173, by - 193, 20, 5);

    ctx.fillRect(bx + 60, by - 210, 16, 45);
    ctx.fillRect(bx + 57, by - 213, 22, 5);

    // 3. Facade Details & Horizontal Bands
    ctx.fillStyle = cStoneMid;
    ctx.fillRect(bx - 200, by - 70, 400, 6);
    ctx.fillRect(bx - 100, by - 120, 200, 6);
    ctx.fillRect(bx - 200, by - 132, 400, 5);

    // Weathered stone brick texture patterns
    ctx.fillStyle = cStoneLight;
    for (let row = 0; row < 12; row++) {
      const ry = by - 160 + row * 13;
      const offset = (row % 2) * 15;
      for (let col = -12; col <= 12; col++) {
        const rx = bx + col * 28 + offset;
        if (Math.sin(row * 3 + col * 7) > 0.3) {
          ctx.fillRect(rx, ry, 6, 2);
        }
      }
    }

    // 4. Grand Entrance (Covered Porch / Portico)
    ctx.fillStyle = cShadow;
    ctx.fillRect(bx - 32, by - 64, 64, 64);
    ctx.fillStyle = cStoneMid;
    ctx.beginPath();
    ctx.moveTo(bx - 40, by - 64);
    ctx.lineTo(bx, by - 85);
    ctx.lineTo(bx + 40, by - 64);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(bx - 38, by - 64, 8, 64);
    ctx.fillRect(bx + 30, by - 64, 8, 64);

    // Heavy wooden arched doors
    ctx.fillStyle = '#080507';
    ctx.fillRect(bx - 22, by - 55, 44, 55);
    ctx.fillStyle = '#1c1013';
    ctx.fillRect(bx - 19, by - 50, 17, 50);
    ctx.fillRect(bx + 2, by - 50, 17, 50);
    // Iron studs
    ctx.fillStyle = '#3c2e30';
    ctx.fillRect(bx - 11, by - 30, 2, 2);
    ctx.fillRect(bx + 9, by - 30, 2, 2);

    // 5. Gothic Arched Windows
    const drawWindowFrame = (wx: number, wy: number, ww: number, wh: number, lit: boolean) => {
      ctx.fillStyle = cStoneLight;
      ctx.beginPath();
      ctx.arc(wx + ww / 2, wy + ww / 2, ww / 2 + 2, Math.PI, 0);
      ctx.rect(wx - 2, wy + ww / 2, ww + 4, wh - ww / 2 + 2);
      ctx.fill();

      ctx.fillStyle = cWindowWood;
      ctx.beginPath();
      ctx.arc(wx + ww / 2, wy + ww / 2, ww / 2, Math.PI, 0);
      ctx.rect(wx, wy + ww / 2, ww, wh - ww / 2);
      ctx.fill();

      if (lit) {
        const winGrad = ctx.createLinearGradient(wx, wy, wx, wy + wh);
        winGrad.addColorStop(0, '#ffe89c');
        winGrad.addColorStop(0.4, '#e59a34');
        winGrad.addColorStop(1, '#662208');
        ctx.fillStyle = winGrad;
      } else {
        ctx.fillStyle = '#08070e';
      }

      ctx.beginPath();
      ctx.arc(wx + ww / 2, wy + ww / 2, ww / 2 - 2, Math.PI, 0);
      ctx.rect(wx + 2, wy + ww / 2, ww - 4, wh - ww / 2 - 2);
      ctx.fill();

      // Gothic Mullions
      ctx.fillStyle = '#171115';
      ctx.fillRect(wx + Math.floor(ww / 2) - 1, wy + 2, 2, wh - 3);
      ctx.fillRect(wx + 2, wy + Math.floor(wh * 0.45), ww - 4, 2);
      ctx.fillRect(wx + 2, wy + Math.floor(wh * 0.72), ww - 4, 2);
    };

    // Windows arrangement: keep the center area for the menu plaque
    // Top Central Tower Attic Window (lit)
    drawWindowFrame(bx - 11, by - 220, 22, 36, true);

    // Flanking Upper Windows
    drawWindowFrame(bx - 65, by - 165, 20, 32, true);  // Lit window left of center
    drawWindowFrame(bx + 45, by - 165, 20, 32, false); // Dark window right of center

    // Left Wing Windows
    drawWindowFrame(bx - 170, by - 115, 20, 32, false);
    drawWindowFrame(bx - 130, by - 115, 20, 32, true); // Lit library window
    drawWindowFrame(bx - 170, by - 60, 20, 32, false);
    drawWindowFrame(bx - 130, by - 60, 20, 32, false);

    // Right Wing Windows
    drawWindowFrame(bx + 115, by - 115, 20, 32, false);
    drawWindowFrame(bx + 155, by - 115, 20, 32, false);
    drawWindowFrame(bx + 115, by - 60, 20, 32, true);  // Downstairs lit parlor
    drawWindowFrame(bx + 155, by - 60, 20, 32, false);

    // Clock Turret Dial
    ctx.fillStyle = '#17131c';
    ctx.beginPath();
    ctx.arc(bx + 215, by - 125, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#625442';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Clock hands
    ctx.strokeStyle = '#bfa382';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bx + 215, by - 125);
    ctx.lineTo(bx + 213, by - 133);
    ctx.moveTo(bx + 215, by - 125);
    ctx.lineTo(bx + 221, by - 129);
    ctx.stroke();

    scene.textures.addCanvas('mansion_building', canvas);
  }

  /**
   * Generates Foreground: Gnarled trees, wrought iron fence, stone pillars,
   * overgrown vegetation, and cobblestone path winding forward.
   */
  private static generateForeground(scene: Phaser.Scene): void {
    const w = 640;
    const h = 360;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // 1. Cobblestone Path winding from mansion entrance to foreground
    const pathGrad = ctx.createLinearGradient(320, 260, 320, 360);
    pathGrad.addColorStop(0, '#110f15');
    pathGrad.addColorStop(0.5, '#1d1720');
    pathGrad.addColorStop(1, '#261c27');
    ctx.fillStyle = pathGrad;

    ctx.beginPath();
    ctx.moveTo(290, 280);
    ctx.lineTo(350, 280);
    ctx.lineTo(460, 360);
    ctx.lineTo(180, 360);
    ctx.closePath();
    ctx.fill();

    // Cobblestones on path
    ctx.fillStyle = '#332a37';
    for (let py = 285; py < 360; py += 5) {
      const spread = (py - 280) * 1.8;
      const stonesInRow = 6 + Math.floor((py - 280) / 8);
      for (let s = 0; s < stonesInRow; s++) {
        const sx = 320 - spread / 2 + (s / stonesInRow) * spread + (Math.sin(s * 7 + py) * 4);
        const sw = 4 + (py - 280) * 0.1;
        const sh = 2 + (py - 280) * 0.04;
        ctx.fillRect(sx, py, sw, sh);
      }
    }

    // 2. Grassy/overgrown ground flanking the path
    ctx.fillStyle = '#0b0a0e';
    ctx.beginPath();
    ctx.moveTo(0, 280);
    ctx.lineTo(290, 280);
    ctx.lineTo(180, 360);
    ctx.lineTo(0, 360);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(350, 280);
    ctx.lineTo(640, 280);
    ctx.lineTo(640, 360);
    ctx.lineTo(460, 360);
    ctx.closePath();
    ctx.fill();

    // Overgrown dead weeds and brambles
    ctx.strokeStyle = '#141a14';
    ctx.lineWidth = 1;
    for (let i = 0; i < 70; i++) {
      const gx = i < 35 ? Math.random() * 200 : 440 + Math.random() * 200;
      const gy = 285 + Math.random() * 70;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + (Math.random() - 0.5) * 8, gy - 8 - Math.random() * 10);
      ctx.stroke();
    }

    // 3. Wrought Iron Fence & Gate
    const drawPillar = (px: number, py: number) => {
      ctx.fillStyle = '#17131d';
      ctx.fillRect(px, py - 45, 18, 45);
      ctx.fillStyle = '#26202e';
      ctx.fillRect(px - 2, py - 48, 22, 5);
      ctx.fillRect(px - 1, py - 2, 20, 4);

      ctx.fillStyle = '#0f0c13';
      ctx.fillRect(px + 4, py - 38, 10, 30);

      // Ornate Lantern
      ctx.fillStyle = '#272015';
      ctx.fillRect(px + 6, py - 54, 6, 6);
      ctx.fillStyle = '#ffaa44';
      ctx.fillRect(px + 7, py - 52, 4, 4);
    };

    drawPillar(210, 320);
    drawPillar(410, 320);

    const drawFence = (x1: number, x2: number, fy: number) => {
      ctx.strokeStyle = '#0e0b13';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, fy - 30);
      ctx.lineTo(x2, fy - 30);
      ctx.moveTo(x1, fy - 10);
      ctx.lineTo(x2, fy - 10);
      ctx.stroke();

      for (let x = x1; x <= x2; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, fy);
        ctx.lineTo(x, fy - 38);
        ctx.stroke();
        ctx.fillStyle = '#1b1723';
        ctx.beginPath();
        ctx.moveTo(x - 2, fy - 38);
        ctx.lineTo(x, fy - 44);
        ctx.lineTo(x + 2, fy - 38);
        ctx.fill();
      }
    };

    drawFence(0, 210, 320);
    drawFence(428, 640, 320);

    // Weathered Gravestones
    const drawGravestone = (gx: number, gy: number) => {
      ctx.fillStyle = '#18141d';
      ctx.beginPath();
      ctx.arc(gx + 8, gy - 20, 8, Math.PI, 0);
      ctx.rect(gx, gy - 20, 16, 20);
      ctx.fill();
      ctx.fillStyle = '#26202e';
      ctx.fillRect(gx + 2, gy - 18, 12, 1);
    };
    drawGravestone(90, 340);
    drawGravestone(140, 325);

    // Bare trees
    PixelArtGenerator.drawPixelTree(ctx, -15, 360, 1.3, false);
    PixelArtGenerator.drawPixelTree(ctx, 70, 320, 0.8, false);
    PixelArtGenerator.drawPixelTree(ctx, 645, 360, 1.25, true);
    PixelArtGenerator.drawPixelTree(ctx, 565, 325, 0.85, true);

    scene.textures.addCanvas('mansion_foreground', canvas);
  }

  private static drawPixelTree(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    scale: number,
    flip: boolean
  ): void {
    ctx.fillStyle = '#060408';
    const dir = flip ? -1 : 1;
    const trunkW = Math.round(28 * scale);
    const trunkH = Math.round(180 * scale);

    ctx.beginPath();
    ctx.moveTo(startX - trunkW / 2, startY);
    ctx.lineTo(startX - (trunkW / 4) * dir, startY - trunkH * 0.4);
    ctx.lineTo(startX + (25 * dir * scale), startY - trunkH);
    ctx.lineTo(startX + (45 * dir * scale), startY - trunkH);
    ctx.lineTo(startX + trunkW / 2, startY);
    ctx.closePath();
    ctx.fill();

    const branches = [
      { ox: 15 * dir, oy: -70, len: 120, angle: -0.6 * dir, thickness: 10 },
      { ox: 25 * dir, oy: -110, len: 100, angle: 0.4 * dir, thickness: 8 },
      { ox: 35 * dir, oy: -140, len: 130, angle: -0.8 * dir, thickness: 7 },
      { ox: 40 * dir, oy: -160, len: 90, angle: -0.1 * dir, thickness: 6 },
      { ox: 10 * dir, oy: -90, len: 80, angle: 0.9 * dir, thickness: 6 },
    ];

    branches.forEach(b => {
      const bx = startX + b.ox * scale;
      const by = startY + b.oy * scale;
      const ex = bx + Math.cos(b.angle) * b.len * scale;
      const ey = by + Math.sin(b.angle) * b.len * scale;

      ctx.beginPath();
      ctx.lineWidth = b.thickness * scale;
      ctx.strokeStyle = '#060408';
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(
        (bx + ex) / 2 + (Math.sin(b.ox) * 20 * scale),
        (by + ey) / 2 - (15 * scale),
        ex,
        ey
      );
      ctx.stroke();

      for (let t = 0; t < 3; t++) {
        const tx = bx + (ex - bx) * (0.4 + t * 0.25);
        const ty = by + (ey - by) * (0.4 + t * 0.25);
        const subAngle = b.angle + (t % 2 === 0 ? 0.5 : -0.5) * dir;
        const subLen = 35 * scale;
        ctx.beginPath();
        ctx.lineWidth = Math.max(1, (b.thickness * 0.5 - t) * scale);
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx + Math.cos(subAngle) * subLen, ty + Math.sin(subAngle) * subLen);
        ctx.stroke();
      }
    });
  }

  private static generateFog(
    scene: Phaser.Scene,
    key: string,
    width: number,
    height: number,
    alphaMin: number,
    alphaMax: number
  ): void {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const numClouds = 40;
    for (let i = 0; i < numClouds; i++) {
      const cx = Math.random() * width;
      const cy = Math.random() * height;
      const rx = 55 + Math.random() * 95;
      const ry = 18 + Math.random() * 32;
      const a = alphaMin + Math.random() * (alphaMax - alphaMin);

      const radGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, rx);
      radGrad.addColorStop(0, `rgba(175, 170, 190, ${a})`);
      radGrad.addColorStop(0.5, `rgba(115, 110, 130, ${a * 0.5})`);
      radGrad.addColorStop(1, 'rgba(25, 20, 35, 0)');

      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();

      if (cx - rx < 0) {
        ctx.beginPath();
        ctx.ellipse(cx + width, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (cx + rx > width) {
        ctx.beginPath();
        ctx.ellipse(cx - width, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    scene.textures.addCanvas(key, canvas);
  }

  private static generateCandleSheet(scene: Phaser.Scene): void {
    const fw = 18;
    const fh = 32;
    const frames = 4;
    const canvas = document.createElement('canvas');
    canvas.width = fw * frames;
    canvas.height = fh;
    const ctx = canvas.getContext('2d')!;

    for (let f = 0; f < frames; f++) {
      const ox = f * fw;

      // Iron wall sconce bracket
      ctx.fillStyle = '#181216';
      ctx.fillRect(ox + 4, 25, 10, 4);
      ctx.fillRect(ox + 8, 28, 2, 4);

      // Candle stick (tallow ivory)
      ctx.fillStyle = '#d6cca8';
      ctx.fillRect(ox + 6, 17, 6, 9);
      // Drips
      ctx.fillStyle = '#b3a887';
      ctx.fillRect(ox + 5, 18, 2, 4);
      ctx.fillRect(ox + 11, 19, 2, 3);
      // Wick
      ctx.fillStyle = '#221915';
      ctx.fillRect(ox + 8, 14, 2, 4);

      // Flame
      const wobble = Math.sin(f * 1.5) * 1.5;
      const flameH = 10 + (f % 2) * 2;

      // Outer Red/Orange
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.ellipse(ox + 9 + wobble, 10, 4, flameH / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner Yellow
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(ox + 9 + wobble * 0.6, 11, 2.5, flameH / 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Core White
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(ox + 8 + Math.round(wobble * 0.3), 12, 2, 2);
    }

    scene.textures.addSpriteSheet('candle_anim', canvas, {
      frameWidth: fw,
      frameHeight: fh
    });
  }

  /**
   * Gothic menu background plaque / gravestone panel
   */
  private static generateMenuPlaque(scene: Phaser.Scene): void {
    const w = 230;
    const h = 175;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Dark semi-transparent slate backing
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(16, 12, 20, 0.88)');
    grad.addColorStop(0.5, 'rgba(10, 7, 13, 0.94)');
    grad.addColorStop(1, 'rgba(16, 12, 20, 0.88)');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(w - 8, 0);
    ctx.lineTo(w, 8);
    ctx.lineTo(w, h - 8);
    ctx.lineTo(w - 8, h);
    ctx.lineTo(8, h);
    ctx.lineTo(0, h - 8);
    ctx.lineTo(0, 8);
    ctx.closePath();
    ctx.fill();

    // Dark crimson border
    ctx.strokeStyle = '#4a121c';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner subtle gold filigree line
    ctx.strokeStyle = 'rgba(162, 128, 85, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, w - 8, h - 8);

    // Corner rivets
    ctx.fillStyle = '#8a6e45';
    ctx.fillRect(6, 6, 2, 2);
    ctx.fillRect(w - 8, 6, 2, 2);
    ctx.fillRect(6, h - 8, 2, 2);
    ctx.fillRect(w - 8, h - 8, 2, 2);

    scene.textures.addCanvas('ui_plaque', canvas);
  }

  private static generateCursor(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d')!;

    // Blade
    ctx.fillStyle = '#e2dde7';
    ctx.beginPath();
    ctx.moveTo(8, 9);
    ctx.lineTo(22, 12);
    ctx.lineTo(8, 15);
    ctx.closePath();
    ctx.fill();

    // Groove
    ctx.fillStyle = '#544b5c';
    ctx.fillRect(9, 11, 9, 2);

    // Crossguard
    ctx.fillStyle = '#c89d4b';
    ctx.fillRect(6, 6, 3, 12);
    ctx.fillStyle = '#e8c57e';
    ctx.fillRect(7, 5, 1, 14);

    // Pommel gem
    ctx.fillStyle = '#9e1a2b';
    ctx.fillRect(1, 11, 3, 3);
    ctx.fillStyle = '#ff4d6d';
    ctx.fillRect(2, 11, 1, 1);

    // Grip
    ctx.fillStyle = '#261a15';
    ctx.fillRect(3, 10, 4, 4);

    scene.textures.addCanvas('ui_cursor', canvas);
  }

  private static generateUiFrame(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#3a2e26';
    ctx.fillRect(0, 0, 32, 4);
    ctx.fillRect(0, 0, 4, 32);

    ctx.fillStyle = '#7a6042';
    ctx.fillRect(0, 0, 16, 2);
    ctx.fillRect(0, 0, 2, 16);

    ctx.fillStyle = '#9e8055';
    ctx.beginPath();
    ctx.arc(8, 8, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1c1510';
    ctx.beginPath();
    ctx.arc(8, 8, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ba9a6b';
    ctx.fillRect(2, 2, 2, 2);
    ctx.fillRect(24, 1, 2, 2);
    ctx.fillRect(1, 24, 2, 2);

    scene.textures.addCanvas('ui_frame', canvas);
  }

  private static generateSliderAssets(scene: Phaser.Scene): void {
    const trackCanvas = document.createElement('canvas');
    trackCanvas.width = 200;
    trackCanvas.height = 12;
    const tCtx = trackCanvas.getContext('2d')!;

    tCtx.fillStyle = '#0f0c11';
    tCtx.fillRect(0, 2, 200, 8);
    tCtx.fillStyle = '#2c2230';
    tCtx.strokeRect(0.5, 2.5, 199, 7);

    tCtx.fillStyle = '#4a1520';
    tCtx.fillRect(2, 4, 196, 4);

    scene.textures.addCanvas('ui_slider_track', trackCanvas);

    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = 16;
    thumbCanvas.height = 16;
    const hCtx = thumbCanvas.getContext('2d')!;

    hCtx.fillStyle = '#8a6e45';
    hCtx.beginPath();
    hCtx.moveTo(8, 0);
    hCtx.lineTo(16, 8);
    hCtx.lineTo(8, 16);
    hCtx.lineTo(0, 8);
    hCtx.closePath();
    hCtx.fill();

    hCtx.fillStyle = '#c7a36c';
    hCtx.beginPath();
    hCtx.moveTo(8, 2);
    hCtx.lineTo(14, 8);
    hCtx.lineTo(8, 14);
    hCtx.lineTo(2, 8);
    hCtx.closePath();
    hCtx.fill();

    hCtx.fillStyle = '#6d101d';
    hCtx.fillRect(6, 6, 4, 4);
    hCtx.fillStyle = '#e63946';
    hCtx.fillRect(7, 7, 2, 2);

    scene.textures.addCanvas('ui_slider_thumb', thumbCanvas);
  }

  private static generateDustParticle(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 4;
    canvas.height = 4;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(215, 195, 165, 0.8)';
    ctx.fillRect(1, 1, 2, 2);
    ctx.fillStyle = 'rgba(255, 240, 210, 1)';
    ctx.fillRect(1, 1, 1, 1);

    scene.textures.addCanvas('particle_dust', canvas);
  }

  private static generateWindowGlow(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 96;
    canvas.height = 96;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(48, 48, 4, 48, 48, 46);
    grad.addColorStop(0, 'rgba(255, 185, 75, 0.55)');
    grad.addColorStop(0.35, 'rgba(210, 120, 30, 0.28)');
    grad.addColorStop(0.7, 'rgba(120, 45, 10, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 96, 96);

    scene.textures.addCanvas('window_glow', canvas);
  }
}
