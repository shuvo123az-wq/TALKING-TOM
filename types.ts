
export enum PetMood {
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
  SLEEPY = 'SLEEPY',
  EATING = 'EATING',
  WASHING = 'WASHING',
  LISTENING = 'LISTENING'
}

export interface PetStats {
  hunger: number;
  energy: number;
  happiness: number;
  hygiene: number;
}

export interface GameState {
  stats: PetStats;
  coins: number;
  level: number;
  experience: number;
  isSleeping: boolean;
  isWashing: boolean;
  lastUpdate: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  cost: number;
  type: 'food' | 'hat' | 'toy';
  effect?: Partial<PetStats>;
}
