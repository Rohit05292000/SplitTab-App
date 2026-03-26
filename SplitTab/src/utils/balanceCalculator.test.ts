import { calculateMinimumSettlements, validateSplit } from './balanceCalculator';
import { Balance } from '../types';

const round = (num: number) => Math.round(num * 100) / 100;

describe('Settlement Algorithm', () => {
  it('should calculate minimum settlements for simple case', () => {
    const balances: Balance[] = [
      { userId: 'user-1', netBalance: 100 },
      { userId: 'user-2', netBalance: -100 },
    ];

    const suggestions = calculateMinimumSettlements(balances);

    expect(suggestions).toHaveLength(1);

    const txn = suggestions[0];
    expect(txn.from).toBe('user-2');
    expect(txn.to).toBe('user-1');
    expect(round(txn.amount)).toBe(100);
  });

  it('should handle circular debts correctly', () => {
    const balances: Balance[] = [
      { userId: 'alice', netBalance: 150 },
      { userId: 'bob', netBalance: 0 },
      { userId: 'carol', netBalance: -150 },
    ];

    const suggestions = calculateMinimumSettlements(balances);

    expect(suggestions).toHaveLength(1);

    const txn = suggestions[0];
    expect(txn.from).toBe('carol');
    expect(txn.to).toBe('alice');
    expect(round(txn.amount)).toBe(150);
  });

  it('should minimize number of transactions for complex case', () => {
    const balances: Balance[] = [
      { userId: 'alice', netBalance: 100 },
      { userId: 'bob', netBalance: -50 },
      { userId: 'carol', netBalance: -30 },
      { userId: 'david', netBalance: -20 },
    ];

    const suggestions = calculateMinimumSettlements(balances);

    // Max 3 transactions
    expect(suggestions.length).toBeLessThanOrEqual(3);

    const totalFrom = suggestions.reduce((sum, s) => sum + s.amount, 0);
    expect(round(totalFrom)).toBe(100);
  });

  it('should handle zero balances', () => {
    const balances: Balance[] = [
      { userId: 'alice', netBalance: 0 },
      { userId: 'bob', netBalance: 0 },
    ];

    const suggestions = calculateMinimumSettlements(balances);

    expect(suggestions).toHaveLength(0);
  });

  it('should ignore small rounding errors', () => {
    const balances: Balance[] = [
      { userId: 'alice', netBalance: 100 },
      { userId: 'bob', netBalance: -99.99 },
      { userId: 'carol', netBalance: -0.01 },
    ];

    const suggestions = calculateMinimumSettlements(balances);

    expect(suggestions.length).toBeLessThanOrEqual(2);

    const total = suggestions.reduce((sum, s) => sum + s.amount, 0);
    expect(round(total)).toBe(100);
  });
});

describe('Split Validation', () => {
  it('should validate equal split', () => {
    const result = validateSplit('equal', 100, [
      { userId: 'user-1', amount: 50 },
      { userId: 'user-2', amount: 50 },
    ]);

    expect(result.valid).toBe(true);
  });

  it('should validate exact split correctly', () => {
    const result = validateSplit('exact', 100, [
      { userId: 'user-1', amount: 60 },
      { userId: 'user-2', amount: 40 },
    ]);

    expect(result.valid).toBe(true);
  });

  it('should reject exact split that does not sum to total', () => {
    const result = validateSplit('exact', 100, [
      { userId: 'user-1', amount: 60 },
      { userId: 'user-2', amount: 50 },
    ]);

    expect(result.valid).toBe(false);
    expect(result.error?.toLowerCase()).toContain('sum');
  });

  it('should validate percentage split', () => {
    const result = validateSplit('percentage', 100, [
      { userId: 'user-1', amount: 60 },
      { userId: 'user-2', amount: 40 },
    ]);

    expect(result.valid).toBe(true);
  });

  it('should reject percentage split that does not sum to 100', () => {
    const result = validateSplit('percentage', 100, [
      { userId: 'user-1', amount: 60 },
      { userId: 'user-2', amount: 50 },
    ]);

    expect(result.valid).toBe(false);
    expect(result.error?.toLowerCase()).toContain('100');
  });

  it('should reject empty participants', () => {
    const result = validateSplit('equal', 100, []);

    expect(result.valid).toBe(false);
    expect(result.error?.toLowerCase()).toContain('participant');
  });
});