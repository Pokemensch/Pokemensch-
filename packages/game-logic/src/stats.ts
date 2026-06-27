import type { LifeInputs, Stats, Degree } from './types';
import { getProfessionStatBias } from './classes';

const BASE_STAT = 8;

const DEGREE_BONUSES: Record<Degree, Partial<Stats>> = {
  hauptschule:  { int: 1 },
  realschule:   { int: 2 },
  abitur:       { int: 3 },
  ausbildung:   { str: 1, aus: 1, ges: 1 },
  meister:      { aus: 3, wil: 2, cha: 1 },
  bachelor:     { int: 3 },
  master:       { int: 4, wil: 2 },
  staatsexamen: { int: 4, wil: 3 },
  promotion:    { int: 6, wil: 2 },
};

interface SportMapping {
  keywords: string[];
  bonus: Partial<Stats>;
}

const SPORT_MAPPINGS: SportMapping[] = [
  { keywords: ['kraftsport', 'gewichtheben', 'bodybuilding', 'crossfit', 'strongman'], bonus: { str: 3, aus: 1 } },
  { keywords: ['laufen', 'joggen', 'marathon', 'triathlon', 'radfahren', 'schwimmen', 'ausdauer'], bonus: { aus: 3, wil: 1 } },
  { keywords: ['fussball', 'handball', 'basketball', 'volleyball', 'hockey', 'rugby'], bonus: { aus: 2, ges: 1, cha: 1 } },
  { keywords: ['kampfsport', 'boxen', 'mma', 'judo', 'karate', 'taekwondo', 'ringen', 'kickboxen'], bonus: { str: 2, ges: 2, wil: 1 } },
  { keywords: ['yoga', 'pilates', 'meditation', 'tai chi'], bonus: { wil: 2, ges: 1, cha: 1 } },
  { keywords: ['klettern', 'bouldern', 'calisthenics', 'turnen'], bonus: { str: 2, aus: 2, ges: 1 } },
  { keywords: ['tennis', 'badminton', 'tischtennis', 'squash'], bonus: { ges: 3, aus: 1 } },
  { keywords: ['schach'], bonus: { int: 3, ges: 1 } },
  { keywords: ['tanzen', 'tanz'], bonus: { ges: 2, cha: 2 } },
  { keywords: ['wandern', 'bergsteigen'], bonus: { aus: 2, wil: 2 } },
];

const HOBBY_MAPPINGS: { keywords: string[]; bonus: Partial<Stats> }[] = [
  { keywords: ['lesen', 'bücher'], bonus: { int: 2 } },
  { keywords: ['musik', 'instrument', 'gitarre', 'klavier', 'schlagzeug'], bonus: { ges: 1, cha: 1 } },
  { keywords: ['kochen'], bonus: { ges: 1, aus: 1 } },
  { keywords: ['debattieren', 'rhetorik', 'politik'], bonus: { cha: 2, int: 1 } },
  { keywords: ['programmieren', 'coding', 'hacking'], bonus: { int: 2, ges: 1 } },
  { keywords: ['zeichnen', 'malen', 'kunst'], bonus: { ges: 2 } },
  { keywords: ['ehrenamt', 'freiwillig', 'sozial'], bonus: { cha: 2, wil: 1 } },
];

function logScale(value: number, scale: number, cap: number): number {
  if (value <= 0) return 0;
  return Math.min(Math.log(value + 1) * scale, cap);
}

function matchKeywords(input: string, keywords: string[]): boolean {
  const lower = input.toLowerCase().trim();
  return keywords.some((kw) => lower.includes(kw));
}

function sumBonuses(items: string[], mappings: { keywords: string[]; bonus: Partial<Stats> }[]): Partial<Stats> {
  const total: Partial<Stats> = {};
  for (const item of items) {
    for (const mapping of mappings) {
      if (matchKeywords(item, mapping.keywords)) {
        for (const [key, val] of Object.entries(mapping.bonus)) {
          const k = key as keyof Stats;
          total[k] = (total[k] ?? 0) + val;
        }
        break;
      }
    }
  }
  return total;
}

export function calculateStats(input: LifeInputs): Stats {
  const bias = getProfessionStatBias(input.profession);

  // Basis: fester Grundwert + Berufs-Bias
  const stats: Stats = {
    str: BASE_STAT + bias.str,
    aus: BASE_STAT + bias.aus,
    int: BASE_STAT + bias.int,
    ges: BASE_STAT + bias.ges,
    wil: BASE_STAT + bias.wil,
    cha: BASE_STAT + bias.cha,
  };

  // Erfahrungsjahre (logarithmisch gedeckelt, damit erfahren=stark aber nicht unbesiegbar)
  const expBonus = logScale(input.yearsExperience, 3, 15);
  stats.aus += Math.round(expBonus * 0.5);
  stats.wil += Math.round(expBonus * 0.3);
  // Primärwert des Berufs bekommt extra Erfahrungs-Bonus
  const primaryStat = getPrimaryStat(bias);
  stats[primaryStat] += Math.round(expBonus * 0.4);

  // Abschlüsse
  for (const degree of input.degrees) {
    const bonus = DEGREE_BONUSES[degree];
    if (bonus) {
      for (const [key, val] of Object.entries(bonus)) {
        stats[key as keyof Stats] += val;
      }
    }
  }

  // Sport-Boni
  const sportBonus = sumBonuses(input.sports, SPORT_MAPPINGS);
  for (const [key, val] of Object.entries(sportBonus)) {
    stats[key as keyof Stats] += val;
  }

  // BMI-Faktor (moderater Einfluss auf STR)
  if (input.body.weight > 0 && input.body.height > 0) {
    const heightM = input.body.height / 100;
    const bmi = input.body.weight / (heightM * heightM);
    if (bmi >= 22 && bmi <= 28) {
      stats.str += 2;
    } else if (bmi > 28) {
      stats.str += 1;
      stats.ges -= 1;
    }
  }

  // Hobby-Boni
  const hobbyBonus = sumBonuses(input.hobbies, HOBBY_MAPPINGS);
  for (const [key, val] of Object.entries(hobbyBonus)) {
    stats[key as keyof Stats] += val;
  }

  // Minimum 1 für jeden Wert
  for (const key of Object.keys(stats) as (keyof Stats)[]) {
    stats[key] = Math.max(1, Math.round(stats[key]));
  }

  return stats;
}

function getPrimaryStat(bias: Record<string, number>): keyof Stats {
  let max = 0;
  let primary: keyof Stats = 'str';
  for (const [key, val] of Object.entries(bias)) {
    if (val > max) {
      max = val;
      primary = key as keyof Stats;
    }
  }
  return primary;
}
