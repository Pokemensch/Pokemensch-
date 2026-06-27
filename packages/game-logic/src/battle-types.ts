import type { CharacterClass, Element, Stats } from './types';

// --- Attacken ---

export type AttackType = 'physical' | 'magical' | 'defensive' | 'buff' | 'debuff';

export interface Attack {
  key: string;
  name: string;
  element: Element | null;
  type: AttackType;
  basePower: number;
  cost: number;
  effect: AttackEffect | null;
  primaryStat: keyof Stats;
}

export interface AttackEffect {
  type: 'accuracy_down' | 'defense_up' | 'block_next' | 'heal' | 'bleed' | 'stun' | 'focus' | 'buff_stat' | 'debuff_stat';
  stat?: keyof Stats;
  value: number;
  duration: number;
}

// --- Kampf-Teilnehmer ---

export interface Fighter {
  name: string;
  class: CharacterClass;
  element: Element;
  stats: Stats;
  hp: number;
  maxHp: number;
  attacks: Attack[];
  statusEffects: StatusEffect[];
}

export interface StatusEffect {
  type: AttackEffect['type'];
  stat?: keyof Stats;
  value: number;
  remainingTurns: number;
}

// --- Minispiel ---

export type MiniGameType = 'timing' | 'quiz' | 'combo' | 'rhythm';

export interface MiniGameInput {
  type: MiniGameType;
  accuracy: number;     // 0.0–1.0: wie genau der Spieler das Minispiel gespielt hat
  speed: number;        // 0.0–1.0: wie schnell
  comboLength?: number; // nur für Schurke: Anzahl erfolgreicher Combos
}

export interface ExecutionResult {
  score: number;        // 0.0–1.5
  isCritical: boolean;
}

// --- Verteidigung ---

export type DefenseType = 'block' | 'logic_shield' | 'dodge' | 'aura';

export interface DefenseInput {
  type: DefenseType;
  timing: number; // 0.0–1.0: wie gut das Timing war
}

export interface DefenseResult {
  damageReduction: number;  // 0.0–1.0: Anteil des reduzierten Schadens
  counterDamage: number;    // Konterschaden (nur bei perfektem Block)
}

// --- Kampf-Log ---

export interface TurnLog {
  turn: number;
  attacker: string;
  defender: string;
  attack: string;
  executionScore: number;
  isCritical: boolean;
  rawDamage: number;
  elementModifier: number;
  defenseReduction: number;
  counterDamage: number;
  finalDamage: number;
  effectsApplied: string[];
  attackerHp: number;
  defenderHp: number;
}

export interface BattleResult {
  winner: string;
  loser: string;
  totalTurns: number;
  log: TurnLog[];
}
