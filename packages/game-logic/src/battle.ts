import type {
  Fighter, Attack, StatusEffect, TurnLog, BattleResult,
  MiniGameInput, DefenseInput, DefenseType,
} from './battle-types';
import type { CharacterClass, Stats } from './types';
import { getElementModifier } from './elements';
import { resolveExecution } from './minigames';
import { resolveDefense } from './defense';

const MAX_TURNS = 20;

const CLASS_DEFENSE_TYPE: Record<CharacterClass, DefenseType> = {
  krieger: 'block',
  magier: 'logic_shield',
  schurke: 'dodge',
  priester: 'aura',
};

const CLASS_MINIGAME: Record<CharacterClass, MiniGameInput['type']> = {
  krieger: 'timing',
  magier: 'quiz',
  schurke: 'combo',
  priester: 'rhythm',
};

// HP = AUS-Wert als Basis (klein halten, Paper-Mario-Stil)
export function calculateHp(stats: Stats): number {
  return 20 + stats.aus * 2;
}

export function createFighter(
  name: string,
  characterClass: CharacterClass,
  element: import('./types').Element,
  stats: Stats,
  attacks: Attack[],
): Fighter {
  const maxHp = calculateHp(stats);
  return {
    name, class: characterClass, element, stats, attacks,
    hp: maxHp, maxHp, statusEffects: [],
  };
}

// --- Einzelne Attacke auflösen ---

export interface ResolveAttackInput {
  attacker: Fighter;
  defender: Fighter;
  attack: Attack;
  miniGameInput: MiniGameInput;
  defenseInput: DefenseInput;
  turn: number;
}

export function resolveAttack(input: ResolveAttackInput): TurnLog {
  const { attacker, defender, attack, miniGameInput, defenseInput, turn } = input;

  const execution = resolveExecution(miniGameInput, attacker.stats);
  const defense = resolveDefense(defenseInput, defender.stats);
  const elemMod = getElementModifier(attacker.element, defender.element);
  const effectsApplied: string[] = [];

  let finalDamage = 0;
  let counterDamage = defense.counterDamage;

  if (attack.type === 'defensive' || attack.type === 'buff') {
    // Buff/Defensive-Attacken machen keinen Schaden
    applyEffect(attacker, attack, execution.score, effectsApplied);
  } else if (attack.type === 'debuff') {
    // Debuffs treffen den Gegner
    const baseDmg = calculateBasePower(attack, attacker.stats);
    const rawDamage = Math.round(baseDmg * execution.score * elemMod);
    finalDamage = Math.max(0, rawDamage - Math.round(rawDamage * defense.damageReduction));
    applyEffectOnTarget(defender, attack, effectsApplied);
  } else {
    // Physische/Magische Attacken
    const baseDmg = calculateBasePower(attack, attacker.stats);
    const rawDamage = Math.round(baseDmg * execution.score * elemMod);

    // Block-next Status prüfen
    const blockNext = defender.statusEffects.find(e => e.type === 'block_next');
    if (blockNext) {
      finalDamage = 0;
      blockNext.remainingTurns = 0;
      effectsApplied.push('Attacke geblockt (Trockenbau-Wand)!');
    } else {
      // Verteidigung abziehen
      const defenseValue = getDefenseValue(defender);
      const afterDef = Math.max(0, rawDamage - defenseValue);
      finalDamage = Math.max(0, afterDef - Math.round(afterDef * defense.damageReduction));
    }

    // Krit-Bonus
    if (execution.isCritical) {
      finalDamage = Math.round(finalDamage * 1.5);
      effectsApplied.push('Kritischer Treffer!');
    }

    // Attacken-Effekt auf Gegner anwenden
    if (attack.effect && attack.type !== 'buff') {
      applyEffectOnTarget(defender, attack, effectsApplied);
    }
  }

  // Schaden anwenden
  defender.hp = Math.max(0, defender.hp - finalDamage);

  // Konterschaden anwenden
  if (counterDamage > 0) {
    attacker.hp = Math.max(0, attacker.hp - counterDamage);
    effectsApplied.push(`Konter! ${counterDamage} Schaden zurück!`);
  }

  // Blutung anwenden
  const bleed = defender.statusEffects.find(e => e.type === 'bleed');
  if (bleed) {
    defender.hp = Math.max(0, defender.hp - bleed.value);
    effectsApplied.push(`Blutung: ${bleed.value} Schaden`);
  }

  // Heilung anwenden
  const heal = attacker.statusEffects.find(e => e.type === 'heal');
  if (heal) {
    attacker.hp = Math.min(attacker.maxHp, attacker.hp + heal.value);
    effectsApplied.push(`Heilung: +${heal.value} HP`);
  }

  // Status-Effekte ticken (Dauer -1, abgelaufene entfernen)
  tickStatusEffects(attacker);
  tickStatusEffects(defender);

  return {
    turn,
    attacker: attacker.name,
    defender: defender.name,
    attack: attack.name,
    executionScore: execution.score,
    isCritical: execution.isCritical,
    rawDamage: Math.round(calculateBasePower(attack, attacker.stats) * execution.score * elemMod),
    elementModifier: elemMod,
    defenseReduction: defense.damageReduction,
    counterDamage,
    finalDamage,
    effectsApplied,
    attackerHp: attacker.hp,
    defenderHp: defender.hp,
  };
}

