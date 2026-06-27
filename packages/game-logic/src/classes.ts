export type CharacterClass = 'krieger' | 'magier' | 'schurke' | 'priester';

export function getClassForProfession(_profession: string): CharacterClass {
  // Phase 2: Berufsgruppen-Zuordnung kommt hier rein
  return 'krieger';
}
