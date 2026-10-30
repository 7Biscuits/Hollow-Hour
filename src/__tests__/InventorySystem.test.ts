import { describe, it, expect, beforeEach } from 'vitest';
import { InventorySystem } from '../systems/InventorySystem';
import { ITEM_CATALOG } from '../data/ItemCatalog';

describe('InventorySystem', () => {
  let inventory: InventorySystem;

  beforeEach(() => {
    InventorySystem.resetInstance();
    inventory = InventorySystem.getInstance();
  });

  it('starts empty and has maximum capacity of 10', () => {
    expect(inventory.getCount()).toBe(0);
    expect(inventory.getCapacity()).toBe(10);
    expect(inventory.isFull()).toBe(false);
  });

  it('adds items by id or item object', () => {
    const success1 = inventory.addItem('item_brass_key');
    expect(success1).toBe(true);
    expect(inventory.hasItem('item_brass_key')).toBe(true);
    expect(inventory.getCount()).toBe(1);

    const success2 = inventory.addItem(ITEM_CATALOG.item_pocket_watch);
    expect(success2).toBe(true);
    expect(inventory.hasItem('item_pocket_watch')).toBe(true);
    expect(inventory.getCount()).toBe(2);
  });

  it('rejects duplicate items', () => {
    inventory.addItem('item_brass_key');
    const duplicate = inventory.addItem('item_brass_key');
    expect(duplicate).toBe(false);
    expect(inventory.getCount()).toBe(1);
  });

  it('removes items correctly', () => {
    inventory.addItem('item_brass_key');
    inventory.addItem('item_iron_key');
    expect(inventory.getCount()).toBe(2);

    const removed = inventory.removeItem('item_brass_key');
    expect(removed).toBe(true);
    expect(inventory.hasItem('item_brass_key')).toBe(false);
    expect(inventory.hasItem('item_iron_key')).toBe(true);
    expect(inventory.getCount()).toBe(1);
  });

  it('combines pocket watch with clock hand', () => {
    inventory.addItem('item_pocket_watch');
    inventory.addItem('item_clock_hand');

    const result = inventory.combine('item_pocket_watch', 'item_clock_hand');
    expect(result.success).toBe(true);
    expect(result.message).toContain('3:33');
  });

  it('serializes and restores inventory correctly', () => {
    inventory.addItem('item_brass_key');
    inventory.addItem('item_laudanum');

    const serialized = inventory.serialize();
    expect(serialized.length).toBe(2);

    inventory.clear();
    expect(inventory.getCount()).toBe(0);

    inventory.deserialize(serialized);
    expect(inventory.getCount()).toBe(2);
    expect(inventory.hasItem('item_brass_key')).toBe(true);
    expect(inventory.hasItem('item_laudanum')).toBe(true);
  });
});
