export interface AttackResult {
  damage: number;
  log: string;
}

export function resolveAttack(): AttackResult {
  // Phase 3: Hier kommt der Kampf-Resolver rein
  return { damage: 0, log: 'Not implemented yet' };
}
