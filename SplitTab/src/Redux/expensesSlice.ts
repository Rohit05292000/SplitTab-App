import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense, AuditLogEntry } from '../types';

interface ExpensesState {
  expenses: Expense[];
}

const initialState: ExpensesState = {
  expenses: [],
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    // ✅ ADD EXPENSE
    addExpense: (
      state,
      action: PayloadAction<
        Omit<Expense, 'id' | 'createdAt' | 'auditLog'>
      >
    ) => {
      const newExpense: Expense = {
        id: `expense-${Date.now()}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
        auditLog: [
          {
            timestamp: new Date().toISOString(),
            userId: action.payload.paidBy,
            changes: 'Expense created',
          },
        ],
      };

      state.expenses.push(newExpense);
    },

    // ✅ UPDATE EXPENSE
    updateExpense: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Expense>;
        userId: string;
      }>
    ) => {
      const index = state.expenses.findIndex(
        e => e.id === action.payload.id
      );

      if (index === -1) return;

      const oldExpense = state.expenses[index];
      const updates = action.payload.updates;

      const changes: string[] = [];

      Object.keys(updates).forEach(key => {
        const typedKey = key as keyof Expense;

        const oldValue = oldExpense[typedKey];
        const newValue = updates[typedKey];

        // ✅ Better comparison (handles objects)
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes.push(`${key} updated`);
        }
      });

      // ❗ Only add audit if something changed
      if (changes.length === 0) return;

      const auditEntry: AuditLogEntry = {
        timestamp: new Date().toISOString(),
        userId: action.payload.userId,
        changes: changes.join(', '),
      };

      state.expenses[index] = {
        ...oldExpense,
        ...updates,
        auditLog: [...oldExpense.auditLog, auditEntry],
      };
    },

    // ✅ DELETE EXPENSE
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(
        e => e.id !== action.payload
      );
    },
  },
});

export const {
  addExpense,
  updateExpense,
  deleteExpense,
} = expensesSlice.actions;

export default expensesSlice.reducer;