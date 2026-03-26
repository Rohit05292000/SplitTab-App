import { Expense, Settlement, Balance, SettlementSuggestion, Currency } from '../types';

/**
 * Utility to round to 2 decimals
 */
const round = (num: number) => Math.round(num * 100) / 100;

/**
 * Calculate balances per user
 */
export const calculateBalances = (
  expenses: Expense[],
  settlements: Settlement[],
  groupId: string,
  userCurrency: Currency,
  convertAmount: (amount: number, from: Currency, to: Currency) => number
): Balance[] => {
  const balanceMap = new Map<string, number>();

  const addBalance = (userId: string, amount: number) => {
    const current = balanceMap.get(userId) || 0;
    balanceMap.set(userId, round(current + amount));
  };

  // Expenses
  expenses
    .filter(e => e.groupId === groupId)
    .forEach(expense => {
      const total = convertAmount(expense.amount, expense.currency, userCurrency);

      // payer gets total
      addBalance(expense.paidBy, total);

      // participants pay their share
      expense.split.participants.forEach(p => {
        const share = convertAmount(p.amount, expense.currency, userCurrency);
        addBalance(p.userId, -share);
      });
    });

  // Settlements
  settlements
    .filter(s => s.groupId === groupId)
    .forEach(s => {
      const amount = convertAmount(s.amount, s.currency, userCurrency);

      addBalance(s.fromUserId, -amount);
      addBalance(s.toUserId, amount);
    });

  return Array.from(balanceMap.entries()).map(([userId, netBalance]) => ({
    userId,
    netBalance: round(netBalance),
  }));
};

/**
 * Minimum settlement (Greedy)
 */
export const calculateMinimumSettlements = (
  balances: Balance[]
): SettlementSuggestion[] => {
  const suggestions: SettlementSuggestion[] = [];

  const creditors = balances
    .filter(b => b.netBalance > 0.01)
    .map(b => ({ userId: b.userId, netBalance: round(b.netBalance) }))
    .sort((a, b) => b.netBalance - a.netBalance);

  const debtors = balances
    .filter(b => b.netBalance < -0.01)
    .map(b => ({
      userId: b.userId,
      netBalance: round(Math.abs(b.netBalance)),
    }))
    .sort((a, b) => b.netBalance - a.netBalance);

  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const amount = round(Math.min(creditor.netBalance, debtor.netBalance));

    if (amount > 0.01) {
      suggestions.push({
        from: debtor.userId,
        to: creditor.userId,
        amount,
      });
    }

    creditor.netBalance = round(creditor.netBalance - amount);
    debtor.netBalance = round(debtor.netBalance - amount);

    if (creditor.netBalance <= 0.01) i++;
    if (debtor.netBalance <= 0.01) j++;
  }

  return suggestions;
};

/**
 * Validate split
 */
export const validateSplit = (
  splitType: 'equal' | 'exact' | 'percentage' | 'shares',
  totalAmount: number,
  participants: { userId: string; amount: number }[]
): { valid: boolean; error?: string } => {
  if (!participants.length) {
    return { valid: false, error: 'At least one participant required' };
  }

  const sum = participants.reduce((acc, p) => acc + p.amount, 0);
  const tolerance = 0.01;

  switch (splitType) {
    case 'exact':
      if (Math.abs(sum - totalAmount) > tolerance) {
        return {
          valid: false,
          error: `Split must sum to ${totalAmount}`,
        };
      }
      break;

    case 'percentage':
      if (Math.abs(sum - 100) > tolerance) {
        return {
          valid: false,
          error: 'Percentages must sum to 100%',
        };
      }
      break;

    case 'shares':
      if (sum <= 0) {
        return {
          valid: false,
          error: 'Total shares must be greater than 0',
        };
      }
      break;
  }

  return { valid: true };
};

/**
 * Equal split (FIXED rounding issue)
 */
export const calculateEqualSplit = (
  totalAmount: number,
  participantIds: string[]
) => {
  const base = Math.floor((totalAmount / participantIds.length) * 100) / 100;
  let remainder = round(totalAmount - base * participantIds.length);

  return participantIds.map((userId, index) => {
    const extra = remainder > 0 ? 0.01 : 0;
    remainder = round(remainder - extra);

    return {
      userId,
      amount: round(base + extra),
    };
  });
};

/**
 * Percentage split
 */
export const calculatePercentageSplit = (
  totalAmount: number,
  participants: { userId: string; amount: number }[]
) => {
  return participants.map(p => ({
    userId: p.userId,
    amount: round((totalAmount * p.amount) / 100),
  }));
};

/**
 * Shares split
 */
export const calculateSharesSplit = (
  totalAmount: number,
  participants: { userId: string; amount: number }[]
) => {
  const totalShares = participants.reduce((acc, p) => acc + p.amount, 0);

  return participants.map(p => ({
    userId: p.userId,
    amount: round((totalAmount * p.amount) / totalShares),
  }));
};