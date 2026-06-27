import type { CharacterClass, Element } from './types';

interface ProfessionMapping {
  keywords: string[];
  class: CharacterClass;
  element: Element;
  statBias: { str: number; aus: number; int: number; ges: number; wil: number; cha: number };
}

const PROFESSION_MAPPINGS: ProfessionMapping[] = [
  // Krieger — Bau & Handwerk
  {
    keywords: ['maurer', 'schreiner', 'tischler', 'zimmerer', 'dachdecker', 'fliesenleger', 'maler', 'lackierer', 'stuckateur', 'betonbauer'],
    class: 'krieger', element: 'erde',
    statBias: { str: 3, aus: 2, int: 0, ges: 1, wil: 1, cha: 0 },
  },
  {
    keywords: ['elektriker', 'elektroniker', 'mechaniker', 'mechatroniker', 'schlosser', 'schweisser', 'schmied', 'installateur', 'klempner', 'anlagenmechaniker'],
    class: 'krieger', element: 'feuer',
    statBias: { str: 2, aus: 2, int: 1, ges: 1, wil: 1, cha: 0 },
  },
  // Krieger — Logistik & Transport
  {
    keywords: ['logistik', 'lager', 'fahrer', 'spedition', 'kurier', 'transport', 'post'],
    class: 'krieger', element: 'erde',
    statBias: { str: 2, aus: 3, int: 0, ges: 1, wil: 1, cha: 0 },
  },
  // Krieger — Sicherheit & Rettung
  {
    keywords: ['polizei', 'polizist', 'soldat', 'militär', 'bundeswehr', 'feuerwehr', 'rettung', 'sanitäter', 'sicherheit', 'wachschutz', 'justiz'],
    class: 'krieger', element: 'erde',
    statBias: { str: 2, aus: 2, int: 0, ges: 1, wil: 2, cha: 0 },
  },
  // Krieger — Sport & Fitness
  {
    keywords: ['sportler', 'trainer', 'fitness', 'athlet', 'coach sport'],
    class: 'krieger', element: 'sturm',
    statBias: { str: 2, aus: 2, int: 0, ges: 2, wil: 1, cha: 0 },
  },
  // Magier — Recht & Verwaltung
  {
    keywords: ['anwalt', 'jurist', 'richter', 'notar', 'recht', 'verwaltung', 'beamter', 'beamte', 'finanzamt', 'steuerberater'],
    class: 'magier', element: 'licht',
    statBias: { str: 0, aus: 0, int: 3, ges: 0, wil: 2, cha: 2 },
  },
  // Magier — IT & Technik
  {
    keywords: ['programmierer', 'entwickler', 'software', 'informatik', 'it', 'admin', 'devops', 'data', 'ingenieur', 'techniker'],
    class: 'magier', element: 'sturm',
    statBias: { str: 0, aus: 0, int: 3, ges: 2, wil: 1, cha: 0 },
  },
  // Magier — Wissenschaft & Lehre
  {
    keywords: ['wissenschaft', 'forscher', 'professor', 'dozent', 'lehrer', 'lehre', 'chemie', 'physik', 'biologie', 'mathematik'],
    class: 'magier', element: 'licht',
    statBias: { str: 0, aus: 0, int: 3, ges: 0, wil: 2, cha: 1 },
  },
  // Schurke — Vertrieb & Marketing
  {
    keywords: ['vertrieb', 'verkauf', 'verkäufer', 'marketing', 'handel', 'kaufmann', 'kauffrau', 'makler', 'berater'],
    class: 'schurke', element: 'sturm',
    statBias: { str: 0, aus: 0, int: 1, ges: 2, wil: 0, cha: 3 },
  },
  // Schurke — Kreativ & Design
  {
    keywords: ['designer', 'grafik', 'design', 'medien', 'fotograf', 'film', 'kunst', 'kreativ', 'content', 'journalist', 'redakteur', 'autor'],
    class: 'schurke', element: 'schatten',
    statBias: { str: 0, aus: 0, int: 1, ges: 3, wil: 0, cha: 2 },
  },
  // Schurke/Krieger — Gastronomie
  {
    keywords: ['koch', 'küche', 'gastro', 'gastronomie', 'bäcker', 'konditor', 'metzger', 'fleischer'],
    class: 'schurke', element: 'feuer',
    statBias: { str: 1, aus: 2, int: 0, ges: 2, wil: 1, cha: 1 },
  },
  // Priester — Pflege & Medizin
  {
    keywords: ['pflege', 'krankenpfleger', 'krankenschwester', 'altenpflege', 'arzt', 'ärztin', 'medizin', 'therapeut', 'therapie', 'physiotherapie', 'apotheke', 'apotheker', 'zahnarzt'],
    class: 'priester', element: 'licht',
    statBias: { str: 0, aus: 1, int: 2, ges: 0, wil: 2, cha: 2 },
  },
  // Priester — Sozial & Bildung
  {
    keywords: ['sozial', 'erzieher', 'erzieherin', 'pädagoge', 'coaching', 'coach', 'psychologe', 'seelsorge', 'bildung', 'betreuer'],
    class: 'priester', element: 'licht',
    statBias: { str: 0, aus: 0, int: 1, ges: 0, wil: 2, cha: 3 },
  },
];

export function getClassForProfession(profession: string): CharacterClass {
  const mapping = findProfessionMapping(profession);
  return mapping?.class ?? 'krieger';
}

export function getElementForProfession(profession: string): Element {
  const mapping = findProfessionMapping(profession);
  return mapping?.element ?? 'erde';
}

export function getProfessionStatBias(profession: string) {
  const mapping = findProfessionMapping(profession);
  return mapping?.statBias ?? { str: 1, aus: 1, int: 1, ges: 1, wil: 1, cha: 1 };
}

function findProfessionMapping(profession: string): ProfessionMapping | undefined {
  const lower = profession.toLowerCase().trim();
  return PROFESSION_MAPPINGS.find((m) =>
    m.keywords.some((kw) => lower.includes(kw))
  );
}