// --- Ganzer Kampf (simuliert mit KI-Eingaben) ---

export interface BattleSimInput {
  fighter1: Fighter;
  fighter2: Fighter;
  fighter1Inputs: { miniGame: MiniGameInput; defense: DefenseInput }[];
  fighter2Inputs: { miniGame: MiniGameInput; defense: DefenseInput }[];
}

export function simulateBattle(input: BattleSimInput): BattleResult {
  const { fighter1, fighter2, fighter1Inputs, fighter2Inputs } = input;
  const log: TurnLog[] = [];
  let turn = 1;

  // Initiative: höherer GES beginnt
  let attacker = fighter1.stats.ges >= fighter2.stats.ges ? fighter1 : fighter2;
  let defender = attacker === fighter1 ? fighter2 : fighter1;
  let attackerInputs = attacker === fighter1 ? fighter1Inputs : fighter2Inputs;
  let defenderInputs = attacker === fighter1 ? fighter2Inputs : fighter1Inputs;

  while (fighter1.hp > 0 && fighter2.hp > 0 && turn <= MAX_TURNS) {
    const inputIdx = Math.min(Math.floor((turn - 1) / 2), attackerInputs.length - 1);
    const defIdx = Math.min(Math.floor((turn - 1) / 2), defenderInputs.length - 1);

    // Attacke auswählen (rotiert durch verfügbare Attacken)
    const attackIdx = Math.floor((turn - 1) / 2) % attacker.attacks.length;
    const attack = attacker.attacks[attackIdx];

    // Betäubung prüfen
    const stun = attacker.statusEffects.find(e => e.type === 'stun');
    if (stun) {
      stun.remainingTurns--;
      if (stun.remainingTurns <= 0) {
        attacker.statusEffects = attacker.statusEffects.filter(e => e !== stun);
      }
      log.push({
        turn, attacker: attacker.name, defender: defender.name,
        attack: '(Betäubt)', executionScore: 0, isCritical: false,
        rawDamage: 0, elementModifier: 1, defenseReduction: 0,
        counterDamage: 0, finalDamage: 0,
        effectsApplied: [`${attacker.name} ist betäubt!`],
        attackerHp: attacker.hp, defenderHp: defender.hp,
      });
    } else {
      const turnLog = resolveAttack({
        attacker, defender, attack,
        miniGameInput: attackerInputs[inputIdx].miniGame,
        defenseInput: defenderInputs[defIdx].defense,
        turn,
      });
      log.push(turnLog);
    }

    // Seiten tauschen
    [attacker, defender] = [defender, attacker];
    [attackerInputs, defenderInputs] = [defenderInputs, attackerInputs];
    turn++;
  }

  const winner = fighter1.hp > fighter2.hp ? fighter1.name : fighter2.name;
  const loser = winner === fighter1.name ? fighter2.name : fighter1.name;

  return { winner, loser, totalTurns: turn - 1, log };
}

// --- Hilfsfunktionen ---

function calculateBasePower(attack: Attack, stats: Stats): number {
  const statValue = stats[attack.primaryStat];
  return attack.basePower + Math.round(statValue * 0.3);
}

function getDefenseValue(fighter: Fighter): number {
  let def = Math.round(fighter.stats.wil * 0.3);
  for (const effect of fighter.statusEffects) {
    if (effect.type === 'defense_up') def += effect.value;
  }
  return def;
}

function applyEffect(fighter: Fighter, attack: Attack, execScore: number, log: string[]) {
  if (!attack.effect) return;
  const e = attack.effect;
  const scaledValue = Math.round(e.value * Math.max(execScore, 0.5));

  fighter.statusEffects.push({
    type: e.type, stat: e.stat, value: scaledValue, remainingTurns: e.duration,
  });

  if (e.type === 'heal') {
    fighter.hp = Math.min(fighter.maxHp, fighter.hp + scaledValue);
    log.push(`${fighter.name} heilt sich um ${scaledValue} HP`);
  } else if (e.type === 'defense_up') {
    log.push(`${fighter.name}: Verteidigung +${scaledValue}`);
  } else if (e.type === 'buff_stat') {
    log.push(`${fighter.name}: ${e.stat} +${scaledValue}`);
  }
}

function applyEffectOnTarget(target: Fighter, attack: Attack, log: string[]) {
  if (!attack.effect) return;
  const e = attack.effect;

  target.statusEffects.push({
    type: e.type, stat: e.stat, value: e.value, remainingTurns: e.duration,
  });

  if (e.type === 'accuracy_down') {
    log.push(`${target.name}: Genauigkeit ${e.value}`);
  } else if (e.type === 'bleed') {
    log.push(`${target.name}: Blutung (${e.value}/Runde)`);
  } else if (e.type === 'debuff_stat') {
    log.push(`${target.name}: ${e.stat} ${e.value}`);
  }
}

function tickStatusEffects(fighter: Fighter) {
  fighter.statusEffects = fighter.statusEffects.filter(e => {
    e.remainingTurns--;
    return e.remainingTurns > 0;
  });
}
