import type { DefenseInput, DefenseResult } from './battle-types';
import type { Stats } from './types';

// Aktive Verteidigung: Spieler reagiert auf den Gegner-Angriff.
// Gutes Timing reduziert Schaden, perfektes Timing gibt Konterschaden.

export function resolveDefense(input: DefenseInput, stats: Stats): DefenseResult {
  switch (input.type) {
    case 'block':        return resolveBlock(input, stats);
    case 'logic_shield': return resolveLogicShield(input, stats);
    case 'dodge':        return resolveDodge(input, stats);
    case 'aura':         return resolveAura(input, stats);
  }
}

// Krieger: Block/Parade — perfekt = Konterschaden (Mario Superguard)
function resolveBlock(input: DefenseInput, stats: Stats): DefenseResult {
  const strBonus = Math.min(stats.str / 60, 0.1);
  const reduction = Math.min(input.timing * 0.6 + strBonus, 0.7);
  const counterDamage = input.timing >= 0.95 ? Math.round(stats.str * 0.3) : 0;
  return { damageReduction: round2(reduction), counterDamage };
}

// Magier: Logik-Schild — richtige Konter-Option in Sekundenbruchteil
function resolveLogicShield(input: DefenseInput, stats: Stats): DefenseResult {
  const intBonus = Math.min(stats.int / 60, 0.1);
  const reduction = Math.min(input.timing * 0.55 + intBonus, 0.65);
  const counterDamage = 0;
  return { damageReduction: round2(reduction), counterDamage };
}

// Schurke: Ausweich-Roll — wegswipen, Angriff verfehlt teilweise
function resolveDodge(input: DefenseInput, stats: Stats): DefenseResult {
  const gesBonus = Math.min(stats.ges / 50, 0.12);
  const reduction = Math.min(input.timing * 0.7 + gesBonus, 0.8);
  const counterDamage = 0;
  return { damageReduction: round2(reduction), counterDamage };
}

// Priester: Schutzaura — vorab geladene Mitigation
function resolveAura(input: DefenseInput, stats: Stats): DefenseResult {
  const wilBonus = Math.min(stats.wil / 50, 0.12);
  const reduction = Math.min(input.timing * 0.5 + wilBonus, 0.6);
  const counterDamage = 0;
  return { damageReduction: round2(reduction), counterDamage };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
