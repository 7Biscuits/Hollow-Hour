import Phaser from 'phaser';

export interface InteractiveObjectConfig {
  x: number;
  y: number;
  texture: string;
  id: string;
  name: string;
  description: string;
  details?: string[];
  clueId?: string;
  isDoor?: boolean;
  targetRoom?: string;
  targetSpawn?: { x: number; y: number };
  isLocked?: boolean;
  requiredKey?: string;
  lockedMessage?: string;
  grantItemId?: string;
  grantClueId?: string;
  triggerDialogueId?: string;
  isClockPuzzle?: boolean;
  isBookshelfPuzzle?: boolean;
  isCCTVPuzzle?: boolean;
  isOccultPuzzle?: boolean;
  isHidingSpot?: boolean;
  collisionWidth?: number;
  collisionHeight?: number;
  collisionOffsetY?: number;
  interactionRadius?: number;
}

export class InteractiveObject extends Phaser.Physics.Arcade.Sprite {
  public readonly id: string;
  public readonly objectName: string;
  public readonly description: string;
  public readonly details: string[];
  public readonly clueId?: string;
  public readonly isDoor: boolean;
  public targetRoom?: string;
  public targetSpawn?: { x: number; y: number };
  public isLocked: boolean;
  public requiredKey?: string;
  public lockedMessage?: string;
  public grantItemId?: string;
  public grantClueId?: string;
  public triggerDialogueId?: string;
  public isClockPuzzle?: boolean;
  public isBookshelfPuzzle?: boolean;
  public isCCTVPuzzle?: boolean;
  public isOccultPuzzle?: boolean;
  public isHidingSpot?: boolean;
  public readonly interactionRadius: number;

  constructor(scene: Phaser.Scene, config: InteractiveObjectConfig) {
    super(scene, config.x, config.y, config.texture);

    this.id = config.id;
    this.objectName = config.name;
    this.description = config.description;
    this.details = config.details || [];
    this.clueId = config.clueId;
    this.isDoor = !!config.isDoor;
    this.targetRoom = config.targetRoom;
    this.targetSpawn = config.targetSpawn;
    this.isLocked = !!config.isLocked;
    this.requiredKey = config.requiredKey;
    this.lockedMessage = config.lockedMessage;
    this.grantItemId = config.grantItemId;
    this.grantClueId = config.grantClueId;
    this.triggerDialogueId = config.triggerDialogueId;
    this.isClockPuzzle = config.isClockPuzzle;
    this.isBookshelfPuzzle = config.isBookshelfPuzzle;
    this.isCCTVPuzzle = config.isCCTVPuzzle;
    this.isOccultPuzzle = config.isOccultPuzzle;
    this.isHidingSpot = config.isHidingSpot;
    this.interactionRadius = config.interactionRadius || 50;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static physics body

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    const colW = config.collisionWidth ?? this.width;
    const colH = config.collisionHeight ?? Math.min(this.height, 16);
    const colOffY = config.collisionOffsetY ?? (this.height - colH);

    body.setSize(colW, colH);
    body.setOffset((this.width - colW) / 2, colOffY);

    // Depth sorting based on base
    this.setDepth(this.y + colOffY);
  }

  public isPlayerInRange(px: number, py: number): boolean {
    const dist = Phaser.Math.Distance.Between(this.x, this.y, px, py);
    return dist <= this.interactionRadius;
  }
}
