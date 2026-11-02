import { describe, expect, it } from 'vitest';
import { DEFAULT_CURRENCY, formatCurrency } from './evmCalculations';
import { createEmptyProject, sampleProject } from '../data/sampleProject';

// Intl usa espacios no separables; se normalizan para comparar.
const norm = (s: string) => s.replace(/\s/g, ' ');

describe('R19 formatCurrency USD', () => {
  it('la moneda por defecto es USD', () => {
    expect(DEFAULT_CURRENCY).toBe('USD');
  });
  it('formato panameño: USD, coma de miles, sin decimales', () => {
    expect(norm(formatCurrency(5070000))).toBe('USD 5,070,000');
    expect(norm(formatCurrency(1234.56))).toBe('USD 1,235');
    expect(norm(formatCurrency(0))).toBe('USD 0');
  });
  it('negativos', () => {
    expect(norm(formatCurrency(-23000))).toBe('-USD 23,000');
  });
  it('respeta otra moneda explícita', () => {
    expect(norm(formatCurrency(1234, 'PAB'))).toBe('B/. 1,234');
    expect(norm(formatCurrency(1234, 'USD'))).toBe('USD 1,234');
  });
});

describe('R20 monedas por defecto', () => {
  it('el proyecto de ejemplo está en USD', () => {
    expect(sampleProject.currency).toBe('USD');
  });
  it('un proyecto vacío nuevo está en USD', () => {
    expect(createEmptyProject().currency).toBe('USD');
  });
});
