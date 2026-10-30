import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';

export type FacingDirection = 'down' | 'left' | 'right' | 'up';

export class Detective extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    SHIFT: Phaser.Input.Keyboard.Key;
  };
  private currentFacing: FacingDirection = 'down';
  private walkSpeed = 95;
  private runSpeed = 140;
  private isMovementLocked = false;
  private footstepTimer = 0;
  private audioManager: AudioManager;

  private health: number = 100;
  private maxHealth: number = 100;
  private isHiding: boolean = false;
  private isInvulnerable: boolean = false;
  private invulnerableTimer: number = 0;
  private isRunningState: boolean = false;
  private isMovingState: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'detective_sheet', 0);
    this.audioManager = AudioManager.getInstance();

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Collision box aligned to feet
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(14, 10);
    body.setOffset(5, 22);
    body.setCollideWorldBounds(true);

    this.setupInput(scene);
    this.play('detective_idle_down');
  }

  private setupInput(scene: Phaser.Scene): void {
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.wasd = {
        W: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        SHIFT: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
      };
    }
  }

  public lockMovement(locked: boolean): void {
    this.isMovementLocked = locked;
    if (locked && this.body) {
      this.setVelocity(0, 0);
      this.play(`detective_idle_${this.currentFacing}`, true);
    }
  }

  public getFacing(): FacingDirection {
    return this.currentFacing;
  }

  public setFacing(direction: FacingDirection): void {
    this.currentFacing = direction;
    this.play(`detective_idle_${direction}`, true);
  }

  public getHealth(): number {
    return this.health;
  }

  public getMaxHealth(): number {
    return this.maxHealth;
  }

  public setHealth(val: number): void {
    this.health = Math.max(0, Math.min(this.maxHealth, val));
  }

  public damage(amount: number): { remainingHealth: number; isDead: boolean } {
    if (this.isInvulnerable || this.health <= 0) {
      return { remainingHealth: this.health, isDead: this.health <= 0 };
    }

    this.health = Math.max(0, this.health - amount);
    this.isInvulnerable = true;
    this.invulnerableTimer = 1000;

    this.audioManager.playDamageLaceration();

    return { remainingHealth: this.health, isDead: this.health <= 0 };
  }

  public heal(amount: number): number {
    this.health = Math.min(this.maxHealth, this.health + amount);
    this.audioManager.playSelect();
    return this.health;
  }

  public setHiding(hiding: boolean): void {
    this.isHiding = hiding;
    this.setVisible(!hiding);
    this.lockMovement(hiding);
    if (hiding && this.body) {
      this.setVelocity(0, 0);
    }
  }

  public getIsHiding(): boolean {
    return this.isHiding;
  }

  public isRunning(): boolean {
    return this.isRunningState;
  }

  public isMoving(): boolean {
    return this.isMovingState;
  }

  public update(time: number, delta: number): void {
    // Dynamic depth sorting based on foot position
    this.setDepth(this.y);

    // Invulnerability flashing
    if (this.isInvulnerable) {
      this.invulnerableTimer -= delta;
      this.setAlpha((Math.floor(time / 80) % 2 === 0) ? 0.35 : 1.0);
      if (this.invulnerableTimer <= 0) {
        this.isInvulnerable = false;
        this.setAlpha(1.0);
      }
    }

    if (this.isMovementLocked || !this.body || this.isHiding) {
      this.isMovingState = false;
      this.isRunningState = false;
      return;
    }

    let vx = 0;
    let vy = 0;

    // Detect Input
    const left = this.cursors?.left?.isDown || this.wasd?.A?.isDown;
    const right = this.cursors?.right?.isDown || this.wasd?.D?.isDown;
    const up = this.cursors?.up?.isDown || this.wasd?.W?.isDown;
    const down = this.cursors?.down?.isDown || this.wasd?.S?.isDown;
    const running = this.wasd?.SHIFT?.isDown;

    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;

    this.isMovingState = (vx !== 0 || vy !== 0);
    this.isRunningState = this.isMovingState && Boolean(running);

    // Movement speed
    const currentSpeed = running ? this.runSpeed : this.walkSpeed;

    if (vx !== 0 && vy !== 0) {
      // Normalize diagonal movement
      vx *= Math.SQRT1_2;
      vy *= Math.SQRT1_2;
    }

    this.setVelocity(vx * currentSpeed, vy * currentSpeed);

    // Update Facing & Animations
    if (vx !== 0 || vy !== 0) {
      if (Math.abs(vx) > Math.abs(vy)) {
        this.currentFacing = vx < 0 ? 'left' : 'right';
      } else {
        this.currentFacing = vy < 0 ? 'up' : 'down';
      }

      this.play(`detective_walk_${this.currentFacing}`, true);

      // Footstep sound tick
      this.footstepTimer += delta;
      const stepInterval = running ? 260 : 380;
      if (this.footstepTimer >= stepInterval) {
        this.footstepTimer = 0;
        this.audioManager.playHover(); // Soft wooden click
      }
    } else {
      this.play(`detective_idle_${this.currentFacing}`, true);
      this.footstepTimer = 0;
    }
  }
}
