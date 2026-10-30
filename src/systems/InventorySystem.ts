import { InventoryItem } from '../types';
import { ITEM_CATALOG } from '../data/ItemCatalog';

export class InventorySystem {
  private static instance: InventorySystem | null = null;
  private items: InventoryItem[] = [];
  private readonly maxCapacity: number = 10;
  private changeListeners: Array<() => void> = [];

  private constructor() {}

  public static getInstance(): InventorySystem {
    if (!InventorySystem.instance) {
      InventorySystem.instance = new InventorySystem();
    }
    return InventorySystem.instance;
  }

  public static resetInstance(): void {
    InventorySystem.instance = new InventorySystem();
  }

  public addItem(itemOrId: InventoryItem | string): boolean {
    const item = typeof itemOrId === 'string' ? ITEM_CATALOG[itemOrId] : itemOrId;
    if (!item) {
      console.warn(`[InventorySystem] Item not found in catalog: ${itemOrId}`);
      return false;
    }

    if (this.items.length >= this.maxCapacity) {
      return false; // Inventory full
    }

    // Check if already in inventory
    if (this.hasItem(item.id)) {
      return false;
    }

    this.items.push({ ...item });
    this.notifyListeners();
    return true;
  }

  public removeItem(itemId: string): boolean {
    const idx = this.items.findIndex(it => it.id === itemId);
    if (idx !== -1) {
      this.items.splice(idx, 1);
      this.notifyListeners();
      return true;
    }
    return false;
  }

  public hasItem(itemId: string): boolean {
    return this.items.some(it => it.id === itemId);
  }

  public getItem(itemId: string): InventoryItem | undefined {
    return this.items.find(it => it.id === itemId);
  }

  public getItemAt(index: number): InventoryItem | undefined {
    return this.items[index];
  }

  public getItems(): InventoryItem[] {
    return [...this.items];
  }

  public getCapacity(): number {
    return this.maxCapacity;
  }

  public getCount(): number {
    return this.items.length;
  }

  public isFull(): boolean {
    return this.items.length >= this.maxCapacity;
  }

  public clear(): void {
    this.items = [];
    this.notifyListeners();
  }

  /**
   * Combine two items if a recipe exists
   */
  public combine(itemIdA: string, itemIdB: string): { success: boolean; resultItem?: InventoryItem; message: string } {
    const itemA = this.getItem(itemIdA);
    const itemB = this.getItem(itemIdB);

    if (!itemA || !itemB) {
      return { success: false, message: 'Select two valid items to combine.' };
    }

    // Recipe: Pocket Watch + Clock Hand = Decoded Clock Setting (Or unlocks hint)
    if (
      (itemA.id === 'item_pocket_watch' && itemB.id === 'item_clock_hand') ||
      (itemA.id === 'item_clock_hand' && itemB.id === 'item_pocket_watch')
    ) {
      return {
        success: true,
        message: 'The clock hand fits the pocket watch arbor! The time is locked firmly at 3:33.'
      };
    }

    return { success: false, message: 'These items cannot be combined.' };
  }

  public onChange(listener: () => void): () => void {
    this.changeListeners.push(listener);
    return () => {
      this.changeListeners = this.changeListeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.changeListeners) {
      try {
        listener();
      } catch (e) {
        console.error('[InventorySystem] Listener error', e);
      }
    }
  }

  public serialize(): InventoryItem[] {
    return JSON.parse(JSON.stringify(this.items));
  }

  public deserialize(items: InventoryItem[]): void {
    this.items = Array.isArray(items) ? items : [];
    this.notifyListeners();
  }
}
