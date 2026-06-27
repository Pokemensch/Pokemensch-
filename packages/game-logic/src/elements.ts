import type { Element } from './types';

// Element-Matrix: leichte Modifikatoren (×1.2 stark, ×0.85 schwach, ×1.0 neutral)
// Wasser > Feuer > Erde > Sturm > Wasser
// Licht <> Schatten (Spiegel-Duell: beide ×1.1)
const ELEMENT_CHART: Record<Element, Partial<Record<Element, number>>> = {
  wasser:   { feuer: 1.2, sturm: 0.85 },
  feuer:    { erde: 1.2, wasser: 0.85 },
  erde:     { sturm: 1.2, feuer: 0.85 },
  sturm:    { wasser: 1.2, erde: 0.85 },
  licht:    { schatten: 1.1 },
  schatten: { licht: 1.1 },
};

export function getElementModifier(attacker: Element, defender: Element): number {
  if (attacker === defender) return 1.0;
  return ELEMENT_CHART[attacker]?.[defender] ?? 1.0;
}
