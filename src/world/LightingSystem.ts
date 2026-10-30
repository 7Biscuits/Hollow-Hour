import Phaser from 'phaser';
import { Detective } from '../entities/Detective';

export class LightingSystem {
  private scene: Phaser.Scene;
  private darkness!: Phaser.GameObjects.RenderTexture;
  private playerLight!: Phaser.GameObjects.Image;
  private sconceLightStamp!: Phaser.GameObjects.Image;
  private sconcePositions: { x: number; y: number; scale: number }[] = [];
  private ambientGlows: Phaser.GameObjects.Image[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const { width, height } = scene.scale;

    // RenderTexture added directly to scene display list above room objects, below UI
    this.darkness = scene.add.renderTexture(0, 0, width, height);
    this.darkness.setOrigin(0, 0);
    this.darkness.setDepth(900);
    this.darkness.setAlpha(0.82);

    // Light stamps created offscreen
    this.playerLight = scene.make.image({ key: 'light_cone' }, false);
    this.playerLight.setScale(1.4);
    this.playerLight.setOrigin(0.5, 0.5);

    this.sconceLightStamp = scene.make.image({ key: 'window_glow' }, false);
    this.sconceLightStamp.setOrigin(0.5, 0.5);
  }

  public registerLightSource(x: number, y: number, scale = 0.65, intensity = 0.75): void {
    this.sconcePositions.push({ x, y, scale });

    // Ambient warm halo visible in world
    const worldGlow = this.scene.add.image(x, y, 'window_glow');
    worldGlow.setScale(scale * 0.6);
    worldGlow.setAlpha(intensity * 0.6);
    worldGlow.setBlendMode(Phaser.BlendModes.ADD);
    worldGlow.setDepth(y);
    this.ambientGlows.push(worldGlow);

    // Subtle flicker tween
    this.scene.tweens.add({
      targets: worldGlow,
      alpha: { from: intensity * 0.45, to: intensity * 0.75 },
      scale: { from: scale * 0.55, to: scale * 0.65 },
      duration: 200 + Math.random() * 250,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  public clearLights(): void {
    this.ambientGlows.forEach(g => g.destroy());
    this.ambientGlows = [];
    this.sconcePositions = [];
  }

  public update(player: Detective): void {
    this.darkness.clear();
    // Fill with cold oppressive darkness
    this.darkness.fill(0x060408, 0.95);

    // Flashlight beam offset towards facing direction
    const facing = player.getFacing();
    let lx = player.x;
    let ly = player.y + 10;

    switch (facing) {
      case 'down': ly += 16; break;
      case 'up': ly -= 16; break;
      case 'left': lx -= 16; break;
      case 'right': lx += 16; break;
    }

    this.playerLight.setPosition(lx, ly);
    this.darkness.erase(this.playerLight, lx, ly);

    // Sconces & environmental light sources
    this.sconcePositions.forEach(src => {
      this.sconceLightStamp.setScale(src.scale * 1.5);
      this.darkness.erase(this.sconceLightStamp, src.x, src.y);
    });
  }
}
