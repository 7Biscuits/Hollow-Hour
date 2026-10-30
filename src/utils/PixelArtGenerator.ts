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
    // Menu & Atmosphere Textures
    if (!scene.textures.exists('mansion_sky')) PixelArtGenerator.generateSky(scene);
    if (!scene.textures.exists('mansion_building')) PixelArtGenerator.generateMansion(scene);
    if (!scene.textures.exists('mansion_foreground')) PixelArtGenerator.generateForeground(scene);
    if (!scene.textures.exists('fog_layer_1')) PixelArtGenerator.generateFog(scene, 'fog_layer_1', 640, 180, 0.16, 0.26);
    if (!scene.textures.exists('fog_layer_2')) PixelArtGenerator.generateFog(scene, 'fog_layer_2', 640, 180, 0.22, 0.38);
    if (!scene.textures.exists('candle_anim')) PixelArtGenerator.generateCandleSheet(scene);
    if (!scene.textures.exists('ui_cursor')) PixelArtGenerator.generateCursor(scene);
    if (!scene.textures.exists('ui_frame')) PixelArtGenerator.generateUiFrame(scene);
    if (!scene.textures.exists('ui_plaque')) PixelArtGenerator.generateMenuPlaque(scene);
    if (!scene.textures.exists('ui_slider_track')) PixelArtGenerator.generateSliderAssets(scene);
    if (!scene.textures.exists('particle_dust')) PixelArtGenerator.generateDustParticle(scene);
    if (!scene.textures.exists('window_glow')) PixelArtGenerator.generateWindowGlow(scene);

    // Phase 3: Player and Environment Textures
    if (!scene.textures.exists('detective_sheet')) PixelArtGenerator.generateDetectiveSheet(scene);
    if (!scene.textures.exists('tile_floor_wood')) PixelArtGenerator.generateWoodFloor(scene);
    if (!scene.textures.exists('tile_floor_stone')) PixelArtGenerator.generateStoneFloor(scene);
    if (!scene.textures.exists('tile_carpet')) PixelArtGenerator.generateCarpetTile(scene);
    if (!scene.textures.exists('tile_wall_wood')) PixelArtGenerator.generateWoodWall(scene);
    if (!scene.textures.exists('tile_wall_stone')) PixelArtGenerator.generateStoneWall(scene);
    if (!scene.textures.exists('obj_door')) PixelArtGenerator.generateDoor(scene);
    if (!scene.textures.exists('obj_clock')) PixelArtGenerator.generateGrandfatherClock(scene);
    if (!scene.textures.exists('obj_bookshelf')) PixelArtGenerator.generateBookshelf(scene);
    if (!scene.textures.exists('obj_desk')) PixelArtGenerator.generateDesk(scene);
    if (!scene.textures.exists('obj_bed')) PixelArtGenerator.generateCanopyBed(scene);
    if (!scene.textures.exists('obj_cctv')) PixelArtGenerator.generateCctvConsole(scene);
    if (!scene.textures.exists('obj_fireplace')) PixelArtGenerator.generateFireplace(scene);
    if (!scene.textures.exists('obj_portrait')) PixelArtGenerator.generatePortrait(scene);
    if (!scene.textures.exists('obj_altar')) PixelArtGenerator.generateAltar(scene);
    if (!scene.textures.exists('obj_wall_sconce')) PixelArtGenerator.generateWallSconce(scene);
    if (!scene.textures.exists('light_cone')) PixelArtGenerator.generateLightCone(scene);

    // Phase 4: Core Gameplay Systems Textures (Items, Portraits, UI, Puzzles)
    if (!scene.textures.exists('icon_key_brass')) PixelArtGenerator.generateItemIcons(scene);
    if (!scene.textures.exists('portrait_graves')) PixelArtGenerator.generateCharacterPortraits(scene);
    if (!scene.textures.exists('ui_notebook_page')) PixelArtGenerator.generateNotebookTextures(scene);
    if (!scene.textures.exists('ui_clock_face')) PixelArtGenerator.generateClockPuzzleTextures(scene);

    // Phase 5: Investigation & Puzzle Gameplay Textures
    if (!scene.textures.exists('obj_secret_passage')) PixelArtGenerator.generateSecretPassage(scene);
    if (!scene.textures.exists('ui_cctv_frame')) PixelArtGenerator.generateCctvTextures(scene);
    if (!scene.textures.exists('ui_bookshelf_frame')) PixelArtGenerator.generateBookshelfTextures(scene);
    if (!scene.textures.exists('ui_occult_ring_outer')) PixelArtGenerator.generateOccultPuzzleTextures(scene);

    // Phase 6: Characters, Ghosts & Crime Scene Textures
    if (!scene.textures.exists('npc_victoria')) PixelArtGenerator.generateNpcSprites(scene);
    if (!scene.textures.exists('blood_pool_decal')) PixelArtGenerator.generateCrimeDecals(scene);

    // Phase 7: Werewolf Antagonist & Survival Horror Textures
    if (!scene.textures.exists('werewolf_sheet')) PixelArtGenerator.generateWerewolfSheet(scene);
    if (!scene.textures.exists('obj_wardrobe')) PixelArtGenerator.generateWardrobe(scene);
    if (!scene.textures.exists('ui_alert_icon')) PixelArtGenerator.generateHorrorUiTextures(scene);

    // Phase 8: Narrative Endings & Epilogue Textures
    if (!scene.textures.exists('ending_dawn')) PixelArtGenerator.generateEndingTextures(scene);
  }

  // --- Main Menu Textures ---

  private static generateSky(scene: Phaser.Scene): void {
    const w = 640;
    const h = 360;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#040307');
    grad.addColorStop(0.35, '#0b0811');
    grad.addColorStop(0.65, '#130e19');
    grad.addColorStop(1, '#19121e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const mx = 430;
    const my = 75;
    const moonRad = 24;

    const halo = ctx.createRadialGradient(mx, my, 8, mx, my, 65);
    halo.addColorStop(0, 'rgba(215, 205, 185, 0.22)');
    halo.addColorStop(0.5, 'rgba(160, 140, 130, 0.08)');
    halo.addColorStop(1, 'rgba(10, 8, 15, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(mx - 75, my - 75, 150, 150);

    ctx.fillStyle = '#bab3a3';
    ctx.beginPath();
    ctx.arc(mx, my, moonRad, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#8a8274';
    ctx.beginPath();
    ctx.arc(mx - 5, my - 4, 7, 0, Math.PI * 2);
    ctx.arc(mx + 7, my + 5, 8, 0, Math.PI * 2);
    ctx.arc(mx + 2, my - 9, 4, 0, Math.PI * 2);
    ctx.fill();

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

    ctx.fillStyle = 'rgba(12, 9, 16, 0.7)';
    for (let i = 0; i < 5; i++) {
      const cy = 35 + i * 35;
      ctx.beginPath();
      ctx.ellipse(320 + (i % 2 === 0 ? 50 : -60), cy, 290, 14 + i * 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    scene.textures.addCanvas('mansion_sky', canvas);
  }

  private static generateMansion(scene: Phaser.Scene): void {
    const w = 640;
    const h = 360;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    const bx = 320;
    const by = 315;

    const cShadow = '#0a080d';
    const cStoneDark = '#16121b';
    const cStoneMid = '#221b27';
    const cStoneLight = '#332a39';
    const cRoof = '#110e15';
    const cRoofTrim = '#271f2e';
    const cWindowWood = '#120d11';

    ctx.fillStyle = cStoneDark;
    ctx.fillRect(bx - 95, by - 170, 190, 170);
    ctx.fillRect(bx - 195, by - 130, 100, 130);
    ctx.fillRect(bx + 95, by - 130, 100, 130);
    ctx.fillRect(bx - 235, by - 90, 40, 90);
    ctx.fillRect(bx + 195, by - 150, 40, 150);

    ctx.fillStyle = cRoof;
    ctx.beginPath();
    ctx.moveTo(bx - 105, by - 170);
    ctx.lineTo(bx, by - 245);
    ctx.lineTo(bx + 105, by - 170);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = cRoofTrim;
    ctx.fillRect(bx - 2, by - 265, 4, 20);
    ctx.fillRect(bx - 6, by - 250, 12, 3);

    ctx.beginPath();
    ctx.moveTo(bx - 205, by - 130);
    ctx.lineTo(bx - 145, by - 175);
    ctx.lineTo(bx - 85, by - 130);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(bx + 190, by - 150);
    ctx.lineTo(bx + 215, by - 215);
    ctx.lineTo(bx + 240, by - 150);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(bx + 214, by - 228, 2, 14);

    ctx.fillStyle = cStoneMid;
    ctx.fillRect(bx - 170, by - 190, 14, 35);
    ctx.fillRect(bx - 173, by - 193, 20, 5);
    ctx.fillRect(bx + 60, by - 210, 16, 45);
    ctx.fillRect(bx + 57, by - 213, 22, 5);

    ctx.fillStyle = cStoneMid;
    ctx.fillRect(bx - 200, by - 70, 400, 6);
    ctx.fillRect(bx - 100, by - 120, 200, 6);
    ctx.fillRect(bx - 200, by - 132, 400, 5);

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

    ctx.fillStyle = '#080507';
    ctx.fillRect(bx - 22, by - 55, 44, 55);
    ctx.fillStyle = '#1c1013';
    ctx.fillRect(bx - 19, by - 50, 17, 50);
    ctx.fillRect(bx + 2, by - 50, 17, 50);
    ctx.fillStyle = '#3c2e30';
    ctx.fillRect(bx - 11, by - 30, 2, 2);
    ctx.fillRect(bx + 9, by - 30, 2, 2);

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

      ctx.fillStyle = '#171115';
      ctx.fillRect(wx + Math.floor(ww / 2) - 1, wy + 2, 2, wh - 3);
      ctx.fillRect(wx + 2, wy + Math.floor(wh * 0.45), ww - 4, 2);
      ctx.fillRect(wx + 2, wy + Math.floor(wh * 0.72), ww - 4, 2);
    };

    drawWindowFrame(bx - 11, by - 220, 22, 36, true);
    drawWindowFrame(bx - 65, by - 165, 20, 32, true);
    drawWindowFrame(bx + 45, by - 165, 20, 32, false);
    drawWindowFrame(bx - 170, by - 115, 20, 32, false);
    drawWindowFrame(bx - 130, by - 115, 20, 32, true);
    drawWindowFrame(bx - 170, by - 60, 20, 32, false);
    drawWindowFrame(bx - 130, by - 60, 20, 32, false);
    drawWindowFrame(bx + 115, by - 115, 20, 32, false);
    drawWindowFrame(bx + 155, by - 115, 20, 32, false);
    drawWindowFrame(bx + 115, by - 60, 20, 32, true);
    drawWindowFrame(bx + 155, by - 60, 20, 32, false);

    ctx.fillStyle = '#17131c';
    ctx.beginPath();
    ctx.arc(bx + 215, by - 125, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#625442';
    ctx.lineWidth = 2;
    ctx.stroke();

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

  private static generateForeground(scene: Phaser.Scene): void {
    const w = 640;
    const h = 360;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

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

    const drawPillar = (px: number, py: number) => {
      ctx.fillStyle = '#17131d';
      ctx.fillRect(px, py - 45, 18, 45);
      ctx.fillStyle = '#26202e';
      ctx.fillRect(px - 2, py - 48, 22, 5);
      ctx.fillRect(px - 1, py - 2, 20, 4);
      ctx.fillStyle = '#0f0c13';
      ctx.fillRect(px + 4, py - 38, 10, 30);
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
      ctx.fillStyle = '#181216';
      ctx.fillRect(ox + 4, 25, 10, 4);
      ctx.fillRect(ox + 8, 28, 2, 4);

      ctx.fillStyle = '#d6cca8';
      ctx.fillRect(ox + 6, 17, 6, 9);
      ctx.fillStyle = '#b3a887';
      ctx.fillRect(ox + 5, 18, 2, 4);
      ctx.fillRect(ox + 11, 19, 2, 3);
      ctx.fillStyle = '#221915';
      ctx.fillRect(ox + 8, 14, 2, 4);

      const wobble = Math.sin(f * 1.5) * 1.5;
      const flameH = 10 + (f % 2) * 2;

      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.ellipse(ox + 9 + wobble, 10, 4, flameH / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(ox + 9 + wobble * 0.6, 11, 2.5, flameH / 3, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.fillRect(ox + 8 + Math.round(wobble * 0.3), 12, 2, 2);
    }

    scene.textures.addSpriteSheet('candle_anim', canvas as any, {
      frameWidth: fw,
      frameHeight: fh
    });
  }

  private static generateMenuPlaque(scene: Phaser.Scene): void {
    const w = 230;
    const h = 175;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

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

    ctx.strokeStyle = '#4a121c';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(162, 128, 85, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, w - 8, h - 8);

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

    ctx.fillStyle = '#e2dde7';
    ctx.beginPath();
    ctx.moveTo(8, 9);
    ctx.lineTo(22, 12);
    ctx.lineTo(8, 15);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#544b5c';
    ctx.fillRect(9, 11, 9, 2);

    ctx.fillStyle = '#c89d4b';
    ctx.fillRect(6, 6, 3, 12);
    ctx.fillStyle = '#e8c57e';
    ctx.fillRect(7, 5, 1, 14);

    ctx.fillStyle = '#9e1a2b';
    ctx.fillRect(1, 11, 3, 3);
    ctx.fillStyle = '#ff4d6d';
    ctx.fillRect(2, 11, 1, 1);

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

  // ==========================================
  // PHASE 3: PLAYER AND ENVIRONMENT TEXTURES
  // ==========================================

  /**
   * Generates a 4x4 sprite sheet for the Detective character:
   * 4 Directions (Down, Left, Right, Up), 4 frames each (Idle, Walk1, Walk2, Walk3).
   * Frame size: 24 x 32 px. Total canvas: 96 x 128 px.
   */
  private static generateDetectiveSheet(scene: Phaser.Scene): void {
    const fw = 24;
    const fh = 32;
    const canvas = document.createElement('canvas');
    canvas.width = fw * 4;
    canvas.height = fh * 4;
    const ctx = canvas.getContext('2d')!;

    // Directions: 0 = Down, 1 = Left, 2 = Right, 3 = Up
    for (let dir = 0; dir < 4; dir++) {
      for (let f = 0; f < 4; f++) {
        const ox = f * fw;
        const oy = dir * fh;

        // Walk stride offsets
        const legOffset = (f === 1) ? 2 : (f === 3) ? -2 : 0;
        const bob = (f % 2 === 1) ? 1 : 0;

        // 1. Legs / Trousers (Dark charcoal brown)
        ctx.fillStyle = '#1c171e';
        if (dir === 0 || dir === 3) {
          // Front / Back legs
          ctx.fillRect(ox + 8, oy + 23 - bob, 3, 8 + legOffset);
          ctx.fillRect(ox + 13, oy + 23 - bob, 3, 8 - legOffset);
          // Shoes
          ctx.fillStyle = '#0f0c11';
          ctx.fillRect(ox + 7, oy + 30 - bob + Math.max(0, legOffset), 4, 2);
          ctx.fillRect(ox + 13, oy + 30 - bob + Math.max(0, -legOffset), 4, 2);
        } else {
          // Side view legs
          ctx.fillRect(ox + 10 + legOffset, oy + 23 - bob, 4, 8);
          ctx.fillStyle = '#0f0c11';
          ctx.fillRect(ox + 10 + legOffset, oy + 30 - bob, 5, 2);
        }

        // 2. Trenchcoat Body (Charcoal brown with belt & collar)
        ctx.fillStyle = '#2e2524';
        ctx.fillRect(ox + 7, oy + 12 - bob, 10, 12);
        // Coat hem shadow
        ctx.fillStyle = '#1a1415';
        ctx.fillRect(ox + 6, oy + 21 - bob, 12, 3);
        // Belt
        ctx.fillStyle = '#120d0f';
        ctx.fillRect(ox + 7, oy + 18 - bob, 10, 2);
        ctx.fillStyle = '#c49d48'; // brass buckle
        ctx.fillRect(ox + 11, oy + 18 - bob, 2, 2);

        // 3. Torso details by direction
        if (dir === 0) {
          // Front view: muted burgundy tie / white collar
          ctx.fillStyle = '#dcd5c9';
          ctx.fillRect(ox + 11, oy + 12 - bob, 2, 3);
          ctx.fillStyle = '#781d26';
          ctx.fillRect(ox + 11, oy + 14 - bob, 2, 4);
          // Lantern in right hand
          ctx.fillStyle = '#c79f42';
          ctx.fillRect(ox + 18, oy + 17 - bob, 3, 5);
          ctx.fillStyle = '#ffeaa7';
          ctx.fillRect(ox + 19, oy + 18 - bob, 2, 3);
        } else if (dir === 1) {
          // Facing Left: lantern in left hand
          ctx.fillStyle = '#c79f42';
          ctx.fillRect(ox + 3, oy + 17 - bob, 3, 5);
          ctx.fillStyle = '#ffeaa7';
          ctx.fillRect(ox + 3, oy + 18 - bob, 2, 3);
        } else if (dir === 2) {
          // Facing Right: lantern in right hand
          ctx.fillStyle = '#c79f42';
          ctx.fillRect(ox + 18, oy + 17 - bob, 3, 5);
          ctx.fillStyle = '#ffeaa7';
          ctx.fillRect(ox + 19, oy + 18 - bob, 2, 3);
        } else if (dir === 3) {
          // Back view: coat seam & collar
          ctx.fillStyle = '#221a1a';
          ctx.fillRect(ox + 11, oy + 12 - bob, 2, 10);
        }

        // 4. Head & Face
        ctx.fillStyle = '#d7bc9e'; // skin tone
        ctx.fillRect(ox + 9, oy + 7 - bob, 6, 6);

        // 5. Victorian Fedora Hat
        ctx.fillStyle = '#191418'; // hat brim
        ctx.fillRect(ox + 5, oy + 7 - bob, 14, 2);
        ctx.fillStyle = '#251e24'; // hat crown
        ctx.fillRect(ox + 7, oy + 2 - bob, 10, 5);
        ctx.fillStyle = '#6e1d24'; // crimson hat band
        ctx.fillRect(ox + 7, oy + 6 - bob, 10, 1);
      }
    }

    scene.textures.addSpriteSheet('detective_sheet', canvas as any, {
      frameWidth: fw,
      frameHeight: fh
    });
  }

  /**
   * Dark polished Victorian oak wood parquet floor (32x32)
   */
  private static generateWoodFloor(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#241a17';
    ctx.fillRect(0, 0, 32, 32);

    // Parquet planks
    ctx.fillStyle = '#2d211e';
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillRect(16, 16, 16, 16);

    // Plank seams
    ctx.strokeStyle = '#140e0c';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, 31, 31);
    ctx.beginPath();
    ctx.moveTo(16, 0); ctx.lineTo(16, 32);
    ctx.moveTo(0, 16); ctx.lineTo(32, 16);
    ctx.stroke();

    // Wood grain lines
    ctx.fillStyle = '#3a2b27';
    ctx.fillRect(2, 4, 12, 1);
    ctx.fillRect(3, 10, 9, 1);
    ctx.fillRect(18, 20, 11, 1);
    ctx.fillRect(20, 27, 8, 1);

    scene.textures.addCanvas('tile_floor_wood', canvas);
  }

  /**
   * Cold stone flagstone floor for basement & cellar (32x32)
   */
  private static generateStoneFloor(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#16141a';
    ctx.fillRect(0, 0, 32, 32);

    // Flagstones
    ctx.strokeStyle = '#0b090e';
    ctx.lineWidth = 1;
    ctx.strokeRect(1, 1, 14, 14);
    ctx.strokeRect(17, 1, 14, 14);
    ctx.strokeRect(1, 17, 30, 14);

    ctx.fillStyle = '#221f28';
    ctx.fillRect(2, 2, 12, 12);
    ctx.fillRect(18, 2, 12, 12);
    ctx.fillRect(2, 18, 28, 12);

    // Weathering / cracks
    ctx.fillStyle = '#2f2b37';
    ctx.fillRect(4, 5, 2, 2);
    ctx.fillRect(22, 7, 3, 1);
    ctx.fillRect(12, 24, 4, 1);

    scene.textures.addCanvas('tile_floor_stone', canvas);
  }

  /**
   * Ornate Victorian burgundy carpet / rug tile (32x32)
   */
  private static generateCarpetTile(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#420d18';
    ctx.fillRect(0, 0, 32, 32);

    // Gold damask border pattern
    ctx.strokeStyle = '#8c7042';
    ctx.lineWidth = 1;
    ctx.strokeRect(2.5, 2.5, 27, 27);

    // Inner velvet medallion
    ctx.fillStyle = '#5c1422';
    ctx.fillRect(6, 6, 20, 20);

    ctx.fillStyle = '#bfa365';
    ctx.fillRect(15, 15, 2, 2);
    ctx.fillRect(10, 10, 2, 2);
    ctx.fillRect(20, 10, 2, 2);
    ctx.fillRect(10, 20, 2, 2);
    ctx.fillRect(20, 20, 2, 2);

    scene.textures.addCanvas('tile_carpet', canvas);
  }

  /**
   * Victorian wood-paneled wall with dark damask wallpaper (32x48)
   */
  private static generateWoodWall(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 48;
    const ctx = canvas.getContext('2d')!;

    // Top moulding
    ctx.fillStyle = '#1c1514';
    ctx.fillRect(0, 0, 32, 6);
    ctx.fillStyle = '#3a2b27';
    ctx.fillRect(0, 4, 32, 2);

    // Upper wallpaper (Muted dark green/brown gothic damask)
    ctx.fillStyle = '#18201a';
    ctx.fillRect(0, 6, 32, 26);
    ctx.fillStyle = '#222d25';
    ctx.fillRect(6, 12, 4, 4);
    ctx.fillRect(22, 12, 4, 4);
    ctx.fillRect(14, 22, 4, 4);

    // Wainscoting rail
    ctx.fillStyle = '#3a2b27';
    ctx.fillRect(0, 32, 32, 3);
    ctx.fillStyle = '#140e0c';
    ctx.fillRect(0, 35, 32, 1);

    // Lower wood wainscot panel
    ctx.fillStyle = '#261b17';
    ctx.fillRect(0, 36, 32, 12);
    ctx.strokeStyle = '#18100e';
    ctx.lineWidth = 1;
    ctx.strokeRect(3.5, 38.5, 25, 8);

    scene.textures.addCanvas('tile_wall_wood', canvas);
  }

  /**
   * Dungeon / basement stone wall (32x48)
   */
  private static generateStoneWall(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 48;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#141217';
    ctx.fillRect(0, 0, 32, 48);

    // Masonry stone blocks
    ctx.strokeStyle = '#0a080d';
    ctx.lineWidth = 1;
    for (let y = 0; y < 48; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(32, y);
      ctx.stroke();
      const offset = (y % 24 === 0) ? 0 : 16;
      ctx.beginPath();
      ctx.moveTo(offset, y); ctx.lineTo(offset, y + 12);
      ctx.stroke();
    }

    ctx.fillStyle = '#1f1b24';
    ctx.fillRect(2, 2, 12, 8);
    ctx.fillRect(18, 14, 12, 8);
    ctx.fillRect(2, 26, 12, 8);

    scene.textures.addCanvas('tile_wall_stone', canvas);
  }

  /**
   * Heavy gothic arched wooden door (32x48)
   */
  private static generateDoor(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 48;
    const ctx = canvas.getContext('2d')!;

    // Door frame
    ctx.fillStyle = '#120d0f';
    ctx.fillRect(0, 0, 32, 48);

    // Arch top
    ctx.fillStyle = '#2c1e1a';
    ctx.beginPath();
    ctx.arc(16, 16, 13, Math.PI, 0);
    ctx.rect(3, 16, 26, 30);
    ctx.fill();

    // Wood planks
    ctx.strokeStyle = '#18100e';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(11, 6); ctx.lineTo(11, 46);
    ctx.moveTo(16, 3); ctx.lineTo(16, 46);
    ctx.moveTo(21, 6); ctx.lineTo(21, 46);
    ctx.stroke();

    // Heavy iron hinges
    ctx.fillStyle = '#110e13';
    ctx.fillRect(4, 16, 6, 3);
    ctx.fillRect(4, 38, 6, 3);

    // Brass keyhole & latch
    ctx.fillStyle = '#bda05e';
    ctx.fillRect(24, 26, 3, 5);
    ctx.fillStyle = '#0a080c';
    ctx.fillRect(25, 28, 1, 2);

    scene.textures.addCanvas('obj_door', canvas);
  }

  /**
   * Victorian Grandfather Clock (24x48)
   */
  private static generateGrandfatherClock(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 48;
    const ctx = canvas.getContext('2d')!;

    // Case
    ctx.fillStyle = '#2a1a15';
    ctx.fillRect(4, 4, 16, 42);
    // Pediment
    ctx.fillStyle = '#3a241e';
    ctx.fillRect(2, 2, 20, 4);

    // Clock Face
    ctx.fillStyle = '#dcd5c4';
    ctx.beginPath();
    ctx.arc(12, 14, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1a100d';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Clock hands at 11:55
    ctx.strokeStyle = '#0a0605';
    ctx.beginPath();
    ctx.moveTo(12, 14); ctx.lineTo(11, 10);
    ctx.moveTo(12, 14); ctx.lineTo(15, 12);
    ctx.stroke();

    // Glass case waist
    ctx.fillStyle = '#0f0a09';
    ctx.fillRect(6, 23, 12, 18);
    ctx.strokeStyle = '#4a2f26';
    ctx.strokeRect(6.5, 23.5, 11, 17);

    // Brass pendulum
    ctx.fillStyle = '#c9965d';
    ctx.fillRect(11, 25, 2, 10);
    ctx.beginPath();
    ctx.arc(12, 35, 3, 0, Math.PI * 2);
    ctx.fill();

    scene.textures.addCanvas('obj_clock', canvas);
  }

  /**
   * Tall library bookcase filled with leather tomes (36x48)
   */
  private static generateBookshelf(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 36;
    canvas.height = 48;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#1e1411';
    ctx.fillRect(0, 0, 36, 48);

    // Shelves
    ctx.fillStyle = '#36241f';
    ctx.fillRect(2, 2, 32, 3);
    ctx.fillRect(2, 16, 32, 3);
    ctx.fillRect(2, 30, 32, 3);
    ctx.fillRect(2, 44, 32, 3);

    // Book spines (burgundy, dark green, gold, navy)
    const bookColors = ['#631720', '#1c3d25', '#7a602e', '#1c2838', '#421626'];
    for (let shelf = 0; shelf < 3; shelf++) {
      const sy = 6 + shelf * 14;
      let bx = 3;
      while (bx < 33) {
        const bw = 2 + Math.floor(Math.random() * 3);
        const col = bookColors[Math.floor(Math.random() * bookColors.length)];
        ctx.fillStyle = col;
        ctx.fillRect(bx, sy, bw, 10);
        // Gold foil spine title
        if (bw > 2) {
          ctx.fillStyle = '#c7ab6d';
          ctx.fillRect(bx + 1, sy + 3, bw - 2, 1);
        }
        bx += bw + 1;
      }
    }

    scene.textures.addCanvas('obj_bookshelf', canvas);
  }

  /**
   * Antique study desk with papers & oil lamp (40x28)
   */
  private static generateDesk(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 28;
    const ctx = canvas.getContext('2d')!;

    // Desk top
    ctx.fillStyle = '#32201a';
    ctx.fillRect(2, 4, 36, 16);
    ctx.strokeStyle = '#180e0c';
    ctx.lineWidth = 1;
    ctx.strokeRect(2.5, 4.5, 35, 15);

    // Desk legs
    ctx.fillStyle = '#221511';
    ctx.fillRect(4, 20, 4, 7);
    ctx.fillRect(32, 20, 4, 7);

    // Blotter / Scattered Papers
    ctx.fillStyle = '#141e17'; // green leather blotter
    ctx.fillRect(12, 7, 16, 10);
    ctx.fillStyle = '#dcd5c4'; // paper document
    ctx.fillRect(15, 9, 8, 6);
    ctx.fillStyle = '#0a0808';
    ctx.fillRect(16, 11, 5, 1);
    ctx.fillRect(16, 13, 4, 1);

    // Oil Lamp
    ctx.fillStyle = '#bfa365';
    ctx.fillRect(6, 6, 4, 4);
    ctx.fillStyle = '#ffba08'; // glowing glass
    ctx.fillRect(7, 8, 2, 4);

    scene.textures.addCanvas('obj_desk', canvas);
  }

  /**
   * Four-poster canopy master bed (44x48)
   */
  private static generateCanopyBed(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 44;
    canvas.height = 48;
    const ctx = canvas.getContext('2d')!;

    // Posts
    ctx.fillStyle = '#1c120f';
    ctx.fillRect(2, 2, 4, 44);
    ctx.fillRect(38, 2, 4, 44);

    // Headboard & Canopy frame
    ctx.fillStyle = '#2e1c17';
    ctx.fillRect(4, 4, 36, 10);

    // Velvet mattress & dark linens
    ctx.fillStyle = '#4a121e';
    ctx.fillRect(6, 14, 32, 30);
    // Dark folded quilt
    ctx.fillStyle = '#300a12';
    ctx.fillRect(6, 26, 32, 18);

    // Pillows
    ctx.fillStyle = '#c7bfae';
    ctx.fillRect(8, 16, 12, 8);
    ctx.fillRect(24, 16, 12, 8);

    // Crimson canopy drapes
    ctx.fillStyle = '#5c1424';
    ctx.fillRect(2, 4, 6, 22);
    ctx.fillRect(36, 4, 6, 22);

    scene.textures.addCanvas('obj_bed', canvas);
  }

  /**
   * Security room CCTV console with glowing CRT screens (40x32)
   */
  private static generateCctvConsole(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    // Metal rack cabinet
    ctx.fillStyle = '#191b22';
    ctx.fillRect(0, 0, 40, 32);
    ctx.strokeStyle = '#0d0e12';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, 39, 31);

    // 4 CRT Monitors (2x2 grid)
    const screens = [
      { x: 3, y: 3 }, { x: 21, y: 3 },
      { x: 3, y: 15 }, { x: 21, y: 15 }
    ];

    screens.forEach((s, idx) => {
      // Screen frame
      ctx.fillStyle = '#0b0d11';
      ctx.fillRect(s.x, s.y, 16, 10);

      // Greenish-grey surveillance phosphor glow
      ctx.fillStyle = (idx === 0) ? '#1f382a' : (idx === 1) ? '#182d22' : '#14241b';
      ctx.fillRect(s.x + 1, s.y + 1, 14, 8);

      // Camera static / scanlines
      ctx.fillStyle = '#426e55';
      ctx.fillRect(s.x + 2, s.y + 3, 12, 1);
      ctx.fillRect(s.x + 4, s.y + 6, 8, 1);

      // Blinking red REC LED
      ctx.fillStyle = '#e63946';
      ctx.fillRect(s.x + 13, s.y + 2, 1, 1);
    });

    // Control switches / dials
    ctx.fillStyle = '#2a2e3a';
    ctx.fillRect(0, 26, 40, 6);
    ctx.fillStyle = '#e5a93b'; // yellow toggle
    ctx.fillRect(8, 28, 3, 2);
    ctx.fillRect(16, 28, 3, 2);
    ctx.fillRect(24, 28, 3, 2);

    scene.textures.addCanvas('obj_cctv', canvas);
  }

  /**
   * Gothic carved stone fireplace with embers (44x36)
   */
  private static generateFireplace(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 44;
    canvas.height = 36;
    const ctx = canvas.getContext('2d')!;

    // Stone Mantel
    ctx.fillStyle = '#26222c';
    ctx.fillRect(0, 0, 44, 8);
    ctx.fillStyle = '#18141d';
    ctx.fillRect(2, 8, 40, 28);

    // Hearth cavity
    ctx.fillStyle = '#08060a';
    ctx.fillRect(8, 12, 28, 24);

    // Glowing embers / small fire
    ctx.fillStyle = '#8f2d14';
    ctx.fillRect(14, 28, 16, 6);
    ctx.fillStyle = '#e85d04';
    ctx.fillRect(16, 27, 12, 4);
    ctx.fillStyle = '#f48c06';
    ctx.fillRect(18, 25, 8, 3);
    ctx.fillStyle = '#ffba08';
    ctx.fillRect(20, 24, 4, 2);

    scene.textures.addCanvas('obj_fireplace', canvas);
  }

  /**
   * Gilded portrait of Lord Alistair Blackthorn (24x32)
   */
  private static generatePortrait(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    // Gold ornate frame
    ctx.fillStyle = '#9e8042';
    ctx.fillRect(0, 0, 24, 32);
    ctx.fillStyle = '#c7ab6d';
    ctx.fillRect(2, 2, 20, 28);
    ctx.fillStyle = '#1c130b';
    ctx.fillRect(4, 4, 16, 24);

    // Canvas background
    ctx.fillStyle = '#201614';
    ctx.fillRect(5, 5, 14, 22);

    // Aristocratic figure silhouette (Lord Alistair)
    ctx.fillStyle = '#0d090a';
    ctx.fillRect(7, 15, 10, 12); // suit
    ctx.fillStyle = '#d2b48c';
    ctx.fillRect(10, 9, 4, 6);  // face
    ctx.fillStyle = '#4a3b32';
    ctx.fillRect(9, 7, 6, 3);   // hair

    // Ominous yellow eyes glinting in the dark portrait
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(10, 11, 1, 1);
    ctx.fillRect(12, 11, 1, 1);

    scene.textures.addCanvas('obj_portrait', canvas);
  }

  /**
   * Basement occult stone ritual altar (40x32)
   */
  private static generateAltar(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    // Stone base
    ctx.fillStyle = '#141217';
    ctx.fillRect(2, 6, 36, 26);
    ctx.fillStyle = '#221f28';
    ctx.fillRect(0, 2, 40, 8);

    // Carved esoteric symbol (pentagram / sigil)
    ctx.strokeStyle = '#5a1824';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(20, 6, 4, 0, Math.PI * 2);
    ctx.stroke();

    // Dried blood stains on stone
    ctx.fillStyle = '#400a12';
    ctx.fillRect(12, 5, 8, 3);
    ctx.fillRect(15, 8, 4, 8);
    ctx.fillRect(26, 6, 5, 4);

    // Lit candles on altar corners
    ctx.fillStyle = '#dcd5c4';
    ctx.fillRect(3, 0, 2, 4);
    ctx.fillRect(35, 0, 2, 4);
    ctx.fillStyle = '#ffba08';
    ctx.fillRect(3, -2, 2, 2);
    ctx.fillRect(35, -2, 2, 2);

    scene.textures.addCanvas('obj_altar', canvas);
  }

  /**
   * Wall sconce with flickering amber torch/candle (16x20)
   */
  private static generateWallSconce(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 20;
    const ctx = canvas.getContext('2d')!;

    // Iron wall mount
    ctx.fillStyle = '#161218';
    ctx.fillRect(6, 8, 4, 8);
    ctx.fillRect(4, 14, 8, 2);

    // Cup
    ctx.fillStyle = '#a68249';
    ctx.fillRect(5, 6, 6, 3);

    // Flame
    ctx.fillStyle = '#e85d04';
    ctx.beginPath();
    ctx.ellipse(8, 4, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffba08';
    ctx.fillRect(7, 3, 2, 2);

    scene.textures.addCanvas('obj_wall_sconce', canvas);
  }

  /**
   * Flashlight cone mask texture (160x160)
   */
  private static generateLightCone(scene: Phaser.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext('2d')!;

    // Smooth radial light mask with soft falloff
    const grad = ctx.createRadialGradient(80, 80, 6, 80, 80, 78);
    grad.addColorStop(0, 'rgba(255, 240, 200, 1)');
    grad.addColorStop(0.3, 'rgba(240, 215, 160, 0.85)');
    grad.addColorStop(0.65, 'rgba(180, 140, 90, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 160, 160);

    scene.textures.addCanvas('light_cone', canvas);
  }

  // --- Phase 4: Core Systems Textures ---

  public static generateItemIcons(scene: Phaser.Scene): void {
    const items: Array<{ key: string; draw: (ctx: CanvasRenderingContext2D) => void }> = [
      {
        key: 'icon_key_brass',
        draw: (ctx) => {
          // Brass Key
          ctx.fillStyle = '#4a3818';
          ctx.fillRect(8, 6, 8, 8);
          ctx.fillStyle = '#e9c46a';
          ctx.fillRect(9, 7, 6, 6);
          ctx.clearRect(11, 9, 2, 2); // Hole
          ctx.fillStyle = '#d4a373';
          ctx.fillRect(11, 14, 3, 12); // Shaft
          ctx.fillRect(14, 21, 5, 2);  // Bit teeth
          ctx.fillRect(14, 24, 4, 2);
          ctx.fillStyle = '#fff3b0';
          ctx.fillRect(10, 8, 2, 2);   // Highlight
        }
      },
      {
        key: 'icon_key_iron',
        draw: (ctx) => {
          // Heavy Iron Key
          ctx.fillStyle = '#1e2124';
          ctx.fillRect(9, 5, 8, 8);
          ctx.fillStyle = '#495057';
          ctx.fillRect(10, 6, 6, 6);
          ctx.clearRect(12, 8, 2, 2);
          ctx.fillStyle = '#343a40';
          ctx.fillRect(11, 13, 4, 13);
          ctx.fillRect(15, 20, 6, 2);
          ctx.fillRect(15, 23, 4, 2);
          ctx.fillStyle = '#6c757d';
          ctx.fillRect(11, 7, 2, 2);
        }
      },
      {
        key: 'icon_pocket_watch',
        draw: (ctx) => {
          // Silver Pocket Watch stopped at 3:33
          ctx.fillStyle = '#343a40';
          ctx.fillRect(12, 3, 4, 3); // Crown
          ctx.fillStyle = '#6c757d';
          ctx.fillRect(6, 6, 16, 16);
          ctx.fillStyle = '#adb5bd';
          ctx.fillRect(7, 7, 14, 14);
          ctx.fillStyle = '#f8f9fa';
          ctx.fillRect(8, 8, 12, 12); // Dial
          // Dial marks
          ctx.fillStyle = '#212529';
          ctx.fillRect(13, 9, 2, 1);  // 12
          ctx.fillRect(18, 13, 1, 2); // 3
          ctx.fillRect(13, 18, 2, 1); // 6
          ctx.fillRect(9, 13, 1, 2);  // 9
          // Hands at 3:33
          ctx.fillStyle = '#800020';
          ctx.fillRect(14, 14, 3, 1); // Hour hand -> 3
          ctx.fillRect(14, 14, 2, 3); // Minute hand -> ~33
        }
      },
      {
        key: 'icon_diary',
        draw: (ctx) => {
          // Charred Leather Grimoire / Diary
          ctx.fillStyle = '#1c0d12';
          ctx.fillRect(7, 6, 15, 18);
          ctx.fillStyle = '#4a1525';
          ctx.fillRect(9, 7, 12, 16);
          // Gold Embossed Occult Sigil
          ctx.fillStyle = '#d4af37';
          ctx.fillRect(14, 11, 2, 7);
          ctx.fillRect(11, 14, 8, 2);
          // Charred ragged edges
          ctx.fillStyle = '#0f0a0c';
          ctx.fillRect(19, 6, 2, 3);
          ctx.fillRect(20, 15, 2, 4);
          ctx.fillRect(7, 22, 5, 2);
        }
      },
      {
        key: 'icon_clock_hand',
        draw: (ctx) => {
          // Ornate Brass Clock Hand
          ctx.fillStyle = '#4a3818';
          ctx.fillRect(8, 12, 14, 4);
          ctx.fillStyle = '#d4a373';
          ctx.fillRect(9, 13, 12, 2);
          // Spear tip
          ctx.fillStyle = '#e9c46a';
          ctx.fillRect(21, 12, 3, 4);
          ctx.fillRect(24, 13, 2, 2);
          // Ring base
          ctx.fillRect(6, 11, 4, 6);
          ctx.clearRect(7, 12, 2, 4);
        }
      },
      {
        key: 'icon_cctv_tape',
        draw: (ctx) => {
          // Magnetic Surveillance Tape Cassette
          ctx.fillStyle = '#151518';
          ctx.fillRect(5, 7, 18, 14);
          ctx.fillStyle = '#2b2b30';
          ctx.fillRect(6, 8, 16, 12);
          // Spool holes
          ctx.fillStyle = '#f8f9fa';
          ctx.fillRect(9, 12, 3, 3);
          ctx.fillRect(16, 12, 3, 3);
          ctx.fillStyle = '#0f0f12';
          ctx.fillRect(10, 13, 1, 1);
          ctx.fillRect(17, 13, 1, 1);
          // Label
          ctx.fillStyle = '#8a2be2';
          ctx.fillRect(8, 9, 12, 2);
        }
      },
      {
        key: 'icon_laudanum',
        draw: (ctx) => {
          // Glass Apothecary Bottle
          ctx.fillStyle = '#8d6e4f';
          ctx.fillRect(12, 5, 4, 3); // Cork
          ctx.fillStyle = '#422006';
          ctx.fillRect(10, 8, 8, 15); // Bottle
          ctx.fillStyle = '#b45309';
          ctx.fillRect(11, 11, 6, 11); // Tincture
          ctx.fillStyle = '#fde68a';
          ctx.fillRect(11, 11, 1, 9); // Glass reflection
        }
      },
      {
        key: 'icon_silver_sigil',
        draw: (ctx) => {
          // Engraved Silver Occult Medallion
          ctx.fillStyle = '#334155';
          ctx.fillRect(7, 7, 14, 14);
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(8, 8, 12, 12);
          ctx.fillStyle = '#e2e8f0';
          // Carved pentagram star
          ctx.fillRect(13, 9, 2, 10);
          ctx.fillRect(9, 13, 10, 2);
          ctx.fillRect(10, 10, 2, 2);
          ctx.fillRect(16, 10, 2, 2);
          ctx.fillRect(10, 16, 2, 2);
          ctx.fillRect(16, 16, 2, 2);
        }
      },
      {
        key: 'icon_ritual_dagger',
        draw: (ctx) => {
          // Obsidian / Silver Ritual Dagger
          ctx.fillStyle = '#991b1b';
          ctx.fillRect(7, 21, 3, 3); // Ruby pommel
          ctx.fillStyle = '#27272a';
          ctx.fillRect(9, 18, 4, 4); // Grip
          ctx.fillStyle = '#d4af37';
          ctx.fillRect(7, 16, 8, 2); // Guard
          // Curved wavy blade
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(12, 12, 3, 4);
          ctx.fillRect(14, 8, 3, 4);
          ctx.fillRect(16, 5, 2, 3);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(13, 11, 1, 4);
          ctx.fillRect(15, 7, 1, 3);
        }
      }
    ];

    for (const item of items) {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d')!;
      item.draw(ctx);
      scene.textures.addCanvas(item.key, canvas);
    }
  }

  public static generateCharacterPortraits(scene: Phaser.Scene): void {
    const portraits: Array<{ key: string; draw: (ctx: CanvasRenderingContext2D) => void }> = [
      {
        key: 'portrait_graves',
        draw: (ctx) => {
          // Inspector Graves (48x48)
          ctx.fillStyle = '#0f0e13';
          ctx.fillRect(0, 0, 48, 48); // Backdrop
          // Trenchcoat collar
          ctx.fillStyle = '#3c3224';
          ctx.fillRect(10, 32, 28, 16);
          ctx.fillStyle = '#5c4d37';
          ctx.fillRect(14, 30, 20, 4);
          // Dark tie
          ctx.fillStyle = '#1c1510';
          ctx.fillRect(22, 34, 4, 14);
          // Face & Stubble
          ctx.fillStyle = '#c5a07c';
          ctx.fillRect(16, 18, 16, 14);
          ctx.fillStyle = '#8f6c49';
          ctx.fillRect(16, 26, 16, 6); // 5 o'clock shadow
          // Sharp eyes under shadow
          ctx.fillStyle = '#362419';
          ctx.fillRect(18, 21, 4, 2);
          ctx.fillRect(26, 21, 4, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(19, 21, 1, 1);
          ctx.fillRect(27, 21, 1, 1);
          // Fedora
          ctx.fillStyle = '#1e1a17';
          ctx.fillRect(8, 14, 32, 4);  // Brim
          ctx.fillRect(14, 6, 20, 9);  // Crown
          ctx.fillStyle = '#5c1d24';
          ctx.fillRect(14, 13, 20, 2); // Burgundy ribbon
        }
      },
      {
        key: 'portrait_victoria',
        draw: (ctx) => {
          // Victoria Vance (Widow)
          ctx.fillStyle = '#0f0e13';
          ctx.fillRect(0, 0, 48, 48);
          // Black mourning gown & collar
          ctx.fillStyle = '#161218';
          ctx.fillRect(10, 32, 28, 16);
          ctx.fillStyle = '#781d28';
          ctx.fillRect(22, 33, 4, 4); // Mourning brooch
          // Hair
          ctx.fillStyle = '#181416';
          ctx.fillRect(13, 8, 22, 12);
          // Pale Victorian face
          ctx.fillStyle = '#e8d9cc';
          ctx.fillRect(16, 16, 16, 16);
          // Somber sorrowful eyes
          ctx.fillStyle = '#382226';
          ctx.fillRect(18, 21, 3, 2);
          ctx.fillRect(27, 21, 3, 2);
          // Black lace veil pattern overlay
          ctx.fillStyle = 'rgba(15, 10, 18, 0.65)';
          ctx.fillRect(12, 10, 24, 14);
          ctx.fillStyle = '#221524';
          for (let y = 11; y < 24; y += 3) {
            for (let x = 13; x < 35; x += 3) {
              ctx.fillRect(x, y, 1, 1);
            }
          }
        }
      },
      {
        key: 'portrait_edward',
        draw: (ctx) => {
          // Edward Vance (Nephew)
          ctx.fillStyle = '#0f0e13';
          ctx.fillRect(0, 0, 48, 48);
          // Dark green velvet coat & silk cravat
          ctx.fillStyle = '#1b3b2b';
          ctx.fillRect(10, 32, 28, 16);
          ctx.fillStyle = '#d4af37';
          ctx.fillRect(22, 34, 4, 8); // Cravat pin
          // Brown side-parted hair
          ctx.fillStyle = '#4a3728';
          ctx.fillRect(14, 8, 20, 10);
          // Pale anxious face
          ctx.fillStyle = '#decaa9';
          ctx.fillRect(16, 16, 16, 15);
          // Gold spectacles
          ctx.fillStyle = '#d4af37';
          ctx.fillRect(17, 20, 5, 4);
          ctx.fillRect(26, 20, 5, 4);
          ctx.fillRect(22, 21, 4, 1); // Bridge
          ctx.fillStyle = '#2c1e13';
          ctx.fillRect(19, 21, 2, 2); // Nervous pupils
          ctx.fillRect(28, 21, 2, 2);
        }
      },
      {
        key: 'portrait_hayes',
        draw: (ctx) => {
          // Dr. Robert Hayes (Family Physician)
          ctx.fillStyle = '#0f0e13';
          ctx.fillRect(0, 0, 48, 48);
          // High medical collar & apothecary suit
          ctx.fillStyle = '#212529';
          ctx.fillRect(10, 32, 28, 16);
          ctx.fillStyle = '#f8f9fa';
          ctx.fillRect(20, 31, 8, 5); // Stiff white collar
          // Silver-grey hair
          ctx.fillStyle = '#64748b';
          ctx.fillRect(14, 8, 20, 9);
          // Lined weathered face
          ctx.fillStyle = '#cbb29c';
          ctx.fillRect(16, 16, 16, 16);
          // Pointed Van Dyke beard
          ctx.fillStyle = '#475569';
          ctx.fillRect(22, 28, 4, 5);
          ctx.fillRect(20, 26, 8, 2); // Mustache
          // Piercing gaze
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(18, 20, 3, 2);
          ctx.fillRect(27, 20, 3, 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(19, 20, 1, 1);
          ctx.fillRect(28, 20, 1, 1);
        }
      },
      {
        key: 'portrait_alistair_ghost',
        draw: (ctx) => {
          // Ghost of Alistair Vance (Spectral)
          ctx.fillStyle = '#061318';
          ctx.fillRect(0, 0, 48, 48);
          // Spectral translucent aura
          ctx.fillStyle = 'rgba(45, 212, 191, 0.2)';
          ctx.fillRect(6, 6, 36, 36);
          // Ethereal ghostly face
          ctx.fillStyle = '#5eead4';
          ctx.fillRect(16, 15, 16, 17);
          // Flowing ethereal hair
          ctx.fillStyle = '#2dd4bf';
          ctx.fillRect(13, 8, 22, 10);
          // Hollow glowing spectral eyes
          ctx.fillStyle = '#042f2e';
          ctx.fillRect(18, 19, 4, 4);
          ctx.fillRect(26, 19, 4, 4);
          ctx.fillStyle = '#ccfbf1';
          ctx.fillRect(19, 20, 2, 2);
          ctx.fillRect(27, 20, 2, 2);
          // Torn Victorian velvet robe
          ctx.fillStyle = '#115e59';
          ctx.fillRect(12, 32, 24, 16);
          // Wisps of soul mist
          ctx.fillStyle = '#99f6e4';
          ctx.fillRect(8, 20, 2, 8);
          ctx.fillRect(38, 16, 2, 10);
        }
      },
      {
        key: 'portrait_edward_ghost',
        draw: (ctx) => {
          // Ghost of Edward Vance (Spectral)
          ctx.fillStyle = '#0a101f';
          ctx.fillRect(0, 0, 48, 48);
          // Ethereal blue aura
          ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
          ctx.fillRect(6, 6, 36, 36);
          // Spectral coat
          ctx.fillStyle = '#1e3a5f';
          ctx.fillRect(10, 32, 28, 16);
          // Ghost hair
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(14, 8, 20, 10);
          // Pale spectral face
          ctx.fillStyle = '#7dd3fc';
          ctx.fillRect(16, 16, 16, 15);
          // Spectral glowing spectacles
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(17, 20, 5, 4);
          ctx.fillRect(26, 20, 5, 4);
          ctx.fillRect(22, 21, 4, 1);
          // Hollow glowing eyes
          ctx.fillStyle = '#e0f2fe';
          ctx.fillRect(19, 21, 2, 2);
          ctx.fillRect(28, 21, 2, 2);
          // Soul mist
          ctx.fillStyle = '#bae6fd';
          ctx.fillRect(6, 24, 2, 6);
          ctx.fillRect(40, 22, 2, 7);
        }
      },
      {
        key: 'portrait_victoria_ghost',
        draw: (ctx) => {
          // Ghost of Victoria Vance (Spectral)
          ctx.fillStyle = '#120b1c';
          ctx.fillRect(0, 0, 48, 48);
          // Spectral purple/indigo aura
          ctx.fillStyle = 'rgba(168, 85, 247, 0.22)';
          ctx.fillRect(6, 6, 36, 36);
          // Spectral gown
          ctx.fillStyle = '#3b1d54';
          ctx.fillRect(10, 32, 28, 16);
          // Ghost hair & veil dissolving into mist
          ctx.fillStyle = '#6b21a8';
          ctx.fillRect(13, 8, 22, 12);
          // Pale ghostly face
          ctx.fillStyle = '#d8b4fe';
          ctx.fillRect(16, 16, 16, 16);
          // Hollow sorrowful glowing eyes
          ctx.fillStyle = '#3b0764';
          ctx.fillRect(18, 21, 3, 2);
          ctx.fillRect(27, 21, 3, 2);
          ctx.fillStyle = '#f3e8ff';
          ctx.fillRect(19, 21, 1, 1);
          ctx.fillRect(28, 21, 1, 1);
          // Soul mist wisps
          ctx.fillStyle = '#c084fc';
          ctx.fillRect(7, 18, 2, 10);
          ctx.fillRect(39, 24, 2, 8);
        }
      },
      {
        key: 'portrait_hayes_ghost',
        draw: (ctx) => {
          // Ghost of Dr. Robert Hayes (Spectral)
          ctx.fillStyle = '#061a14';
          ctx.fillRect(0, 0, 48, 48);
          // Spectral green aura
          ctx.fillStyle = 'rgba(52, 211, 153, 0.2)';
          ctx.fillRect(6, 6, 36, 36);
          // Ghost coat
          ctx.fillStyle = '#064e3b';
          ctx.fillRect(10, 32, 28, 16);
          // Spectral hair & beard
          ctx.fillStyle = '#10b981';
          ctx.fillRect(14, 8, 20, 9);
          ctx.fillRect(22, 28, 4, 5);
          // Pale spectral face
          ctx.fillStyle = '#6ee7b7';
          ctx.fillRect(16, 16, 16, 16);
          // Glowing eyes
          ctx.fillStyle = '#ecfdf5';
          ctx.fillRect(18, 20, 2, 2);
          ctx.fillRect(27, 20, 2, 2);
          // Soul mist
          ctx.fillStyle = '#a7f3d0';
          ctx.fillRect(6, 26, 2, 6);
          ctx.fillRect(40, 20, 2, 8);
        }
      }
    ];

    for (const p of portraits) {
      const canvas = document.createElement('canvas');
      canvas.width = 48;
      canvas.height = 48;
      const ctx = canvas.getContext('2d')!;
      p.draw(ctx);
      scene.textures.addCanvas(p.key, canvas);
    }
  }

  public static generateNotebookTextures(scene: Phaser.Scene): void {
    // 1. Notebook Open Book Spread (480x280)
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = 480;
    pageCanvas.height = 280;
    const pCtx = pageCanvas.getContext('2d')!;

    // Leather cover border
    pCtx.fillStyle = '#241711';
    pCtx.fillRect(0, 0, 480, 280);
    pCtx.fillStyle = '#3a2417';
    pCtx.fillRect(3, 3, 474, 274);

    // Stitched leather dots around edge
    pCtx.fillStyle = '#7a5a3a';
    for (let x = 6; x < 474; x += 8) {
      pCtx.fillRect(x, 5, 2, 2);
      pCtx.fillRect(x, 273, 2, 2);
    }
    for (let y = 6; y < 274; y += 8) {
      pCtx.fillRect(5, y, 2, 2);
      pCtx.fillRect(473, y, 2, 2);
    }

    // Aged parchment left and right pages
    pCtx.fillStyle = '#d5c5aa';
    pCtx.fillRect(12, 12, 222, 256); // Left page
    pCtx.fillRect(246, 12, 222, 256); // Right page

    // Subtle paper age stains / shadows
    pCtx.fillStyle = '#c2ae91';
    pCtx.fillRect(12, 12, 8, 256);
    pCtx.fillRect(460, 12, 8, 256);

    // Center book gutter shadow
    pCtx.fillStyle = '#1c120c';
    pCtx.fillRect(234, 8, 12, 264);
    pCtx.fillStyle = '#5a3d24';
    pCtx.fillRect(238, 10, 4, 260);

    // Red bookmark ribbon
    pCtx.fillStyle = '#7f1d1d';
    pCtx.fillRect(238, 0, 5, 120);
    pCtx.fillStyle = '#991b1b';
    pCtx.fillRect(239, 0, 3, 118);

    scene.textures.addCanvas('ui_notebook_page', pageCanvas);

    // 2. Inventory / Equipment Slot (36x36)
    const slotCanvas = document.createElement('canvas');
    slotCanvas.width = 36;
    slotCanvas.height = 36;
    const sCtx = slotCanvas.getContext('2d')!;

    sCtx.fillStyle = '#0d090d';
    sCtx.fillRect(0, 0, 36, 36);
    sCtx.fillStyle = '#5c4424';
    sCtx.fillRect(1, 1, 34, 34);
    sCtx.fillStyle = '#1a131a';
    sCtx.fillRect(3, 3, 30, 30);
    sCtx.fillStyle = '#2c202d';
    sCtx.fillRect(4, 4, 28, 28);
    // Brass corner rivets
    sCtx.fillStyle = '#d4af37';
    sCtx.fillRect(2, 2, 2, 2);
    sCtx.fillRect(32, 2, 2, 2);
    sCtx.fillRect(2, 32, 2, 2);
    sCtx.fillRect(32, 32, 2, 2);

    scene.textures.addCanvas('ui_slot', slotCanvas);

    // 3. Selected Slot Highlight (36x36)
    const selCanvas = document.createElement('canvas');
    selCanvas.width = 36;
    selCanvas.height = 36;
    const selCtx = selCanvas.getContext('2d')!;

    selCtx.fillStyle = '#f59e0b';
    selCtx.fillRect(0, 0, 36, 36);
    selCtx.fillStyle = '#fffbeb';
    selCtx.fillRect(2, 2, 32, 32);
    selCtx.clearRect(4, 4, 28, 28);

    scene.textures.addCanvas('ui_slot_selected', selCanvas);
  }

  public static generateClockPuzzleTextures(scene: Phaser.Scene): void {
    // 1. Clock Face (140x140)
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 140;
    faceCanvas.height = 140;
    const fCtx = faceCanvas.getContext('2d')!;

    const cx = 70;
    const cy = 70;

    // Brass outer bezel
    fCtx.fillStyle = '#3a2711';
    fCtx.beginPath();
    fCtx.arc(cx, cy, 68, 0, Math.PI * 2);
    fCtx.fill();

    fCtx.fillStyle = '#b48a4d';
    fCtx.beginPath();
    fCtx.arc(cx, cy, 64, 0, Math.PI * 2);
    fCtx.fill();

    // Dark antique face
    fCtx.fillStyle = '#161214';
    fCtx.beginPath();
    fCtx.arc(cx, cy, 58, 0, Math.PI * 2);
    fCtx.fill();

    // Minute tick marks around rim
    fCtx.fillStyle = '#d4af37';
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = cx + Math.sin(angle) * 50;
      const y1 = cy - Math.cos(angle) * 50;
      const x2 = cx + Math.sin(angle) * 55;
      const y2 = cy - Math.cos(angle) * 55;

      fCtx.lineWidth = (i % 3 === 0) ? 3 : 1;
      fCtx.strokeStyle = '#e9c46a';
      fCtx.beginPath();
      fCtx.moveTo(x1, y1);
      fCtx.lineTo(x2, y2);
      fCtx.stroke();
    }

    // Central brass arbor / rivet
    fCtx.fillStyle = '#d4af37';
    fCtx.beginPath();
    fCtx.arc(cx, cy, 7, 0, Math.PI * 2);
    fCtx.fill();
    fCtx.fillStyle = '#161214';
    fCtx.beginPath();
    fCtx.arc(cx, cy, 3, 0, Math.PI * 2);
    fCtx.fill();

    scene.textures.addCanvas('ui_clock_face', faceCanvas);

    // 2. Hour Hand (12x42)
    const hourCanvas = document.createElement('canvas');
    hourCanvas.width = 12;
    hourCanvas.height = 42;
    const hCtx = hourCanvas.getContext('2d')!;

    hCtx.fillStyle = '#2a1a0c';
    hCtx.fillRect(4, 8, 4, 30);
    hCtx.fillStyle = '#d4af37';
    hCtx.fillRect(5, 9, 2, 28);
    // Diamond spade head
    hCtx.fillStyle = '#f59e0b';
    hCtx.beginPath();
    hCtx.moveTo(6, 0);
    hCtx.lineTo(11, 8);
    hCtx.lineTo(6, 12);
    hCtx.lineTo(1, 8);
    hCtx.closePath();
    hCtx.fill();

    scene.textures.addCanvas('ui_clock_hand_hour', hourCanvas);

    // 3. Minute Hand (10x58)
    const minCanvas = document.createElement('canvas');
    minCanvas.width = 10;
    minCanvas.height = 58;
    const mCtx = minCanvas.getContext('2d')!;

    mCtx.fillStyle = '#2a1a0c';
    mCtx.fillRect(3, 10, 4, 44);
    mCtx.fillStyle = '#f59e0b';
    mCtx.fillRect(4, 11, 2, 42);
    // Sharp spear head
    mCtx.fillStyle = '#fde68a';
    mCtx.beginPath();
    mCtx.moveTo(5, 0);
    mCtx.lineTo(9, 10);
    mCtx.lineTo(1, 10);
    mCtx.closePath();
    mCtx.fill();

    scene.textures.addCanvas('ui_clock_hand_minute', minCanvas);
  }

  // --- Phase 5: Investigation & Puzzle Gameplay Textures ---

  private static generateSecretPassage(scene: Phaser.Scene): void {
    const w = 32;
    const h = 48;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Stone archway frame
    ctx.fillStyle = '#222026';
    ctx.fillRect(0, 0, w, h);

    // Weathered stone blocks
    ctx.fillStyle = '#3a353f';
    for (let y = 0; y < h; y += 8) {
      for (let x = 0; x < w; x += 10) {
        if (x > 4 && x < 24 && y > 10) continue; // Arch doorway void
        ctx.fillRect(x + 1, y + 1, 8, 6);
      }
    }

    // Inner arch opening (darkness descending)
    ctx.fillStyle = '#060408';
    ctx.beginPath();
    ctx.moveTo(5, h);
    ctx.lineTo(5, 14);
    ctx.bezierCurveTo(5, 4, 27, 4, 27, 14);
    ctx.lineTo(27, h);
    ctx.closePath();
    ctx.fill();

    // Stone steps descending into blackness
    ctx.fillStyle = '#17141c';
    ctx.fillRect(7, 34, 18, 4);
    ctx.fillStyle = '#100e14';
    ctx.fillRect(8, 38, 16, 4);
    ctx.fillStyle = '#0a080d';
    ctx.fillRect(9, 42, 14, 4);

    // Archway highlight & shadows
    ctx.strokeStyle = '#4a4452';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, w, h);

    scene.textures.addCanvas('obj_secret_passage', canvas);
  }

  private static generateCctvTextures(scene: Phaser.Scene): void {
    // 1. CCTV Monitor Frame (540x300)
    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = 540;
    frameCanvas.height = 300;
    const fCtx = frameCanvas.getContext('2d')!;

    // Console dark casing
    fCtx.fillStyle = '#121315';
    fCtx.fillRect(0, 0, 540, 300);

    // Outer beveled border
    fCtx.strokeStyle = '#2d3139';
    fCtx.lineWidth = 4;
    fCtx.strokeRect(2, 2, 536, 296);

    // Inner CRT screen housing (380x230 centered at 200, 150)
    fCtx.fillStyle = '#050706';
    fCtx.fillRect(20, 20, 380, 230);
    fCtx.strokeStyle = '#1b2620';
    fCtx.lineWidth = 3;
    fCtx.strokeRect(20, 20, 380, 230);

    // Right control panel (110px width)
    fCtx.fillStyle = '#1a1d22';
    fCtx.fillRect(415, 20, 105, 260);
    fCtx.strokeStyle = '#2f343e';
    fCtx.lineWidth = 2;
    fCtx.strokeRect(415, 20, 105, 260);

    // Rivets
    fCtx.fillStyle = '#424854';
    const rivets = [[8, 8], [532, 8], [8, 292], [532, 292], [410, 8], [410, 292]];
    rivets.forEach(([rx, ry]) => {
      fCtx.beginPath();
      fCtx.arc(rx, ry, 3, 0, Math.PI * 2);
      fCtx.fill();
    });

    // Console branding
    fCtx.fillStyle = '#7a8599';
    fCtx.font = 'bold 9px monospace';
    fCtx.fillText('BLACKWOOD CORP - CCTV MK IV', 24, 275);
    fCtx.fillText('STATUS: SECURE 24/7', 240, 275);

    scene.textures.addCanvas('ui_cctv_frame', frameCanvas);

    // 2. Camera Feeds (380x230 each)
    const feeds = [
      { key: 'cctv_feed_foyer', title: 'CAM 01: ENTRANCE HALL' },
      { key: 'cctv_feed_hallway', title: 'CAM 02: MAIN CORRIDOR' },
      { key: 'cctv_feed_library', title: 'CAM 03: ARCHIVE & LIBRARY' },
      { key: 'cctv_feed_courtyard', title: 'CAM 04: GOTHIC COURTYARD' },
      { key: 'cctv_feed_cellar_werewolf', title: 'CAM 05: SUB-CELLAR LAB' }
    ];

    feeds.forEach((feed, idx) => {
      const c = document.createElement('canvas');
      c.width = 380;
      c.height = 230;
      const ctx = c.getContext('2d')!;

      // Dark surveillance green/monochrome background
      const grad = ctx.createLinearGradient(0, 0, 0, 230);
      grad.addColorStop(0, '#09120c');
      grad.addColorStop(1, '#050a07');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 380, 230);

      // Environment silhouettes specific to each camera
      if (idx === 0) {
        // CAM 01: Foyer grand staircase & chandeliers
        ctx.fillStyle = '#0f1f15';
        ctx.fillRect(60, 80, 260, 150); // back wall
        ctx.fillStyle = '#172f20';
        // Stairs
        for (let s = 0; s < 8; s++) {
          ctx.fillRect(140 - s * 10, 160 + s * 8, 100 + s * 20, 8);
        }
        // Chandelier silhouette
        ctx.fillStyle = '#2d5238';
        ctx.fillRect(188, 20, 4, 35);
        ctx.fillRect(170, 55, 40, 6);
        ctx.fillStyle = '#e8ffb0';
        ctx.fillRect(174, 50, 4, 5);
        ctx.fillRect(202, 50, 4, 5);
      } else if (idx === 1) {
        // CAM 02: Main Corridor with claw marks & sconces
        ctx.fillStyle = '#111d16';
        ctx.beginPath();
        ctx.moveTo(50, 230);
        ctx.lineTo(130, 40);
        ctx.lineTo(250, 40);
        ctx.lineTo(330, 230);
        ctx.closePath();
        ctx.fill();
        // Claw marks on right wall
        ctx.strokeStyle = '#6e1f26';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(270, 80);
        ctx.lineTo(255, 120);
        ctx.moveTo(278, 82);
        ctx.lineTo(262, 122);
        ctx.moveTo(286, 85);
        ctx.lineTo(270, 125);
        ctx.stroke();
      } else if (idx === 2) {
        // CAM 03: Library arched shelves and moonlight
        ctx.fillStyle = '#0d1a12';
        ctx.fillRect(30, 30, 90, 170);
        ctx.fillRect(260, 30, 90, 170);
        // Books
        ctx.fillStyle = '#1d3827';
        for (let by = 40; by < 180; by += 22) {
          ctx.fillRect(35, by, 80, 18);
          ctx.fillRect(265, by, 80, 18);
        }
        // Desk
        ctx.fillStyle = '#152b1e';
        ctx.fillRect(150, 130, 80, 50);
      } else if (idx === 3) {
        // CAM 04: Gothic courtyard rain & lightning
        ctx.fillStyle = '#060d08';
        ctx.fillRect(0, 0, 380, 230);
        // Iron gate
        ctx.fillStyle = '#132419';
        for (let gx = 40; gx < 340; gx += 16) {
          ctx.fillRect(gx, 70, 4, 130);
        }
        ctx.fillRect(30, 110, 320, 6);
        ctx.fillRect(30, 160, 320, 6);
        // Rain streaks
        ctx.strokeStyle = '#274431';
        ctx.lineWidth = 1;
        for (let r = 0; r < 35; r++) {
          const rx = (r * 37) % 380;
          const ry = (r * 29) % 200;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 8, ry + 16);
          ctx.stroke();
        }
        // Werewolf silhouette lurking by the trees!
        ctx.fillStyle = '#020503';
        ctx.beginPath();
        ctx.ellipse(300, 140, 18, 30, 0.2, 0, Math.PI * 2);
        ctx.fill();
        // Wolf ears
        ctx.beginPath();
        ctx.moveTo(290, 115);
        ctx.lineTo(295, 100);
        ctx.lineTo(300, 115);
        ctx.lineTo(305, 100);
        ctx.lineTo(310, 115);
        ctx.fill();
      } else if (idx === 4) {
        // CAM 05: Sub-Cellar Laboratory & Mangled Cage with WEREWOLF
        ctx.fillStyle = '#070d09';
        ctx.fillRect(0, 0, 380, 230);
        // Broken cage bars bent outward
        ctx.strokeStyle = '#1d3324';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(80, 40); ctx.lineTo(80, 200);
        ctx.moveTo(110, 40); ctx.lineTo(135, 130); ctx.lineTo(110, 200); // bent
        ctx.moveTo(140, 40); ctx.lineTo(170, 120); ctx.lineTo(140, 200); // bent
        ctx.moveTo(270, 40); ctx.lineTo(270, 200);
        ctx.stroke();

        // THE BEAST: Terrifying lupine predator crouching
        ctx.fillStyle = '#0a140d';
        // Massive shoulders and torso
        ctx.beginPath();
        ctx.ellipse(200, 125, 36, 45, -0.1, 0, Math.PI * 2);
        ctx.fill();
        // Muscular arms and claws
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#0a140d';
        ctx.beginPath();
        ctx.moveTo(180, 105); ctx.lineTo(145, 155); ctx.lineTo(135, 185);
        ctx.moveTo(225, 105); ctx.lineTo(255, 155); ctx.lineTo(265, 185);
        ctx.stroke();
        // Beast head and snout
        ctx.fillStyle = '#0d1c12';
        ctx.beginPath();
        ctx.ellipse(195, 80, 18, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        // Snout
        ctx.beginPath();
        ctx.moveTo(185, 75); ctx.lineTo(165, 88); ctx.lineTo(195, 95);
        ctx.closePath();
        ctx.fill();
        // Pointed Wolf Ears
        ctx.beginPath();
        ctx.moveTo(185, 68); ctx.lineTo(180, 48); ctx.lineTo(192, 65);
        ctx.moveTo(200, 65); ctx.lineTo(210, 48); ctx.lineTo(214, 68);
        ctx.fill();
        // GLOWING FIERCE EYES (Amber/Red)
        ctx.fillStyle = '#ff3344';
        ctx.fillRect(178, 74, 5, 3);
        ctx.fillRect(194, 73, 5, 3);
        ctx.fillStyle = '#ffff66';
        ctx.fillRect(179, 75, 2, 2);
        ctx.fillRect(195, 74, 2, 2);
        // Fangs
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(172, 89, 2, 5);
        ctx.fillRect(178, 89, 2, 4);
      }

      // CRT Scanlines Overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      for (let y = 0; y < 230; y += 3) {
        ctx.fillRect(0, y, 380, 1);
      }

      // Vignette
      const vig = ctx.createRadialGradient(190, 115, 70, 190, 115, 210);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.65)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, 380, 230);

      // Camera HUD Overlay
      ctx.fillStyle = '#55d882';
      ctx.font = '10px monospace';
      ctx.fillText(feed.title, 12, 20);

      scene.textures.addCanvas(feed.key, c);
    });

    // 3. Static Grain Canvas (160x120)
    const staticCanvas = document.createElement('canvas');
    staticCanvas.width = 160;
    staticCanvas.height = 120;
    const sCtx = staticCanvas.getContext('2d')!;
    const imgData = sCtx.createImageData(160, 120);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const v = (Math.random() * 180) | 0;
      imgData.data[i] = v;
      imgData.data[i + 1] = v;
      imgData.data[i + 2] = v;
      imgData.data[i + 3] = 45; // subtle noise
    }
    sCtx.putImageData(imgData, 0, 0);
    scene.textures.addCanvas('cctv_static', staticCanvas);
  }

  private static generateBookshelfTextures(scene: Phaser.Scene): void {
    // 1. Bookshelf Modal Frame (460x240)
    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = 460;
    frameCanvas.height = 240;
    const ctx = frameCanvas.getContext('2d')!;

    // Rich dark mahogany wood
    ctx.fillStyle = '#22150f';
    ctx.fillRect(0, 0, 460, 240);

    // Carved wood molding
    ctx.fillStyle = '#3a2318';
    ctx.fillRect(8, 8, 444, 18);
    ctx.fillRect(8, 214, 444, 18);
    ctx.fillRect(8, 8, 18, 224);
    ctx.fillRect(434, 8, 18, 224);

    // Shelf interior backplate
    ctx.fillStyle = '#140c08';
    ctx.fillRect(26, 26, 408, 188);

    // Horizontal wooden shelf beam
    ctx.fillStyle = '#3a2318';
    ctx.fillRect(26, 175, 408, 15);
    ctx.fillStyle = '#4d3021';
    ctx.fillRect(26, 175, 408, 3);

    // Victorian floral trim
    ctx.strokeStyle = '#c5a07c';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 440, 220);

    scene.textures.addCanvas('ui_bookshelf_frame', frameCanvas);

    // 2. Five Grimoire Books
    const books = [
      { key: 'ui_book_0', title: 'I', color: '#543d2b', gold: '#c5a07c', w: 38, h: 110 },
      { key: 'ui_book_1', title: 'II', color: '#6e1f26', gold: '#e6c594', w: 42, h: 122 },
      { key: 'ui_book_2', title: 'III', color: '#1b4d3e', gold: '#c5a07c', w: 40, h: 116 },
      { key: 'ui_book_3', title: 'IV', color: '#16141a', gold: '#f59e0b', w: 44, h: 128 },
      { key: 'ui_book_4', title: 'V', color: '#1d2c4d', gold: '#c5a07c', w: 36, h: 108 }
    ];

    books.forEach(b => {
      const bc = document.createElement('canvas');
      bc.width = b.w;
      bc.height = b.h;
      const bCtx = bc.getContext('2d')!;

      // Leather spine
      bCtx.fillStyle = b.color;
      bCtx.fillRect(0, 0, b.w, b.h);

      // Spine ribbing
      bCtx.fillStyle = 'rgba(0,0,0,0.35)';
      bCtx.fillRect(0, 14, b.w, 4);
      bCtx.fillRect(0, b.h - 18, b.w, 4);
      bCtx.fillRect(0, b.h / 2, b.w, 3);

      // Gold filigree border
      bCtx.strokeStyle = b.gold;
      bCtx.lineWidth = 1.5;
      bCtx.strokeRect(3, 4, b.w - 6, b.h - 8);

      // Roman Numeral / Sigil
      bCtx.fillStyle = b.gold;
      bCtx.font = 'bold 13px serif';
      bCtx.textAlign = 'center';
      bCtx.fillText(b.title, b.w / 2, 45);

      scene.textures.addCanvas(b.key, bc);
    });
  }

  private static generateOccultPuzzleTextures(scene: Phaser.Scene): void {
    // 1. Outer Ring (180x180)
    const outerCanvas = document.createElement('canvas');
    outerCanvas.width = 180;
    outerCanvas.height = 180;
    const oCtx = outerCanvas.getContext('2d')!;
    const ocx = 90;
    const ocy = 90;

    oCtx.fillStyle = '#26242b';
    oCtx.beginPath();
    oCtx.arc(ocx, ocy, 88, 0, Math.PI * 2);
    oCtx.fill();

    oCtx.strokeStyle = '#433e4d';
    oCtx.lineWidth = 3;
    oCtx.stroke();

    // 8 Celestial Symbols around perimeter
    oCtx.fillStyle = '#d4af37';
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45 * Math.PI) / 180;
      const sx = ocx + Math.sin(angle) * 72;
      const sy = ocy - Math.cos(angle) * 72;

      oCtx.beginPath();
      if (i === 0) {
        // Full Moon (Target for Outer)
        oCtx.arc(sx, sy, 7, 0, Math.PI * 2);
        oCtx.fill();
      } else if (i === 4) {
        // Eclipse / Void
        oCtx.arc(sx, sy, 7, 0, Math.PI * 2);
        oCtx.stroke();
      } else {
        // Runes
        oCtx.arc(sx, sy, 4, 0, Math.PI * 2);
        oCtx.fill();
      }
    }

    scene.textures.addCanvas('ui_occult_ring_outer', outerCanvas);

    // 2. Middle Ring (124x124)
    const midCanvas = document.createElement('canvas');
    midCanvas.width = 124;
    midCanvas.height = 124;
    const mCtx = midCanvas.getContext('2d')!;
    const mcx = 62;
    const mcy = 62;

    mCtx.fillStyle = '#1c1a21';
    mCtx.beginPath();
    mCtx.arc(mcx, mcy, 60, 0, Math.PI * 2);
    mCtx.fill();

    mCtx.strokeStyle = '#5a4f66';
    mCtx.lineWidth = 2.5;
    mCtx.stroke();

    // 8 Middle Runes (Wolf Sigil at index 3)
    mCtx.fillStyle = '#e2ccaf';
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45 * Math.PI) / 180;
      const sx = mcx + Math.sin(angle) * 46;
      const sy = mcy - Math.cos(angle) * 46;

      if (i === 3) {
        // Wolf Head Rune (Target for Middle)
        mCtx.fillStyle = '#ef4444';
        mCtx.beginPath();
        mCtx.moveTo(sx, sy - 6);
        mCtx.lineTo(sx + 6, sy + 5);
        mCtx.lineTo(sx - 6, sy + 5);
        mCtx.closePath();
        mCtx.fill();
        mCtx.fillStyle = '#e2ccaf';
      } else {
        mCtx.fillRect(sx - 3, sy - 3, 6, 6);
      }
    }

    scene.textures.addCanvas('ui_occult_ring_mid', midCanvas);

    // 3. Inner Ring (72x72)
    const inCanvas = document.createElement('canvas');
    inCanvas.width = 72;
    inCanvas.height = 72;
    const iCtx = inCanvas.getContext('2d')!;
    const icx = 36;
    const icy = 36;

    iCtx.fillStyle = '#15131a';
    iCtx.beginPath();
    iCtx.arc(icx, icy, 34, 0, Math.PI * 2);
    iCtx.fill();

    iCtx.strokeStyle = '#6e5f80';
    iCtx.lineWidth = 2;
    iCtx.stroke();

    // 8 Inner Runes (Chalice at index 4)
    iCtx.fillStyle = '#c5a07c';
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45 * Math.PI) / 180;
      const sx = icx + Math.sin(angle) * 23;
      const sy = icy - Math.cos(angle) * 23;

      if (i === 4) {
        // Blood Chalice (Target for Inner)
        iCtx.fillStyle = '#dc2626';
        iCtx.beginPath();
        iCtx.arc(sx, sy, 4, 0, Math.PI);
        iCtx.fill();
        iCtx.fillRect(sx - 1, sy, 2, 4);
        iCtx.fillStyle = '#c5a07c';
      } else {
        iCtx.beginPath();
        iCtx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        iCtx.fill();
      }
    }

    scene.textures.addCanvas('ui_occult_ring_inner', inCanvas);

    // 4. Center Sigil Core (28x28)
    const coreCanvas = document.createElement('canvas');
    coreCanvas.width = 28;
    coreCanvas.height = 28;
    const cCtx = coreCanvas.getContext('2d')!;

    cCtx.fillStyle = '#3a080d';
    cCtx.beginPath();
    cCtx.arc(14, 14, 13, 0, Math.PI * 2);
    cCtx.fill();

    cCtx.fillStyle = '#ef4444';
    cCtx.beginPath();
    cCtx.arc(14, 14, 7, 0, Math.PI * 2);
    cCtx.fill();

    cCtx.strokeStyle = '#ffd700';
    cCtx.lineWidth = 1.5;
    cCtx.stroke();

    scene.textures.addCanvas('ui_occult_sigil_center', coreCanvas);
  }

  // --- Phase 6: Characters, Ghosts and Crime Scene Textures ---

  private static generateNpcSprites(scene: Phaser.Scene): void {
    const w = 20;
    const h = 30;

    const npcs = [
      {
        key: 'npc_victoria',
        draw: (ctx: CanvasRenderingContext2D) => {
          // Victoria Vance (Living)
          // Black mourning dress & skirt
          ctx.fillStyle = '#141018';
          ctx.fillRect(4, 14, 12, 16);
          // Velvet bodice & burgundy brooch
          ctx.fillStyle = '#221927';
          ctx.fillRect(5, 11, 10, 5);
          ctx.fillStyle = '#781d28';
          ctx.fillRect(9, 12, 2, 2);
          // Pale head & hair
          ctx.fillStyle = '#120e14';
          ctx.fillRect(6, 3, 8, 4); // Hair
          ctx.fillStyle = '#e5d3c5';
          ctx.fillRect(6, 6, 8, 5); // Face
          ctx.fillStyle = '#2a1a1f';
          ctx.fillRect(7, 8, 2, 1);
          ctx.fillRect(11, 8, 2, 1);
          // Black lace veil
          ctx.fillStyle = 'rgba(20, 15, 24, 0.7)';
          ctx.fillRect(5, 2, 10, 7);
        }
      },
      {
        key: 'npc_victoria_ghost',
        draw: (ctx: CanvasRenderingContext2D) => {
          // Victoria Vance (Ghost - Ethereal Purple/Cyan)
          // Glowing translucent spirit aura
          ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
          ctx.fillRect(2, 2, 16, 26);
          // Spectral gown
          ctx.fillStyle = 'rgba(147, 51, 234, 0.65)';
          ctx.fillRect(4, 14, 12, 16);
          // Dissolving hem
          ctx.fillStyle = '#c084fc';
          ctx.fillRect(5, 28, 2, 2);
          ctx.fillRect(9, 27, 2, 3);
          ctx.fillRect(13, 28, 2, 2);
          // Spectral face
          ctx.fillStyle = '#e9d5ff';
          ctx.fillRect(6, 6, 8, 6);
          ctx.fillStyle = '#581c87';
          ctx.fillRect(7, 8, 2, 2);
          ctx.fillRect(11, 8, 2, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(7, 8, 1, 1);
          ctx.fillRect(11, 8, 1, 1);
          // Soul mist
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(3, 10, 1, 4);
          ctx.fillRect(16, 12, 1, 5);
        }
      },
      {
        key: 'npc_edward',
        draw: (ctx: CanvasRenderingContext2D) => {
          // Edward Vance (Living)
          // Dark trousers & shoes
          ctx.fillStyle = '#16191f';
          ctx.fillRect(6, 19, 8, 11);
          // Emerald waistcoat & white shirt
          ctx.fillStyle = '#1e3a2b';
          ctx.fillRect(5, 10, 10, 9);
          ctx.fillStyle = '#f3f4f6';
          ctx.fillRect(8, 10, 4, 4); // Collar
          ctx.fillStyle = '#d4af37';
          ctx.fillRect(9, 13, 2, 2); // Gold pin
          // Head & hair
          ctx.fillStyle = '#3d2b1f';
          ctx.fillRect(6, 3, 8, 4); // Hair
          ctx.fillStyle = '#ddc5a2';
          ctx.fillRect(6, 6, 8, 5); // Face
          // Spectacles
          ctx.fillStyle = '#d4af37';
          ctx.fillRect(7, 7, 2, 2);
          ctx.fillRect(11, 7, 2, 2);
          ctx.fillRect(9, 8, 2, 1);
        }
      },
      {
        key: 'npc_edward_ghost',
        draw: (ctx: CanvasRenderingContext2D) => {
          // Edward Vance (Ghost - Ethereal Cyan/Blue)
          ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.fillRect(2, 2, 16, 26);
          // Spectral coat & trousers
          ctx.fillStyle = 'rgba(14, 116, 144, 0.65)';
          ctx.fillRect(5, 10, 10, 18);
          // Gaping chest claw lacerations (Glowing Spectral Red)
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(6, 13, 7, 1);
          ctx.fillRect(7, 15, 6, 1);
          // Spectral face & hair
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(6, 3, 8, 4);
          ctx.fillStyle = '#bae6fd';
          ctx.fillRect(6, 6, 8, 5);
          // Hollow glowing eyes
          ctx.fillStyle = '#0369a1';
          ctx.fillRect(7, 7, 2, 2);
          ctx.fillRect(11, 7, 2, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(7, 7, 1, 1);
          ctx.fillRect(11, 7, 1, 1);
          // Soul mist
          ctx.fillStyle = '#7dd3fc';
          ctx.fillRect(2, 14, 1, 5);
          ctx.fillRect(17, 16, 1, 5);
        }
      },
      {
        key: 'npc_hayes',
        draw: (ctx: CanvasRenderingContext2D) => {
          // Dr. Robert Hayes (Living)
          // Dark physician coat
          ctx.fillStyle = '#1c1f24';
          ctx.fillRect(5, 11, 10, 18);
          ctx.fillStyle = '#f8f9fa';
          ctx.fillRect(8, 10, 4, 3); // White high collar
          // Leather doctor's bag
          ctx.fillStyle = '#543419';
          ctx.fillRect(14, 17, 4, 5);
          // Head, silver-grey hair & beard
          ctx.fillStyle = '#64748b';
          ctx.fillRect(6, 3, 8, 4); // Hair
          ctx.fillStyle = '#caa992';
          ctx.fillRect(6, 6, 8, 5); // Face
          ctx.fillStyle = '#475569';
          ctx.fillRect(8, 10, 4, 2); // Beard
          // Spectacles
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(7, 7, 2, 1);
          ctx.fillRect(11, 7, 2, 1);
        }
      },
      {
        key: 'npc_hayes_ghost',
        draw: (ctx: CanvasRenderingContext2D) => {
          // Dr. Robert Hayes (Ghost - Ethereal Mint/Emerald)
          ctx.fillStyle = 'rgba(52, 211, 153, 0.25)';
          ctx.fillRect(2, 2, 16, 26);
          // Spectral coat
          ctx.fillStyle = 'rgba(5, 150, 105, 0.65)';
          ctx.fillRect(5, 11, 10, 18);
          // Pale spectral face & beard
          ctx.fillStyle = '#10b981';
          ctx.fillRect(6, 3, 8, 4);
          ctx.fillStyle = '#a7f3d0';
          ctx.fillRect(6, 6, 8, 5);
          ctx.fillStyle = '#047857';
          ctx.fillRect(8, 10, 4, 2);
          // Glowing eyes
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(7, 7, 1, 1);
          ctx.fillRect(11, 7, 1, 1);
        }
      },
      {
        key: 'npc_alistair_ghost',
        draw: (ctx: CanvasRenderingContext2D) => {
          // Lord Alistair Vance (Spectral Sovereign)
          ctx.fillStyle = 'rgba(45, 212, 191, 0.28)';
          ctx.fillRect(2, 2, 16, 26);
          // Aristocratic tailcoat dissolving into ether
          ctx.fillStyle = 'rgba(13, 148, 136, 0.7)';
          ctx.fillRect(5, 10, 10, 18);
          // Spectral gold medallion silhouette
          ctx.fillStyle = '#fde047';
          ctx.fillRect(9, 13, 2, 2);
          // Spectral face & flowing spectral hair
          ctx.fillStyle = '#14b8a6';
          ctx.fillRect(5, 2, 10, 5);
          ctx.fillStyle = '#ccfbf1';
          ctx.fillRect(6, 6, 8, 5);
          // Blazing turquoise eyes
          ctx.fillStyle = '#0f766e';
          ctx.fillRect(7, 7, 2, 2);
          ctx.fillRect(11, 7, 2, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(7, 7, 1, 1);
          ctx.fillRect(11, 7, 1, 1);
          // Soul tendrils
          ctx.fillStyle = '#5eead4';
          ctx.fillRect(2, 8, 1, 8);
          ctx.fillRect(17, 6, 1, 10);
        }
      }
    ];

    npcs.forEach(npc => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      npc.draw(ctx);
      scene.textures.addCanvas(npc.key, canvas);
    });
  }

  private static generateCrimeDecals(scene: Phaser.Scene): void {
    // Blood Pool Decal (32x20)
    const bloodCanvas = document.createElement('canvas');
    bloodCanvas.width = 32;
    bloodCanvas.height = 20;
    const ctx = bloodCanvas.getContext('2d')!;

    // Dark coagulated core
    ctx.fillStyle = '#3a080d';
    ctx.beginPath();
    ctx.ellipse(16, 11, 13, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fresh arterial crimson
    ctx.fillStyle = '#6e111a';
    ctx.beginPath();
    ctx.ellipse(15, 10, 10, 5, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Bright crimson highlights
    ctx.fillStyle = '#9e1a26';
    ctx.beginPath();
    ctx.ellipse(14, 9, 6, 3, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Splatter droplets
    ctx.fillStyle = '#6e111a';
    const spots = [[4, 6], [26, 8], [7, 16], [24, 15], [2, 12], [28, 4]];
    spots.forEach(([sx, sy]) => {
      ctx.fillRect(sx, sy, 2, 2);
    });

    scene.textures.addCanvas('blood_pool_decal', bloodCanvas);
  }

  // --- Phase 7: Werewolf Antagonist & Survival Horror Textures ---

  private static generateWerewolfSheet(scene: Phaser.Scene): void {
    const fw = 32;
    const fh = 40;
    const canvas = document.createElement('canvas');
    canvas.width = fw * 4;
    canvas.height = fh * 4;
    const ctx = canvas.getContext('2d')!;

    // Directions: 0 = Down, 1 = Left, 2 = Right, 3 = Up
    for (let dir = 0; dir < 4; dir++) {
      for (let f = 0; f < 4; f++) {
        const ox = f * fw;
        const oy = dir * fh;

        const legOffset = (f === 1) ? 3 : (f === 3) ? -3 : 0;
        const hunch = (f % 2 === 1) ? 1 : 0;

        // 1. Digitigrade Beast Legs (Dark charcoal fur with sharp claws)
        ctx.fillStyle = '#141116';
        if (dir === 0 || dir === 3) {
          ctx.fillRect(ox + 9, oy + 26 - hunch, 4, 11 + legOffset);
          ctx.fillRect(ox + 19, oy + 26 - hunch, 4, 11 - legOffset);
          // Dark razor talons
          ctx.fillStyle = '#08060a';
          ctx.fillRect(ox + 8, oy + 36 - hunch + Math.max(0, legOffset), 5, 3);
          ctx.fillRect(ox + 19, oy + 36 - hunch + Math.max(0, -legOffset), 5, 3);
        } else {
          ctx.fillRect(ox + 13 + legOffset, oy + 26 - hunch, 6, 11);
          ctx.fillStyle = '#08060a';
          ctx.fillRect(ox + 13 + legOffset, oy + 36 - hunch, 7, 3);
        }

        // 2. Tattered aristocrat trousers (Alistair's shredded evening wear)
        ctx.fillStyle = '#261b24';
        ctx.fillRect(ox + 8, oy + 22 - hunch, 16, 6);
        ctx.fillStyle = '#150f14';
        for (let t = 0; t < 16; t += 3) {
          ctx.fillRect(ox + 8 + t, oy + 27 - hunch, 2, 2);
        }

        // 3. Massive Muscular Torso & Hunched Shoulders
        ctx.fillStyle = '#1b171f';
        ctx.fillRect(ox + 7, oy + 10 - hunch, 18, 14);
        // Fur texture highlights
        ctx.fillStyle = '#2c2532';
        ctx.fillRect(ox + 8, oy + 11 - hunch, 16, 4);
        ctx.fillRect(ox + 10, oy + 16 - hunch, 12, 3);

        // 4. Heavy Predatory Arms with Razor Claws
        ctx.fillStyle = '#141116';
        if (dir === 0) {
          // Front View: Hanging muscular forearms
          ctx.fillRect(ox + 3, oy + 13 - hunch + legOffset, 5, 16);
          ctx.fillRect(ox + 24, oy + 13 - hunch - legOffset, 5, 16);
          // Claws
          ctx.fillStyle = '#5c4e56';
          ctx.fillRect(ox + 3, oy + 28 - hunch + legOffset, 5, 3);
          ctx.fillRect(ox + 24, oy + 28 - hunch - legOffset, 5, 3);
        } else if (dir === 1) {
          // Left view: Forward reaching predatory arm
          ctx.fillRect(ox + 2, oy + 14 - hunch + legOffset, 12, 6);
          ctx.fillStyle = '#5c4e56';
          ctx.fillRect(ox + 1, oy + 15 - hunch + legOffset, 3, 4);
        } else if (dir === 2) {
          // Right view: Forward reaching predatory arm
          ctx.fillRect(ox + 18, oy + 14 - hunch - legOffset, 12, 6);
          ctx.fillStyle = '#5c4e56';
          ctx.fillRect(ox + 28, oy + 15 - hunch - legOffset, 3, 4);
        } else if (dir === 3) {
          // Back view: Broad arched spine
          ctx.fillStyle = '#0f0c11';
          ctx.fillRect(ox + 14, oy + 10 - hunch, 4, 15);
        }

        // 5. Lupine Beast Head & Jaws
        ctx.fillStyle = '#1b171f';
        ctx.fillRect(ox + 10, oy + 4 - hunch, 12, 9);

        // Pointed Wolf Ears
        ctx.fillStyle = '#2c2532';
        ctx.beginPath();
        ctx.moveTo(ox + 10, oy + 4 - hunch);
        ctx.lineTo(ox + 9, oy - 2 - hunch);
        ctx.lineTo(ox + 14, oy + 3 - hunch);
        ctx.moveTo(ox + 18, oy + 3 - hunch);
        ctx.lineTo(ox + 23, oy - 2 - hunch);
        ctx.lineTo(ox + 22, oy + 4 - hunch);
        ctx.fill();

        // Directional Head Details
        if (dir === 0) {
          // Front Snout & Fangs
          ctx.fillStyle = '#0f0c11';
          ctx.fillRect(ox + 12, oy + 8 - hunch, 8, 5);
          // Fangs
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(ox + 13, oy + 12 - hunch, 2, 2);
          ctx.fillRect(ox + 17, oy + 12 - hunch, 2, 2);
          // Blazing Amber/Red Eyes
          ctx.fillStyle = '#ff2233';
          ctx.fillRect(ox + 11, oy + 6 - hunch, 3, 2);
          ctx.fillRect(ox + 18, oy + 6 - hunch, 3, 2);
          ctx.fillStyle = '#ffff66';
          ctx.fillRect(ox + 12, oy + 6 - hunch, 1, 1);
          ctx.fillRect(ox + 19, oy + 6 - hunch, 1, 1);
        } else if (dir === 1) {
          // Facing Left: Elongated Snout
          ctx.fillStyle = '#0f0c11';
          ctx.fillRect(ox + 5, oy + 7 - hunch, 8, 4);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(ox + 6, oy + 10 - hunch, 2, 2);
          // Left Eye
          ctx.fillStyle = '#ff2233';
          ctx.fillRect(ox + 10, oy + 5 - hunch, 3, 2);
          ctx.fillStyle = '#ffff66';
          ctx.fillRect(ox + 10, oy + 5 - hunch, 1, 1);
        } else if (dir === 2) {
          // Facing Right: Elongated Snout
          ctx.fillStyle = '#0f0c11';
          ctx.fillRect(ox + 19, oy + 7 - hunch, 8, 4);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(ox + 24, oy + 10 - hunch, 2, 2);
          // Right Eye
          ctx.fillStyle = '#ff2233';
          ctx.fillRect(ox + 19, oy + 5 - hunch, 3, 2);
          ctx.fillStyle = '#ffff66';
          ctx.fillRect(ox + 21, oy + 5 - hunch, 1, 1);
        } else if (dir === 3) {
          // Facing Up: Back of lupine mane
          ctx.fillStyle = '#0f0c11';
          ctx.fillRect(ox + 11, oy + 3 - hunch, 10, 8);
        }
      }
    }

    scene.textures.addSpriteSheet('werewolf_sheet', canvas as any, {
      frameWidth: fw,
      frameHeight: fh
    });
  }

  private static generateWardrobe(scene: Phaser.Scene): void {
    const w = 32;
    const h = 48;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Rich Dark Mahogany Frame
    ctx.fillStyle = '#22150f';
    ctx.fillRect(0, 0, w, h);

    // Carved molding top crown
    ctx.fillStyle = '#3a2318';
    ctx.fillRect(2, 2, 28, 6);
    ctx.fillStyle = '#4d3021';
    ctx.fillRect(4, 4, 24, 2);

    // Double doors
    ctx.fillStyle = '#1a100b';
    ctx.fillRect(3, 9, 12, 36);
    ctx.fillRect(17, 9, 12, 36);

    // Carved panel recesses
    ctx.fillStyle = '#291911';
    ctx.fillRect(5, 12, 8, 14);
    ctx.fillRect(5, 29, 8, 13);
    ctx.fillRect(19, 12, 8, 14);
    ctx.fillRect(19, 29, 8, 13);

    // Brass keyhole & door handles
    ctx.fillStyle = '#c5a07c';
    ctx.fillRect(13, 25, 2, 4);
    ctx.fillRect(17, 25, 2, 4);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(14, 26, 1, 1);
    ctx.fillRect(17, 26, 1, 1);

    // Wardrobe feet
    ctx.fillStyle = '#140c08';
    ctx.fillRect(2, 45, 6, 3);
    ctx.fillRect(24, 45, 6, 3);

    scene.textures.addCanvas('obj_wardrobe', canvas);
  }

  private static generateHorrorUiTextures(scene: Phaser.Scene): void {
    // 1. Alert Icon (18x18 diamond with red exclamation)
    const alertCanvas = document.createElement('canvas');
    alertCanvas.width = 18;
    alertCanvas.height = 18;
    const aCtx = alertCanvas.getContext('2d')!;

    aCtx.fillStyle = '#3a080d';
    aCtx.beginPath();
    aCtx.moveTo(9, 1);
    aCtx.lineTo(17, 9);
    aCtx.lineTo(9, 17);
    aCtx.lineTo(1, 9);
    aCtx.closePath();
    aCtx.fill();

    aCtx.strokeStyle = '#ef4444';
    aCtx.lineWidth = 1.5;
    aCtx.stroke();

    // Red exclamation mark
    aCtx.fillStyle = '#fee2e2';
    aCtx.fillRect(8, 4, 2, 6);
    aCtx.fillRect(8, 12, 2, 2);

    scene.textures.addCanvas('ui_alert_icon', alertCanvas);

    // 2. Eye Icon for Search State (18x18)
    const eyeCanvas = document.createElement('canvas');
    eyeCanvas.width = 18;
    eyeCanvas.height = 18;
    const eCtx = eyeCanvas.getContext('2d')!;

    eCtx.fillStyle = '#1e1b24';
    eCtx.beginPath();
    eCtx.arc(9, 9, 8, 0, Math.PI * 2);
    eCtx.fill();
    eCtx.strokeStyle = '#f59e0b';
    eCtx.lineWidth = 1;
    eCtx.stroke();

    // Eye shape
    eCtx.fillStyle = '#fef3c7';
    eCtx.beginPath();
    eCtx.ellipse(9, 9, 6, 3, 0, 0, Math.PI * 2);
    eCtx.fill();
    // Yellow pupil
    eCtx.fillStyle = '#d97706';
    eCtx.beginPath();
    eCtx.arc(9, 9, 2, 0, Math.PI * 2);
    eCtx.fill();

    scene.textures.addCanvas('ui_eye_icon', eyeCanvas);

    // 3. Blood Vignette Overlay (640x360)
    const vigCanvas = document.createElement('canvas');
    vigCanvas.width = 640;
    vigCanvas.height = 360;
    const vCtx = vigCanvas.getContext('2d')!;

    const grad = vCtx.createRadialGradient(320, 180, 150, 320, 180, 360);
    grad.addColorStop(0, 'rgba(110, 17, 26, 0)');
    grad.addColorStop(0.7, 'rgba(110, 17, 26, 0.45)');
    grad.addColorStop(1, 'rgba(60, 5, 10, 0.9)');
    vCtx.fillStyle = grad;
    vCtx.fillRect(0, 0, 640, 360);

    scene.textures.addCanvas('blood_vignette', vigCanvas);
  }

  /**
   * Phase 8: Narrative Epilogue Pixel Art Artwork Cards (280x160)
   */
  public static generateEndingTextures(scene: Phaser.Scene): void {
    const w = 280;
    const h = 160;

    // --- 1. Ending A: The Severed Curse (Dawn over Blackwood Manor) ---
    const dawnCanvas = document.createElement('canvas');
    dawnCanvas.width = w;
    dawnCanvas.height = h;
    const dCtx = dawnCanvas.getContext('2d')!;

    // Sunrise sky gradient
    const dGrad = dCtx.createLinearGradient(0, 0, 0, h);
    dGrad.addColorStop(0, '#0c0714');
    dGrad.addColorStop(0.35, '#2e1022');
    dGrad.addColorStop(0.6, '#7c2d12');
    dGrad.addColorStop(0.85, '#d97706');
    dGrad.addColorStop(1, '#fef08a');
    dCtx.fillStyle = dGrad;
    dCtx.fillRect(0, 0, w, h);

    // Sun disc at horizon
    dCtx.fillStyle = '#fef9c3';
    dCtx.beginPath();
    dCtx.arc(w / 2, h - 35, 36, 0, Math.PI * 2);
    dCtx.fill();

    // Golden sun rays radiating
    dCtx.fillStyle = 'rgba(254, 240, 138, 0.15)';
    for (let r = 0; r < 8; r++) {
      dCtx.beginPath();
      const angle = (r * Math.PI) / 8 + 0.1;
      dCtx.moveTo(w / 2, h - 35);
      dCtx.lineTo(w / 2 + Math.cos(angle) * 180, (h - 35) - Math.sin(angle) * 180);
      dCtx.lineTo(w / 2 + Math.cos(angle + 0.12) * 180, (h - 35) - Math.sin(angle + 0.12) * 180);
      dCtx.closePath();
      dCtx.fill();
    }

    // Distant mountain & pine tree ridges
    dCtx.fillStyle = '#1c0c16';
    dCtx.beginPath();
    dCtx.moveTo(0, h - 30);
    dCtx.lineTo(50, h - 50);
    dCtx.lineTo(110, h - 36);
    dCtx.lineTo(190, h - 55);
    dCtx.lineTo(w, h - 32);
    dCtx.lineTo(w, h);
    dCtx.lineTo(0, h);
    dCtx.closePath();
    dCtx.fill();

    // Blackwood Manor gothic silhouette
    dCtx.fillStyle = '#08040b';
    // Main hall
    dCtx.fillRect(w / 2 - 50, h - 75, 100, 55);
    // Left tower
    dCtx.fillRect(w / 2 - 62, h - 95, 24, 75);
    dCtx.beginPath();
    dCtx.moveTo(w / 2 - 66, h - 95);
    dCtx.lineTo(w / 2 - 50, h - 120);
    dCtx.lineTo(w / 2 - 34, h - 95);
    dCtx.closePath();
    dCtx.fill();
    // Right tower
    dCtx.fillRect(w / 2 + 38, h - 95, 24, 75);
    dCtx.beginPath();
    dCtx.moveTo(w / 2 + 34, h - 95);
    dCtx.lineTo(w / 2 + 50, h - 120);
    dCtx.lineTo(w / 2 + 66, h - 95);
    dCtx.closePath();
    dCtx.fill();
    // Central clock tower
    dCtx.fillRect(w / 2 - 14, h - 110, 28, 90);
    dCtx.beginPath();
    dCtx.moveTo(w / 2 - 18, h - 110);
    dCtx.lineTo(w / 2, h - 138);
    dCtx.lineTo(w / 2 + 18, h - 110);
    dCtx.closePath();
    dCtx.fill();

    // Morning golden window reflections
    dCtx.fillStyle = '#fef08a';
    dCtx.fillRect(w / 2 - 6, h - 90, 12, 16);
    dCtx.fillRect(w / 2 - 38, h - 65, 8, 12);
    dCtx.fillRect(w / 2 + 30, h - 65, 8, 12);

    // Rising golden morning mist
    dCtx.fillStyle = 'rgba(254, 243, 199, 0.2)';
    dCtx.fillRect(0, h - 25, w, 25);
    dCtx.fillStyle = 'rgba(254, 243, 199, 0.12)';
    dCtx.fillRect(0, h - 40, w, 18);

    // Ornate pixel border
    dCtx.strokeStyle = '#92400e';
    dCtx.lineWidth = 2;
    dCtx.strokeRect(1, 1, w - 2, h - 2);
    dCtx.strokeStyle = '#451a03';
    dCtx.strokeRect(3, 3, w - 6, h - 6);

    scene.textures.addCanvas('ending_dawn', dawnCanvas);

    // --- 2. Ending B: The Hollow Heir (Blood Moon & Beast Transference) ---
    const beastCanvas = document.createElement('canvas');
    beastCanvas.width = w;
    beastCanvas.height = h;
    const bCtx = beastCanvas.getContext('2d')!;

    // Eerie crimson night sky
    const bGrad = bCtx.createLinearGradient(0, 0, 0, h);
    bGrad.addColorStop(0, '#030104');
    bGrad.addColorStop(0.4, '#1a0408');
    bGrad.addColorStop(0.75, '#450a0a');
    bGrad.addColorStop(1, '#1e0508');
    bCtx.fillStyle = bGrad;
    bCtx.fillRect(0, 0, w, h);

    // Giant Blood Moon
    bCtx.fillStyle = '#7f1d1d';
    bCtx.beginPath();
    bCtx.arc(w / 2 + 35, 60, 42, 0, Math.PI * 2);
    bCtx.fill();
    bCtx.fillStyle = '#991b1b';
    bCtx.beginPath();
    bCtx.arc(w / 2 + 33, 58, 38, 0, Math.PI * 2);
    bCtx.fill();
    bCtx.fillStyle = '#dc2626';
    bCtx.beginPath();
    bCtx.arc(w / 2 + 30, 56, 32, 0, Math.PI * 2);
    bCtx.fill();
    // Craters
    bCtx.fillStyle = '#450a0a';
    bCtx.beginPath();
    bCtx.arc(w / 2 + 20, 50, 8, 0, Math.PI * 2);
    bCtx.arc(w / 2 + 38, 68, 10, 0, Math.PI * 2);
    bCtx.arc(w / 2 + 45, 45, 6, 0, Math.PI * 2);
    bCtx.fill();

    // Rocky cliff & gargoyle battlement
    bCtx.fillStyle = '#0a0305';
    bCtx.beginPath();
    bCtx.moveTo(0, h - 10);
    bCtx.lineTo(40, h - 45);
    bCtx.lineTo(95, h - 35);
    bCtx.lineTo(135, h - 80);
    bCtx.lineTo(w / 2 + 10, h - 65);
    bCtx.lineTo(w, h - 40);
    bCtx.lineTo(w, h);
    bCtx.lineTo(0, h);
    bCtx.closePath();
    bCtx.fill();

    // Transformed Detective silhouette (hunched werewolf form clutching fedora)
    bCtx.fillStyle = '#000000';
    const wx = w / 2 - 30;
    const wy = h - 65;
    // Torso & hunched shoulders
    bCtx.beginPath();
    bCtx.ellipse(wx, wy - 30, 22, 28, -0.2, 0, Math.PI * 2);
    bCtx.fill();
    // Head & wolf muzzle howling
    bCtx.beginPath();
    bCtx.moveTo(wx - 6, wy - 52);
    bCtx.lineTo(wx + 10, wy - 70);
    bCtx.lineTo(wx + 18, wy - 66);
    bCtx.lineTo(wx + 12, wy - 50);
    bCtx.closePath();
    bCtx.fill();
    // Upright ears
    bCtx.fillRect(wx - 2, wy - 74, 5, 8);
    bCtx.fillRect(wx + 6, wy - 76, 5, 8);
    // Arms with razor claws
    bCtx.lineWidth = 6;
    bCtx.strokeStyle = '#000000';
    bCtx.beginPath();
    bCtx.moveTo(wx + 12, wy - 35);
    bCtx.lineTo(wx + 34, wy - 48);
    bCtx.lineTo(wx + 44, wy - 42);
    bCtx.stroke();
    // Glowing red predator eyes
    bCtx.fillStyle = '#f59e0b';
    bCtx.fillRect(wx + 7, wy - 58, 3, 2);
    bCtx.fillStyle = '#ef4444';
    bCtx.fillRect(wx + 9, wy - 58, 2, 2);

    // Dropped Detective fedora on rock
    bCtx.fillStyle = '#221510';
    bCtx.fillRect(wx - 36, wy - 6, 18, 5);
    bCtx.fillRect(wx - 32, wy - 11, 10, 6);
    bCtx.fillStyle = '#6e1d24'; // crimson hat band
    bCtx.fillRect(wx - 32, wy - 7, 10, 2);

    // Border
    bCtx.strokeStyle = '#7f1d1d';
    bCtx.lineWidth = 2;
    bCtx.strokeRect(1, 1, w - 2, h - 2);
    bCtx.strokeStyle = '#450a0a';
    bCtx.strokeRect(3, 3, w - 6, h - 6);

    scene.textures.addCanvas('ending_beast', beastCanvas);

    // --- 3. Ending C: Ash and Memory (Inferno consuming Blackwood Manor) ---
    const fireCanvas = document.createElement('canvas');
    fireCanvas.width = w;
    fireCanvas.height = h;
    const fCtx = fireCanvas.getContext('2d')!;

    // Choked smoke & fire sky gradient
    const fGrad = fCtx.createLinearGradient(0, 0, 0, h);
    fGrad.addColorStop(0, '#040203');
    fGrad.addColorStop(0.35, '#1e0502');
    fGrad.addColorStop(0.65, '#7c2d12');
    fGrad.addColorStop(0.85, '#ea580c');
    fGrad.addColorStop(1, '#ffedd5');
    fCtx.fillStyle = fGrad;
    fCtx.fillRect(0, 0, w, h);

    // Burning Manor silhouette
    fCtx.fillStyle = '#090302';
    fCtx.fillRect(w / 2 - 60, h - 85, 120, 65);
    // Collapsing central clock tower
    fCtx.fillRect(w / 2 - 16, h - 115, 32, 95);
    fCtx.fillRect(w / 2 - 68, h - 100, 26, 80);
    fCtx.fillRect(w / 2 + 42, h - 100, 26, 80);

    // Roaring orange & yellow fire tongues bursting through windows and roof
    const flameColors = ['#dc2626', '#ea580c', '#f59e0b', '#fef08a'];
    for (let f = 0; f < 36; f++) {
      const fx = w / 2 - 70 + Math.random() * 140;
      const fy = h - 20 - Math.random() * 95;
      const fSize = 4 + Math.random() * 14;
      fCtx.fillStyle = flameColors[Math.floor(Math.random() * flameColors.length)];
      fCtx.beginPath();
      fCtx.arc(fx, fy, fSize, 0, Math.PI * 2);
      fCtx.fill();
    }

    // Floating burning spark embers ascending
    for (let e = 0; e < 45; e++) {
      const ex = Math.random() * w;
      const ey = Math.random() * (h - 20);
      fCtx.fillStyle = Math.random() > 0.4 ? '#fde047' : '#f97316';
      fCtx.fillRect(ex, ey, 2, 2);
    }

    // Foreground charred wrought iron gate
    fCtx.fillStyle = '#050201';
    fCtx.fillRect(0, h - 16, w, 16);
    for (let g = 10; g < w; g += 16) {
      fCtx.fillRect(g, h - 34, 3, 20);
      // Spike tip
      fCtx.fillRect(g - 1, h - 38, 5, 4);
      fCtx.fillRect(g, h - 41, 3, 3);
    }

    // Border
    fCtx.strokeStyle = '#c2410c';
    fCtx.lineWidth = 2;
    fCtx.strokeRect(1, 1, w - 2, h - 2);
    fCtx.strokeStyle = '#7c2d12';
    fCtx.strokeRect(3, 3, w - 6, h - 6);

    scene.textures.addCanvas('ending_fire', fireCanvas);
  }
}
