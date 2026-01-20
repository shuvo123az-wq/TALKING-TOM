
import { PetStats, InventoryItem } from './types';

export const DECAY_RATES: PetStats = {
  hunger: 2, // percentage per minute
  energy: 1.5,
  happiness: 1,
  hygiene: 1.2
};

export const INITIAL_STATS: PetStats = {
  hunger: 80,
  energy: 100,
  happiness: 70,
  hygiene: 90
};

export const FOOD_ITEMS: InventoryItem[] = [
  { id: 'apple', name: '🍏 Space Apple', cost: 5, type: 'food', effect: { hunger: 15, happiness: 5 } },
  { id: 'pizza', name: '🍕 Nebula Pizza', cost: 15, type: 'food', effect: { hunger: 40, happiness: 10 } },
  { id: 'burger', name: '🍔 Comet Burger', cost: 25, type: 'food', effect: { hunger: 60, happiness: 15 } },
  { id: 'cake', name: '🍰 Star Cake', cost: 40, type: 'food', effect: { hunger: 20, happiness: 40 } },
];

export const HATS: InventoryItem[] = [
  { id: 'crown', name: '👑 King Crown', cost: 500, type: 'hat' },
  { id: 'propeller', name: '🚁 Propeller Cap', cost: 250, type: 'hat' },
  { id: 'wizard', name: '🧙 Wizard Hat', cost: 750, type: 'hat' },
];
