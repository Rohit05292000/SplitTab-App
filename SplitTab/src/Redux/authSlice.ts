import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Currency, AvatarColor } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  loading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      state.loading = true;
      if (
        action.payload.email === 'demo@splittab.com' &&
        action.payload.password === 'demo123'
      ) {
        state.isAuthenticated = true;

        state.user = {
          id: 'user-1',
          name: 'Demo User', // ✅ consistent
          email: action.payload.email,
          currency: 'INR',
          avatarColor: 'blue',
          createdAt: new Date().toISOString(),
        };
      }
      state.loading = false;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.hasCompletedOnboarding = false;
    },

    completeOnboarding: (
      state,
      action: PayloadAction<Omit<User, 'id' | 'createdAt'>>
    ) => {
      state.user = {
        id: 'user-1',
        ...action.payload, // ✅ expects `name`
        createdAt: new Date().toISOString(),
      };
      state.hasCompletedOnboarding = true;
      state.isAuthenticated = true;
    },

    updateProfile: (
      state,
      action: PayloadAction<{
        name?: string;
        avatarColor?: AvatarColor;
      }>
    ) => {
      if (!state.user) return;

      if (action.payload.name !== undefined) {
        state.user.name = action.payload.name; // ✅ FIXED
      }

      if (action.payload.avatarColor !== undefined) {
        state.user.avatarColor = action.payload.avatarColor;
      }
    },

    updateCurrency: (state, action: PayloadAction<Currency>) => {
      if (state.user) {
        state.user.currency = action.payload;
      }
    },

    restoreSession: (state, action: PayloadAction<AuthState>) => {
      return action.payload;
    },
  },
});

export const {
  login,
  logout,
  completeOnboarding,
  updateProfile,
  updateCurrency,
  restoreSession,
} = authSlice.actions;

export default authSlice.reducer;