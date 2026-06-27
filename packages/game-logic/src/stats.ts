export interface LifeInputs {
  profession: string;
  yearsExperience: number;
  sports: string[];
  body: { weight: number; height: number };
  degrees: string[];
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

export function calculateStats(_input: LifeInputs): Stats {
  // Phase 2: Hier kommen die echten Formeln rein
  return { str: 10, aus: 10, int: 10, ges: 10, wil: 10, cha: 10 };
}
