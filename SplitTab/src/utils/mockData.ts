import { Contact, AvatarColor, Currency, ExpenseCategory } from '../types';

/**
 * Mock Contacts
 */
export const MOCK_CONTACTS: Contact[] = [
  { id: 'contact-1', name: 'Alice Johnson', email: 'alice@example.com', avatarColor: 'blue' },
  { id: 'contact-2', name: 'Bob Smith', email: 'bob@example.com', avatarColor: 'green' },
  { id: 'contact-3', name: 'Carol Davis', email: 'carol@example.com', avatarColor: 'purple' },
  { id: 'contact-4', name: 'David Wilson', email: 'david@example.com', avatarColor: 'orange' },
  { id: 'contact-5', name: 'Emma Brown', email: 'emma@example.com', avatarColor: 'pink' },
  { id: 'contact-6', name: 'Frank Miller', email: 'frank@example.com', avatarColor: 'teal' },
];

/**
 * Avatar Colors (STRICT TYPE SAFE)
 */
export const AVATAR_COLORS: readonly AvatarColor[] = [
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'orange',
  'pink',
  'teal',
];

/**
 * Expense Categories
 */
export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  'Food',
  'Travel',
  'Utilities',
  'Entertainment',
  'Other',
];

/**
 * Supported Currencies
 */
export const CURRENCIES: readonly Currency[] = ['INR', 'USD', 'EUR'];

/**
 * Group Icons
 */
export const GROUP_ICONS = [
  '🏠', '✈️', '🍕', '🎬', '🎮', '🏋️', '🎵', '📚', '🏖️', '🎉',
  '🍔', '🚗', '💼', '🎓', '⚽', '🎨', '🏥', '🛒', '🎭', '🌍',
] as const;

/**
 * Optional: Derived Types (VERY USEFUL 🔥)
 */
export type GroupIcon = typeof GROUP_ICONS[number];
export type CurrencyType = typeof CURRENCIES[number];
export type CategoryType = typeof EXPENSE_CATEGORIES[number];