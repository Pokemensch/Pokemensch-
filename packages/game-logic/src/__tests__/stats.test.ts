import { describe, it, expect } from 'vitest';
import { calculateStats } from '../stats';
import { getClassForProfession, getElementForProfession } from '../classes';
import { getElementModifier } from '../elements';
import type { LifeInputs } from '../types';

// ============================================
// Beispiel-Profile aus den Design-Docs
// ============================================

const MAURER_30_JAHRE: LifeInputs = {
  profession: 'Maurer',
  yearsExperience: 30,
  sports: ['Kraftsport'],
  body: { weight: 90, height: 180 },
  degrees: ['ausbildung', 'meister'],
  hobbies: [],
};

const ANWALT_MASTER_JURA: LifeInputs = {
  profession: 'Anwalt',
  yearsExperience: 12,
  sports: [],
  body: { weight: 80, height: 178 },
  degrees: ['abitur', 'master', 'staatsexamen'],
  hobbies: ['Debattieren'],
};

const DESIGNER_JUNG: LifeInputs = {
  profession: 'Designer',
  yearsExperience: 3,
  sports: ['Bouldern'],
  body: { weight: 70, height: 175 },
  degrees: ['abitur', 'bachelor'],
  hobbies: ['Zeichnen'],
};

const KRANKENPFLEGER: LifeInputs = {
  profession: 'Krankenpfleger',
  yearsExperience: 8,
  sports: ['Yoga'],
  body: { weight: 75, height: 170 },
  degrees: ['realschule', 'ausbildung'],
  hobbies: ['Ehrenamt'],
};

// ============================================
// Klassen-Zuordnung
// ============================================

describe('getClassForProfession', () => {
  it('Maurer → Krieger', () => {
    expect(getClassForProfession('Maurer')).toBe('krieger');
  });

  it('Anwalt → Magier', () => {
    expect(getClassForProfession('Anwalt')).toBe('magier');
  });

  it('Designer → Schurke', () => {
    expect(getClassForProfession('Designer')).toBe('schurke');
  });

  it('Krankenpfleger → Priester', () => {
    expect(getClassForProfession('Krankenpfleger')).toBe('priester');
  });

  it('Programmierer → Magier', () => {
    expect(getClassForProfession('Programmierer')).toBe('magier');
  });

  it('Koch → Schurke', () => {
    expect(getClassForProfession('Koch')).toBe('schurke');
  });

  it('Unbekannter Beruf → Krieger (Fallback)', () => {
    expect(getClassForProfession('Astronaut')).toBe('krieger');
  });
});

// ============================================
// Element-Zuordnung
// ============================================

describe('getElementForProfession', () => {
  it('Maurer → Erde', () => {
    expect(getElementForProfession('Maurer')).toBe('erde');
  });

  it('Anwalt → Licht', () => {
    expect(getElementForProfession('Anwalt')).toBe('licht');
  });

  it('Designer → Schatten', () => {
    expect(getElementForProfession('Designer')).toBe('schatten');
  });

  it('Programmierer → Sturm', () => {
    expect(getElementForProfession('Programmierer')).toBe('sturm');
  });
});

// ============================================
// Werte-Formeln
// ============================================

