export type Element = 'wasser' | 'feuer' | 'schatten' | 'licht' | 'erde' | 'sturm';

export function getElementModifier(_attacker: Element, _defender: Element): number {
  // Phase 3: Element-Matrix kommt hier rein
  return 1.0;
}
