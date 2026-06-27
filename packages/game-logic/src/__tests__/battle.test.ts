import { describe, it, expect } from 'vitest';
import { calculateStats } from '../stats';
import { getClassForProfession, getElementForProfession } from '../classes';
import { getAttacksForClass } from '../attacks';
import { resolveExecution } from '../minigames';
import { resolveDefense } from '../defense';
import { createFighter, resolveAttack, simulateBattle, calculateHp } from '../battle';
import type { LifeInputs, Stats } from '../types';
import type { MiniGameInput, DefenseInput } from '../battle-types';

// ============================================
// Beispiel-Charaktere aus den Design-Docs
// ============================================

const MAURER_INPUT: LifeInputs = {
  profession: 'Maurer',
  yearsExperience: 30,
  sports: ['Kraftsport'],
  body: { weight: 90, height: 180 },
  degrees: ['ausbildung', 'meister'],
  hobbies: [],
};

const ANWALT_INPUT: LifeInputs = {
  profession: 'Anwalt',
  yearsExperience: 12,
  sports: [],
  body: { weight: 80, height: 178 },
  degrees: ['abitur', 'master', 'staatsexamen'],
  hobbies: ['Debattieren'],
};

function createMaurer() {
  const stats = calculateStats(MAURER_INPUT);
  const cls = getClassForProfession(MAURER_INPUT.profession);
  const elem = getElementForProfession(MAURER_INPUT.profession);
  const attacks = getAttacksForClass(cls);
  return createFighter('Klaus der Maurer', cls, elem, stats, attacks);
}

function createAnwalt() {
  const stats = calculateStats(ANWALT_INPUT);
  const cls = getClassForProfession(ANWALT_INPUT.profession);
  const elem = getElementForProfession(ANWALT_INPUT.profession);
  const attacks = getAttacksForClass(cls);
  return createFighter('Dr. Müller (Anwalt)', cls, elem, stats, attacks);
}

// ============================================
// HP-Berechnung
// ============================================

describe('calculateHp', () => {
  it('HP basiert auf AUS-Wert (Paper-Mario-Stil, 20–80 Range)', () => {
    const lowAus: Stats = { str: 10, aus: 8, int: 10, ges: 10, wil: 10, cha: 10 };
    const highAus: Stats = { str: 10, aus: 25, int: 10, ges: 10, wil: 10, cha: 10 };

    expect(calculateHp(lowAus)).toBe(36);
    expect(calculateHp(highAus)).toBe(70);
    expect(calculateHp(highAus)).toBeGreaterThan(calculateHp(lowAus));
  });
});

// ============================================
// Minispiel-Mechaniken
// ============================================

