import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Settlement } from '../types';

interface SettlementsState {
  settlements: Settlement[];
}

const initialState: SettlementsState = {
  settlements: [],
};

const settlementsSlice = createSlice({
  name: 'settlements',
  initialState,
  reducers: {
    // ✅ ADD SETTLEMENT
    addSettlement: (
      state,
      action: PayloadAction<
        Omit<Settlement, 'id' | 'createdAt'>
      >
    ) => {
      const payload = action.payload;

      // ✅ Basic validation (optional but good)
      if (!payload.groupId || !payload.fromUserId || !payload.toUserId) {
        console.warn('Invalid settlement payload');
        return;
      }

      const newSettlement: Settlement = {
        id: `settlement-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
      };

      state.settlements.push(newSettlement);
    },

    // ❌ REMOVED filterSettlements (use selectors instead)
  },
});

export const { addSettlement } = settlementsSlice.actions;
export default settlementsSlice.reducer;