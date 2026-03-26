// Core Types for SplitTab Application

export type Currency = 'INR' | 'USD' | 'EUR';
export type AvatarColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink' | 'teal';
export type ExpenseCategory = 'Food' | 'Travel' | 'Utilities' | 'Entertainment' | 'Other';
export type SplitType = 'equal' | 'exact' | 'percentage' | 'shares';

export interface User {
  id: string;
  name: string;
  email: string;
  currency: Currency;
  avatarColor: AvatarColor;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatarColor: AvatarColor;
}

export interface Group {
  id: string;
  name: string;
  icon: string;
  description?: string;
  memberIds: string[];
  createdAt: string;
  archived: boolean;
  lastActivity: string;
}

export interface SplitDetail {
  userId: string;
  amount: number;
}

export interface ExpenseSplit {
  type: SplitType;
  participants: SplitDetail[];
}

export interface Location {
  displayName: string;
  lat: number;
  lon: number;
}

export interface Expense {
  id: string;
  groupId: string;
  amount: number;
  currency: Currency;
  description: string;
  date: string;
  category: ExpenseCategory;
  paidBy: string;
  split: ExpenseSplit;
  receiptPhoto?: string;
  location?: Location;
  createdAt: string;
  historicalRate?: number; // Exchange rate at time of creation
  auditLog: AuditLogEntry[];
}

export interface AuditLogEntry {
  timestamp: string;
  userId: string;
  changes: string;
}

export interface Settlement {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: Currency;
  date: string;
  createdAt: string;
  note?: string;
}

export interface Balance {
  userId: string;
  netBalance: number; // Positive if owed to user, negative if user owes
}

export interface SettlementSuggestion {
  from: string;
  to: string;
  amount: number;
}

export interface CurrencyRate {
  base: Currency;
  rates: Record<Currency, number>;
  timestamp: string;
}

export interface LocationSearchResult {
  displayName: string;
  lat: string;
  lon: string;
  placeId: string;
}

export interface NotificationPayload {
  type: 'expense' | 'settlement';
  groupId: string;
  expenseId?: string;
  settlementId?: string;
  message: string;
}

export interface UserStats {
  totalPaid: number;
  totalSettled: number;
  activeGroups: number;
}