describe('resolveExecution', () => {
  it('Krieger Timing: perfekte Eingabe → hoher Score + Krit', () => {
    const input: MiniGameInput = { type: 'timing', accuracy: 1.0, speed: 0.9 };
    const stats: Stats = { str: 20, aus: 15, int: 8, ges: 14, wil: 10, cha: 8 };
    const result = resolveExecution(input, stats);

    expect(result.score).toBeGreaterThanOrEqual(1.2);
    expect(result.score).toBeLessThanOrEqual(1.5);
    expect(result.isCritical).toBe(true);
  });

  it('Krieger Timing: schlechte Eingabe → niedriger Score', () => {
    const input: MiniGameInput = { type: 'timing', accuracy: 0.2, speed: 0.3 };
    const stats: Stats = { str: 20, aus: 15, int: 8, ges: 10, wil: 10, cha: 8 };
    const result = resolveExecution(input, stats);

    expect(result.score).toBeLessThan(0.5);
    expect(result.isCritical).toBe(false);
  });

  it('Magier Quiz: richtig + schnell = stark', () => {
    const input: MiniGameInput = { type: 'quiz', accuracy: 1.0, speed: 1.0 };
    const stats: Stats = { str: 8, aus: 8, int: 22, ges: 8, wil: 15, cha: 12 };
    const result = resolveExecution(input, stats);

    expect(result.score).toBeGreaterThanOrEqual(1.3);
    expect(result.isCritical).toBe(true);
  });

  it('Schurke Combo: lange Combo = mehr Schaden', () => {
    const shortCombo: MiniGameInput = { type: 'combo', accuracy: 0.8, speed: 0.8, comboLength: 2 };
    const longCombo: MiniGameInput = { type: 'combo', accuracy: 0.9, speed: 0.8, comboLength: 5 };
    const stats: Stats = { str: 8, aus: 8, int: 8, ges: 18, wil: 8, cha: 14 };

    const short = resolveExecution(shortCombo, stats);
    const long = resolveExecution(longCombo, stats);

    expect(long.score).toBeGreaterThan(short.score);
    expect(long.isCritical).toBe(true);
  });

  it('Priester Rhythmus: perfekter Puls = hoher Score', () => {
    const input: MiniGameInput = { type: 'rhythm', accuracy: 0.95, speed: 0.9 };
    const stats: Stats = { str: 8, aus: 10, int: 12, ges: 8, wil: 16, cha: 14 };
    const result = resolveExecution(input, stats);

    expect(result.score).toBeGreaterThanOrEqual(1.1);
    expect(result.isCritical).toBe(true);
  });

  it('executionScore ist immer zwischen 0.0 und 1.5', () => {
    const extremeInput: MiniGameInput = { type: 'timing', accuracy: 1.0, speed: 1.0 };
    const extremeStats: Stats = { str: 99, aus: 99, int: 99, ges: 99, wil: 99, cha: 99 };
    const result = resolveExecution(extremeInput, extremeStats);

    expect(result.score).toBeLessThanOrEqual(1.5);
    expect(result.score).toBeGreaterThanOrEqual(0.0);
  });
});

// ============================================
// Aktive Verteidigung
// ============================================

describe('resolveDefense', () => {
  it('Krieger perfekter Block: hohe Reduktion + Konterschaden', () => {
    const input: DefenseInput = { type: 'block', timing: 1.0 };
    const stats: Stats = { str: 20, aus: 15, int: 8, ges: 10, wil: 10, cha: 8 };
    const result = resolveDefense(input, stats);

    expect(result.damageReduction).toBeGreaterThanOrEqual(0.5);
    expect(result.counterDamage).toBeGreaterThan(0);
  });

  it('Schurke Ausweichen: höchste Reduktion bei gutem Timing', () => {
    const input: DefenseInput = { type: 'dodge', timing: 0.9 };
    const stats: Stats = { str: 8, aus: 8, int: 8, ges: 18, wil: 8, cha: 14 };
    const result = resolveDefense(input, stats);

    expect(result.damageReduction).toBeGreaterThanOrEqual(0.5);
    expect(result.counterDamage).toBe(0);
  });

  it('Schlechtes Timing = wenig Reduktion', () => {
    const input: DefenseInput = { type: 'block', timing: 0.1 };
    const stats: Stats = { str: 20, aus: 15, int: 8, ges: 10, wil: 10, cha: 8 };
    const result = resolveDefense(input, stats);

    expect(result.damageReduction).toBeLessThan(0.2);
    expect(result.counterDamage).toBe(0);
  });
});

// ============================================
// Einzelne Attacke auflösen
// ============================================

describe('resolveAttack', () => {
  it('Lehmschelle macht Schaden und senkt Gegner-Genauigkeit', () => {
    const maurer = createMaurer();
    const anwalt = createAnwalt();
    const attack = maurer.attacks.find(a => a.key === 'lehmschelle')!;

    const log = resolveAttack({
      attacker: maurer, defender: anwalt, attack,
      miniGameInput: { type: 'timing', accuracy: 0.8, speed: 0.8 },
      defenseInput: { type: 'logic_shield', timing: 0.5 },
      turn: 1,
    });

    expect(log.finalDamage).toBeGreaterThan(0);
    expect(anwalt.hp).toBeLessThan(anwalt.maxHp);
    expect(log.effectsApplied.some(e => e.includes('Genauigkeit'))).toBe(true);
  });

  it('Verputzen macht keinen Schaden, aber erhöht Verteidigung', () => {
    const maurer = createMaurer();
    const anwalt = createAnwalt();
    const attack = maurer.attacks.find(a => a.key === 'verputzen')!;

    const log = resolveAttack({
      attacker: maurer, defender: anwalt, attack,
      miniGameInput: { type: 'timing', accuracy: 0.8, speed: 0.8 },
      defenseInput: { type: 'logic_shield', timing: 0.5 },
      turn: 1,
    });

    expect(log.finalDamage).toBe(0);
    expect(maurer.statusEffects.some(e => e.type === 'defense_up')).toBe(true);
  });
});

