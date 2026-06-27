import type { Attack } from './battle-types';
import type { CharacterClass } from './types';

const KRIEGER_ATTACKS: Attack[] = [
  {
    key: 'lehmschelle', name: 'Lehmschelle', element: 'erde', type: 'physical',
    basePower: 6, cost: 0, primaryStat: 'str',
    effect: { type: 'accuracy_down', value: -2, duration: 2 },
  },
  {
    key: 'verputzen', name: 'Verputzen', element: null, type: 'defensive',
    basePower: 0, cost: 0, primaryStat: 'aus',
    effect: { type: 'defense_up', value: 4, duration: 2 },
  },
  {
    key: 'maurerhammer', name: 'Maurerhammer', element: 'erde', type: 'physical',
    basePower: 10, cost: 0, primaryStat: 'str',
    effect: null,
  },
  {
    key: 'trockenbau_wand', name: 'Trockenbau-Wand', element: null, type: 'defensive',
    basePower: 0, cost: 0, primaryStat: 'aus',
    effect: { type: 'block_next', value: 1, duration: 1 },
  },
];

const MAGIER_ATTACKS: Attack[] = [
  {
    key: 'erkenntnis', name: 'Erkenntnis', element: 'licht', type: 'magical',
    basePower: 7, cost: 0, primaryStat: 'int',
    effect: null,
  },
  {
    key: 'kreuzverhoer', name: 'Kreuzverhör', element: 'licht', type: 'magical',
    basePower: 9, cost: 0, primaryStat: 'int',
    effect: { type: 'debuff_stat', stat: 'wil', value: -2, duration: 2 },
  },
  {
    key: 'logik_schild', name: 'Logik-Schild', element: null, type: 'defensive',
    basePower: 0, cost: 0, primaryStat: 'int',
    effect: { type: 'defense_up', value: 5, duration: 2 },
  },
  {
    key: 'plaedoyer', name: 'Plädoyer', element: null, type: 'buff',
    basePower: 0, cost: 0, primaryStat: 'cha',
    effect: { type: 'buff_stat', stat: 'cha', value: 3, duration: 3 },
  },
];

const SCHURKE_ATTACKS: Attack[] = [
  {
    key: 'schnellschnitt', name: 'Schnellschnitt', element: 'sturm', type: 'physical',
    basePower: 5, cost: 0, primaryStat: 'ges',
    effect: null,
  },
  {
    key: 'doppelschlag', name: 'Doppelschlag', element: null, type: 'physical',
    basePower: 4, cost: 0, primaryStat: 'ges',
    effect: { type: 'bleed', value: 2, duration: 2 },
  },
  {
    key: 'finte', name: 'Finte', element: null, type: 'debuff',
    basePower: 3, cost: 0, primaryStat: 'ges',
    effect: { type: 'accuracy_down', value: -3, duration: 2 },
  },
  {
    key: 'verhandlung', name: 'Verhandlung', element: null, type: 'buff',
    basePower: 0, cost: 0, primaryStat: 'cha',
    effect: { type: 'buff_stat', stat: 'cha', value: 3, duration: 3 },
  },
];

const PRIESTER_ATTACKS: Attack[] = [
  {
    key: 'zuspruch', name: 'Zuspruch', element: 'licht', type: 'magical',
    basePower: 5, cost: 0, primaryStat: 'wil',
    effect: { type: 'buff_stat', stat: 'wil', value: 2, duration: 2 },
  },
  {
    key: 'verband', name: 'Verband', element: null, type: 'defensive',
    basePower: 0, cost: 0, primaryStat: 'wil',
    effect: { type: 'heal', value: 6, duration: 1 },
  },
  {
    key: 'schutzaura', name: 'Schutzaura', element: 'licht', type: 'defensive',
    basePower: 0, cost: 0, primaryStat: 'wil',
    effect: { type: 'defense_up', value: 5, duration: 3 },
  },
  {
    key: 'achtsamkeit', name: 'Achtsamkeit', element: null, type: 'buff',
    basePower: 0, cost: 0, primaryStat: 'wil',
    effect: { type: 'focus', value: 3, duration: 2 },
  },
];

const ATTACKS_BY_CLASS: Record<CharacterClass, Attack[]> = {
  krieger: KRIEGER_ATTACKS,
  magier: MAGIER_ATTACKS,
  schurke: SCHURKE_ATTACKS,
  priester: PRIESTER_ATTACKS,
};

export function getAttacksForClass(characterClass: CharacterClass): Attack[] {
  return ATTACKS_BY_CLASS[characterClass];
}
