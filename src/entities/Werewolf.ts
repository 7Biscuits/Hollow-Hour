import Phaser from 'phaser';
import { Detective, FacingDirection } from './Detective';
import { AudioManager } from '../audio/AudioManager';
import { LightingSystem } from '../world/LightingSystem';

export type WerewolfState = 'dormant' | 'patrol' | 'investigate' | 'detected' | 'chase' | 'attack' | 'search';

export interface WerewolfConfig {
  x: number;
  y: number;
  roomId: string;
  patrolPoints?: { x: number; y: number }[];
  initialState?: WerewolfState;
}

export class Werewolf extends Phaser.Physics.Arcade.Sprite {
  public currentState: WerewolfState = 'patrol';
  public roomId: string;

  private patrolPoints: { x: number; y: number }[] = [];
  private currentPatrolIndex: number = 0;
  private targetPos: { x: number; y: number } | null = null;

  private patrolSpeed = 48;
  private chaseSpeed = 125;
  private investigateSpeed = 70;

  private alertDuration = 600; // ms in 'detected' before chase
  private alertTimer = 0;

  private searchDuration = 3200; // ms searching after losing sight
  private searchTimer = 0;

  private attackCooldown = 1200; // ms between attacks
  private attackTimer = 0;

  private visionRange = 135;
  private visionAngle = 80; // degrees
  private hearingRangeRunning = 150;
  private hearingRangeWalking = 45;

  private currentFacing: FacingDirection = 'down';
  private alertIcon: Phaser.GameObjects.Image;
  private eyeIcon: Phaser.GameObjects.Image;

  private audio: AudioManager;
  private growlTimer = 0;

  constructor(scene: Phaser.Scene, config: WerewolfConfig) {
    super(scene, config.x, config.y, 'werewolf_sheet', 0);
    this.roomId = config.roomId;
    this.currentState = config.initialState || 'patrol';
    this.patrolPoints = config.patrolPoints || [{ x: config.x, y: config.y }];
    this.audio = AudioManager.getInstance();

    scene.add.existing(this as any);
    scene.physics.add.existing(this as any);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(18, 14);
    body.setOffset(7, 24);
    body.setCollideWorldBounds(true);

    this.play('werewolf_idle_down');

    // Alert & Search Over-head Icons
    this.alertIcon = scene.add.image(this.x, this.y - 28, 'ui_alert_icon').setVisible(false).setDepth(2000);
    this.eyeIcon = scene.add.image(this.x, this.y - 28, 'ui_eye_icon').setVisible(false).setDepth(2000);
  }

  public setPatrolRoute(points: { x: number; y: number }[]): void {
    this.patrolPoints = points;
    this.currentPatrolIndex = 0;
  }

  public override setState(state: string | number): this {
    return this.setAIState(state as WerewolfState);
  }

  public setAIState(state: WerewolfState): this {
    if (this.currentState === state) return this;
    this.currentState = state;

    if (state === 'detected') {
      this.alertTimer = this.alertDuration;
      this.audio.playWerewolfHowl();
      this.alertIcon.setVisible(true);
      this.eyeIcon.setVisible(false);
    } else if (state === 'chase') {
      this.alertIcon.setVisible(true);
      this.eyeIcon.setVisible(false);
      this.audio.playWerewolfGrowl();
    } else if (state === 'search') {
      this.searchTimer = this.searchDuration;
      this.alertIcon.setVisible(false);
      this.eyeIcon.setVisible(true);
    } else {
      this.alertIcon.setVisible(false);
      this.eyeIcon.setVisible(false);
    }
    return this;
  }

  public investigatePosition(x: number, y: number): void {
    if (this.currentState === 'chase' || this.currentState === 'attack') return;
    this.targetPos = { x, y };
    this.setAIState('investigate');
  }

