// src/constants/config.ts

import { Currency, SplitType, ExpenseCategory } from '../types';

/**
 * App Configuration Constants
 */

// ===== API Configuration =====
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'https://api.frankfurter.dev/v1'
    : 'https://api.frankfurter.dev/v1',

  CURRENCY_CACHE_VALIDITY: 24 * 60 * 60 * 1000,
  CURRENCY_REQUEST_TIMEOUT: 5000,

  LOCATION_API: 'https://nominatim.openstreetmap.org/search',
  LOCATION_DEBOUNCE: 400,
  LOCATION_CACHE_SIZE: 5,
  LOCATION_REQUEST_TIMEOUT: 5000,
  LOCATION_USER_AGENT: 'SplitTab-Assignment/User',

  MOCK_AUTH_DELAY: 500
} as const;

// ===== AsyncStorage Keys =====
export const STORAGE_KEYS = {
  USER_PROFILE: 'user:profile',
  GROUP_LIST: 'groups:list',
  GROUP_PREFIX: 'group:',
  EXPENSE_LIST: 'expenses:list',
  EXPENSE_PREFIX: 'expense:',
  SETTLEMENT_LIST: 'settlements:list',
  SETTLEMENT_PREFIX: 'settlement:',
  AUDITLOG_LIST: 'auditlogs:list',
  AUDITLOG_PREFIX: 'auditlog:',
  SESSION_TOKEN: 'session:token',
  CURRENCY_CACHE: 'cache:currency',
  LOCATION_CACHE: 'cache:locations'
} as const;

// ===== Numeric Constants =====
export const NUMERIC = {
  EPSILON: 0.01,
  CURRENCY_DECIMALS: 2,
  MAX_GROUP_SIZE: 20,
  MAX_DESCRIPTION_LENGTH: 200,
  MAX_LOCATION_RESULTS: 5,
  MAX_CACHED_LOCATIONS: 5,
  MAX_SETTLEMENT_AMOUNT: 999999.99
} as const;

// ===== UI Constants =====
export const UI = {
  BORDER_RADIUS: 8,
  BORDER_RADIUS_LARGE: 12,
  PADDING_BASE: 16,
  PADDING_SMALL: 8,
  MARGIN_BASE: 16,
  MARGIN_SMALL: 8,
  ANIMATION_DURATION: 300
} as const;

// ===== Colors =====
export const COLORS = {
  PRIMARY: '#4ECDC4',
  SECONDARY: '#FFE66D',
  DANGER: '#FF6B6B',
  SUCCESS: '#4ECDC4',
  WARNING: '#FFA500',
  INFO: '#4ECDC4',

  DARK: '#333333',
  GRAY: '#666666',
  LIGHT_GRAY: '#999999',
  LIGHT: '#CCCCCC',
  LIGHTER: '#E0E0E0',
  LIGHTEST: '#F5F5F5',
  WHITE: '#FFFFFF',

  BG_PRIMARY: '#FFFFFF',
  BG_SECONDARY: '#F5F5F5',
  BG_LIGHT: '#F9F9F9',

  BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  BORDER: '#E0E0E0'
} as const;

// ===== Text Sizes =====
export const TEXT_SIZES = {
  LARGE: 24,
  MEDIUM: 16,
  SMALL: 14,
  TINY: 12,
  MICRO: 10
} as const;

// ===== Validation =====
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MIN_LENGTH: 1,
  DESCRIPTION_MAX_LENGTH: 200,
  GROUP_NAME_MAX_LENGTH: 100
} as const;

// ===== Regex (Single Source of Truth) =====
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CURRENCY_CODE: /^[A-Z]{3}$/,
  PHONE: /^\+?[\d\s\-()]+$/,
  URL: /^https?:\/\/.+/,
  POSITIVE_NUMBER: /^\d+\.?\d{0,2}$/
} as const;

// ===== Messages =====
export const MESSAGES = {
  ERRORS: {
    REQUIRED_FIELD: '{field} is required',
    INVALID_EMAIL: 'Invalid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
    INVALID_AMOUNT: 'Invalid amount',
    SPLIT_VALIDATION: 'Split amounts do not match',
    NETWORK_ERROR: 'Network error. Please try again.',
    STORAGE_ERROR: 'Error saving data. Please try again.',
    NOT_FOUND: 'Item not found',
    PERMISSION_DENIED: 'You do not have permission to do this'
  },
  SUCCESS: {
    CREATED: '{item} created successfully',
    UPDATED: '{item} updated successfully',
    DELETED: '{item} deleted successfully',
    SAVED: 'Changes saved',
    SETTLED: 'Settlement recorded'
  },
  INFO: {
    LOADING: 'Loading...',
    OFFLINE: 'You are offline. Using cached data.',
    SYNC: 'Syncing data...'
  }
} as const;

// ===== Defaults =====
export const DEFAULTS: {
  CURRENCY: Currency;
  SPLIT_TYPE: SplitType;
  CATEGORY: ExpenseCategory;
  AVATAR_COLOR: string;
} = {
  CURRENCY: 'INR',
  SPLIT_TYPE: 'equal',
  CATEGORY: 'Other',
  AVATAR_COLOR: '#FF6B6B'
};

// ===== Time Constants =====
export const TIME = {
  ONE_SECOND: 1000,
  ONE_MINUTE: 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
  ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
  ONE_YEAR: 365 * 24 * 60 * 60 * 1000
} as const;

// ===== Analytics =====
export const ANALYTICS_EVENTS = {
  APP_OPENED: 'app_opened',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
  GROUP_CREATED: 'group_created',
  EXPENSE_CREATED: 'expense_created',
  SETTLEMENT_CREATED: 'settlement_created',
  EXPENSE_EDITED: 'expense_edited',
  EXPENSE_DELETED: 'expense_deleted'
} as const;

// ===== Feature Flags =====
export const FEATURES = {
  RECURRING_EXPENSES: false,
  SPLIT_PREDICTION: false,
  ADVANCED_ANALYTICS: false,
  EXPORT_DATA: false,
  SYNC_CLOUD: false
} as const;

// ===== Pagination =====
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  INITIAL_PAGE: 1
} as const;

// ===== Category Icons =====
export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  Food: '🍔',
  Travel: '✈️',
  Utilities: '💡',
  Entertainment: '🎬',
  Other: '📦'
};