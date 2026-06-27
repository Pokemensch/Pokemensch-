export type CharacterClass = 'krieger' | 'magier' | 'schurke' | 'priester';

export type Element = 'wasser' | 'feuer' | 'schatten' | 'licht' | 'erde' | 'sturm';

export type Degree =
  | 'hauptschule'
  | 'realschule'
  | 'abitur'
  | 'ausbildung'
  | 'meister'
  | 'bachelor'
  | 'master'
  | 'staatsexamen'
  | 'promotion';

export interface LifeInputs {
  profession: string;
  yearsExperience: number;
  sports: string[];
  body: { weight: number; height: number };
  degrees: Degree[];
  hobbies: string[];
}

export interface Stats {
  str: number;
  aus: number;
  int: number;
  ges: number;
  wil: number;
  cha: number;
}

export interface CharacterProfile {
  class: CharacterClass;
  element: Element;
  stats: Stats;
}
