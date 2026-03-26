import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrencyRate } from '../types';

interface CurrencyState {
  rates: CurrencyRate | null;
  isOffline: boolean;
}

const initialState: CurrencyState = {
  rates: null,
  isOffline: false,
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setRates: (state, action: PayloadAction<CurrencyRate>) => {
      state.rates = action.payload;
      state.isOffline = false;
    },

    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;

      // ✅ optional safety: keep last known rates
      if (action.payload && !state.rates) {
        console.warn('Offline mode enabled but no currency rates available');
      }
    },

    // ✅ NEW: reset on logout
    resetCurrency: () => initialState,
  },
});

export const { setRates, setOfflineMode, resetCurrency } =
  currencySlice.actions;

export default currencySlice.reducer;