  public updateAI(
    _time: number,
    delta: number,
    player: Detective,
    walls: Phaser.Physics.Arcade.StaticGroup,
    lighting?: LightingSystem
  ): void {
    this.setDepth(this.y + 16);

    // Keep state icons aligned above head
    this.alertIcon.setPosition(this.x, this.y - 28);
    this.eyeIcon.setPosition(this.x, this.y - 28);

    if (this.currentState === 'dormant') {
      if (this.body) this.setVelocity(0, 0);
      return;
    }

    if (this.attackTimer > 0) this.attackTimer -= delta;

    // Ambient growl timer in hunt/chase
    this.growlTimer += delta;
    if (this.growlTimer > 6000 && (this.currentState === 'patrol' || this.currentState === 'search')) {
      this.growlTimer = 0;
      this.audio.playWerewolfGrowl();
    }

    const distToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

    // 1. Sensory Detection Checks
    const canSensePlayer = this.checkSensoryDetection(player, distToPlayer, walls);

    // 2. State Machine Execution
    switch (this.currentState) {
      case 'patrol':
        if (canSensePlayer) {
          this.setState('detected');
          this.targetPos = { x: player.x, y: player.y };
        } else {
          this.executePatrol();
        }
        break;

      case 'investigate':
        if (canSensePlayer) {
          this.setState('detected');
          this.targetPos = { x: player.x, y: player.y };
        } else {
          this.executeMoveToTarget(this.investigateSpeed, () => {
            this.setState('search');
          });
        }
        break;

      case 'detected':
        this.setVelocity(0, 0);
        this.alertTimer -= delta;
        this.faceTowards(player.x, player.y);
        if (this.alertTimer <= 0) {
          this.setState('chase');
        }
        break;

      case 'chase':
        if (player.getIsHiding()) {
          // Player hid, switch to search at last seen position
          this.targetPos = { x: player.x, y: player.y };
          this.setState('search');
          break;
        }

        // Close enough for melee attack?
        if (distToPlayer <= 26) {
          this.executeAttack(player);
        } else {
          // Pursue player
          this.moveTowards(player.x, player.y, this.chaseSpeed);

          // If line of sight lost and distance large, lose pursuit
          if (!canSensePlayer && distToPlayer > 160) {
            this.targetPos = { x: player.x, y: player.y };
            this.setState('search');
          }
        }
        break;

      case 'attack':
        // Lunging melee attack pause
        this.setVelocity(0, 0);
        if (this.attackTimer <= 600) {
          this.setState('chase');
        }
        break;

      case 'search':
        this.searchTimer -= delta;
        if (canSensePlayer && !player.getIsHiding()) {
          this.setState('detected');
        } else if (this.searchTimer <= 0) {
          this.setState('patrol');
        } else {
          // Walk around slowly in search
          this.executeMoveToTarget(this.patrolSpeed);
        }
        break;
    }

    // Register glowing predator eye halo with LightingSystem
    if (lighting) {
      lighting.registerLightSource(this.x, this.y - 12, 0.35, 0.45);
    }
  }

  private checkSensoryDetection(
    player: Detective,
    dist: number,
    walls: Phaser.Physics.Arcade.StaticGroup
  ): boolean {
    if (player.getIsHiding()) {
      return false;
    }

    // Audio Hearing: Running makes noise detectable through walls
    if (player.isRunning() && dist <= this.hearingRangeRunning) {
      return true;
    }
    if (player.isMoving() && dist <= this.hearingRangeWalking) {
      return true;
    }

    // Vision Check: Forward vision cone and raycast line-of-sight
    if (dist <= this.visionRange) {
      const angleToPlayer = Phaser.Math.RadToDeg(
        Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y)
      );

      let facingAngle = 90; // down
      if (this.currentFacing === 'up') facingAngle = -90;
      else if (this.currentFacing === 'left') facingAngle = 180;
      else if (this.currentFacing === 'right') facingAngle = 0;

      const angleDiff = Math.abs(Phaser.Math.Angle.ShortestBetween(facingAngle, angleToPlayer));

      if (angleDiff <= this.visionAngle / 2) {
        // Line of sight check against walls
        const hasLoS = this.checkLineOfSight(player, walls);
        if (hasLoS) return true;
      }
    }

    return false;
  }

  private checkLineOfSight(player: Detective, walls: Phaser.Physics.Arcade.StaticGroup): boolean {
    const ray = new Phaser.Geom.Line(this.x, this.y, player.x, player.y);
    const wallChildren = walls.getChildren();

    for (const child of wallChildren) {
      const rect = (child as any).getBounds ? (child as any).getBounds() : null;
      if (rect && Phaser.Geom.Intersects.LineToRectangle(ray, rect)) {
        return false; // Obstructed by wall
      }
    }
    return true;
  }

  private executePatrol(): void {
    if (this.patrolPoints.length === 0) return;

    const currentPoint = this.patrolPoints[this.currentPatrolIndex];
    const dist = Phaser.Math.Distance.Between(this.x, this.y, currentPoint.x, currentPoint.y);

    if (dist <= 14) {
      // Advance to next patrol point
      this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
    } else {
      this.moveTowards(currentPoint.x, currentPoint.y, this.patrolSpeed);
    }
  }

  private executeMoveToTarget(speed: number, onArrival?: () => void): void {
    if (!this.targetPos) {
      this.setVelocity(0, 0);
      return;
    }

    const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetPos.x, this.targetPos.y);
    if (dist <= 14) {
      this.targetPos = null;
      this.setVelocity(0, 0);
      if (onArrival) onArrival();
    } else {
      this.moveTowards(this.targetPos.x, this.targetPos.y, speed);
    }
  }

  private moveTowards(tx: number, ty: number, speed: number): void {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, tx, ty);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    this.setVelocity(vx, vy);
    this.faceTowards(tx, ty);

    this.play(`werewolf_walk_${this.currentFacing}`, true);
  }

  private faceTowards(tx: number, ty: number): void {
    const dx = tx - this.x;
    const dy = ty - this.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.currentFacing = dx < 0 ? 'left' : 'right';
    } else {
      this.currentFacing = dy < 0 ? 'up' : 'down';
    }
  }

  private executeAttack(player: Detective): void {
    if (this.attackTimer > 0) return;

    this.attackTimer = this.attackCooldown;
    this.currentState = 'attack';

    // Deal damage to Detective
    player.damage(25);

    // Screen shake
    this.scene.cameras.main.shake(220, 0.012);
  }

  public destroy(fromScene?: boolean): void {
    if (this.alertIcon) this.alertIcon.destroy();
    if (this.eyeIcon) this.eyeIcon.destroy();
    super.destroy(fromScene);
  }
}
