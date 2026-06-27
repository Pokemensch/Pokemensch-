import { describe, it, expect } from 'vitest';
import { calculateStats } from '../stats';

describe('calculateStats', () => {
  it('returns default stats for placeholder implementation', () => {
    const stats = calculateStats({
      profession: 'Maurer',
      yearsExperience: 30,
      sports: ['Kraftsport'],
      body: { weight: 90, height: 180 },
      degrees: ['Ausbildung'],
      hobbies: [],
    });

    expect(stats).toHaveProperty('str');
    expect(stats).toHaveProperty('aus');
    expect(stats).toHaveProperty('int');
    expect(stats).toHaveProperty('ges');
    expect(stats).toHaveProperty('wil');
    expect(stats).toHaveProperty('cha');
  });
});