describe('calculateStats', () => {
  it('Maurer 30 Jahre: hohe STR und AUS', () => {
    const stats = calculateStats(MAURER_30_JAHRE);

    expect(stats.str).toBeGreaterThan(stats.int);
    expect(stats.aus).toBeGreaterThan(stats.int);
    expect(stats.str).toBeGreaterThanOrEqual(18);
    expect(stats.aus).toBeGreaterThanOrEqual(16);
  });

  it('Anwalt Master Jura: hohe INT und WIL', () => {
    const stats = calculateStats(ANWALT_MASTER_JURA);

    expect(stats.int).toBeGreaterThan(stats.str);
    expect(stats.wil).toBeGreaterThan(stats.str);
    expect(stats.int).toBeGreaterThanOrEqual(18);
  });

  it('Designer jung: GES ist höchster Wert (Klassen-Primärwert)', () => {
    const stats = calculateStats(DESIGNER_JUNG);

    expect(stats.ges).toBeGreaterThan(stats.str);
    expect(stats.ges).toBeGreaterThan(stats.int);
    expect(stats.ges).toBeGreaterThan(stats.wil);
  });

  it('Krankenpfleger: hohe WIL und CHA', () => {
    const stats = calculateStats(KRANKENPFLEGER);

    expect(stats.wil).toBeGreaterThan(stats.str);
    expect(stats.cha).toBeGreaterThan(stats.str);
  });

  it('Erfahrung macht stärker, aber nicht unbesiegbar (logarithmisch)', () => {
    const rookie = calculateStats({ ...MAURER_30_JAHRE, yearsExperience: 1 });
    const veteran = calculateStats({ ...MAURER_30_JAHRE, yearsExperience: 30 });
    const legend = calculateStats({ ...MAURER_30_JAHRE, yearsExperience: 100 });

    expect(veteran.str).toBeGreaterThan(rookie.str);
    expect(legend.str).toBeGreaterThan(veteran.str);
    // Logarithmisch: Der Unterschied 30→100 ist kleiner als 1→30
    const diffRookieVet = veteran.str - rookie.str;
    const diffVetLegend = legend.str - veteran.str;
    expect(diffRookieVet).toBeGreaterThanOrEqual(diffVetLegend);
  });

  it('Abschlüsse geben korrekte Boni', () => {
    const ohneAbschluss = calculateStats({ ...ANWALT_MASTER_JURA, degrees: [] });
    const mitAbschluss = calculateStats(ANWALT_MASTER_JURA);

    expect(mitAbschluss.int).toBeGreaterThan(ohneAbschluss.int);
    expect(mitAbschluss.wil).toBeGreaterThan(ohneAbschluss.wil);
  });

  it('Sport gibt Boni', () => {
    const ohneSport = calculateStats({ ...MAURER_30_JAHRE, sports: [] });
    const mitSport = calculateStats(MAURER_30_JAHRE);

    expect(mitSport.str).toBeGreaterThan(ohneSport.str);
  });

  it('Alle Werte sind mindestens 1', () => {
    const stats = calculateStats({
      profession: 'Nichts',
      yearsExperience: 0,
      sports: [],
      body: { weight: 0, height: 0 },
      degrees: [],
      hobbies: [],
    });

    expect(stats.str).toBeGreaterThanOrEqual(1);
    expect(stats.aus).toBeGreaterThanOrEqual(1);
    expect(stats.int).toBeGreaterThanOrEqual(1);
    expect(stats.ges).toBeGreaterThanOrEqual(1);
    expect(stats.wil).toBeGreaterThanOrEqual(1);
    expect(stats.cha).toBeGreaterThanOrEqual(1);
  });

  it('Werte bleiben zweistellig und lesbar (Paper-Mario-Prinzip)', () => {
    const stats = calculateStats(MAURER_30_JAHRE);

    for (const val of Object.values(stats)) {
      expect(val).toBeLessThanOrEqual(40);
    }
  });
});

// ============================================
// Element-Modifikatoren
// ============================================

describe('getElementModifier', () => {
  it('Wasser schlägt Feuer (×1.2)', () => {
    expect(getElementModifier('wasser', 'feuer')).toBe(1.2);
  });

  it('Wasser schwach gegen Sturm (×0.85)', () => {
    expect(getElementModifier('wasser', 'sturm')).toBe(0.85);
  });

  it('Licht vs Schatten: Spiegel-Duell (×1.1)', () => {
    expect(getElementModifier('licht', 'schatten')).toBe(1.1);
    expect(getElementModifier('schatten', 'licht')).toBe(1.1);
  });

  it('Gleiches Element = neutral (×1.0)', () => {
    expect(getElementModifier('feuer', 'feuer')).toBe(1.0);
  });

  it('Nicht-verwandte Elemente = neutral (×1.0)', () => {
    expect(getElementModifier('wasser', 'licht')).toBe(1.0);
  });
});
