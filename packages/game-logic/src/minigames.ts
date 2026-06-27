import type { MiniGameInput, ExecutionResult } from './battle-types';
import type { Stats } from './types';

// Jedes Minispiel nimmt die Spieler-Eingabe und gibt einen executionScore (0.0–1.5) zurück.
// Die UI-Komponenten (Phase 5) liefern die MiniGameInput-Werte.

export function resolveExecution(input: MiniGameInput, stats: Stats): ExecutionResult {
  switch (input.type) {
    case 'timing':  return resolveTimingHit(input, stats);
    case 'quiz':    return resolveQuizResonance(input, stats);
    case 'combo':   return resolveComboFlow(input, stats);
    case 'rhythm':  return resolveBreathRhythm(input, stats);
  }
}

// Krieger: Reaktions-Schlag — Timing-Leiste, perfektes Fenster = Krit
function resolveTimingHit(input: MiniGameInput, stats: Stats): ExecutionResult {
  const base = input.accuracy * 1.2;
  const gesBonus = Math.min(stats.ges / 50, 0.15);
  const score = Math.min(base + gesBonus, 1.5);
  const isCritical = input.accuracy >= 0.95 && stats.ges >= 12;
  return { score: round2(score), isCritical };
}

// Magier: Wissens-Resonanz — Quiz/Logik, richtig + schnell = stark
function resolveQuizResonance(input: MiniGameInput, stats: Stats): ExecutionResult {
  const correctness = input.accuracy;
  const speedBonus = input.speed * 0.3;
  const intBonus = Math.min(stats.int / 60, 0.15);
  const score = Math.min(correctness + speedBonus + intBonus, 1.5);
  const isCritical = input.accuracy >= 1.0 && input.speed >= 0.9;
  return { score: round2(score), isCritical };
}

// Schurke: Combo-Flow — Swipe-Sequenzen, je länger sauber desto stärker
function resolveComboFlow(input: MiniGameInput, stats: Stats): ExecutionResult {
  const comboLen = input.comboLength ?? 1;
  const comboMultiplier = Math.min(1.0 + comboLen * 0.1, 1.4);
  const base = input.accuracy * comboMultiplier;
  const gesBonus = Math.min(stats.ges / 50, 0.15);
  const score = Math.min(base + gesBonus, 1.5);
  const isCritical = comboLen >= 5 && input.accuracy >= 0.9;
  return { score: round2(score), isCritical };
}

// Priester: Atemrhythmus — Halten/Loslassen im Puls, lädt Heilung/Schild
function resolveBreathRhythm(input: MiniGameInput, stats: Stats): ExecutionResult {
  const rhythmPrecision = input.accuracy;
  const holdBonus = input.speed * 0.2;
  const wilBonus = Math.min(stats.wil / 50, 0.15);
  const score = Math.min(rhythmPrecision + holdBonus + wilBonus, 1.5);
  const isCritical = input.accuracy >= 0.95 && stats.wil >= 14;
  return { score: round2(score), isCritical };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