// ============================================
// VOLLSTÄNDIGER TEST-KAMPF: Maurer vs. Anwalt
// ============================================

describe('simulateBattle — Maurer-Krieger vs. Anwalt-Magier', () => {
  it('Kampf läuft komplett durch mit Sieger, Log und kleinen Zahlen', () => {
    const maurer = createMaurer();
    const anwalt = createAnwalt();

    // Simulierte Spieler-Inputs (abwechselnd gut/mittel)
    const maurerInputs = Array.from({ length: 10 }, (_, i) => ({
      miniGame: {
        type: 'timing' as const,
        accuracy: i % 2 === 0 ? 0.85 : 0.65,
        speed: 0.7,
      },
      defense: { type: 'block' as const, timing: i % 2 === 0 ? 0.8 : 0.4 },
    }));

    const anwaltInputs = Array.from({ length: 10 }, (_, i) => ({
      miniGame: {
        type: 'quiz' as const,
        accuracy: i % 2 === 0 ? 0.9 : 0.6,
        speed: 0.8,
      },
      defense: { type: 'logic_shield' as const, timing: i % 2 === 0 ? 0.7 : 0.3 },
    }));

    const result = simulateBattle({
      fighter1: maurer,
      fighter2: anwalt,
      fighter1Inputs: maurerInputs,
      fighter2Inputs: anwaltInputs,
    });

    // Kampf hat einen Sieger
    expect(result.winner).toBeTruthy();
    expect(result.loser).toBeTruthy();
    expect(result.winner).not.toBe(result.loser);

    // Kampf dauert 6–20 Runden (Design-Ziel: 6–10)
    expect(result.totalTurns).toBeGreaterThanOrEqual(4);
    expect(result.totalTurns).toBeLessThanOrEqual(MAX_TURNS);

    // Log hat Einträge
    expect(result.log.length).toBeGreaterThan(0);

    // Alle Schadenswerte sind klein und lesbar (Paper-Mario-Prinzip)
    for (const entry of result.log) {
      expect(entry.finalDamage).toBeLessThanOrEqual(30);
      expect(entry.executionScore).toBeGreaterThanOrEqual(0);
      expect(entry.executionScore).toBeLessThanOrEqual(1.5);
    }

    // Log zeigt sinnvolle Daten
    const firstTurn = result.log[0];
    expect(firstTurn.turn).toBe(1);
    expect(firstTurn.attacker).toBeTruthy();
    expect(firstTurn.attack).toBeTruthy();

    console.log('\n=== KAMPF-LOG: Maurer vs. Anwalt ===');
    console.log(`Sieger: ${result.winner}`);
    console.log(`Runden: ${result.totalTurns}`);
    for (const entry of result.log) {
      const crit = entry.isCritical ? ' ⚡KRIT' : '';
      const effects = entry.effectsApplied.length > 0 ? ` [${entry.effectsApplied.join(', ')}]` : '';
      console.log(
        `  Runde ${entry.turn}: ${entry.attacker} → ${entry.attack}` +
        ` (exec: ${entry.executionScore}, dmg: ${entry.finalDamage}${crit})` +
        ` | ${entry.attacker}: ${entry.attackerHp} HP, ${entry.defender}: ${entry.defenderHp} HP` +
        effects
      );
    }
  });
});

const MAX_TURNS = 20;
