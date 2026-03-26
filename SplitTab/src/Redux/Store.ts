import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './authSlice';
import groupsReducer from './groupsSlice';
import expensesReducer from './expensesSlice';
import settlementsReducer from './settlementsSlice';
import currencyReducer from './currencySlice';

const PERSIST_KEY = 'splittab_state';

// ✅ STORE
export const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupsReducer,
    expenses: expensesReducer,
    settlements: settlementsReducer,
    currency: currencyReducer,
  },
});

// ✅ TYPES
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


// ✅ SAVE STATE (AsyncStorage)
const saveState = async (state: RootState) => {
  try {
    const serialized = JSON.stringify({
      auth: state.auth,
      groups: state.groups,
      expenses: state.expenses,
      settlements: state.settlements,
      currency: state.currency,
    });

    await AsyncStorage.setItem(PERSIST_KEY, serialized);
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};


// ✅ LOAD STATE
export const loadPersistedState = async () => {
  try {
    const serialized = await AsyncStorage.getItem(PERSIST_KEY);
    if (!serialized) return undefined;

    return JSON.parse(serialized);
  } catch (error) {
    console.error('Failed to load state:', error);
    return undefined;
  }
};


// ✅ SUBSCRIBE (with debounce for performance)
let timeout: ReturnType<typeof setTimeout>;

store.subscribe(() => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    saveState(store.getState());
  }, 500);
});