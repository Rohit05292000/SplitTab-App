# SplitTab Architecture Documentation

> The architecture is designed with a **client-first, offline-capable approach**, ensuring reliability even without backend connectivity.

---

## 1. Data Model

### Schema & Storage Choice

We use **Redux Toolkit** with **AsyncStorage** persistence for client-side state management.

* **Redux Toolkit**: Provides predictable state management with built-in immutability and middleware support
* **AsyncStorage**: Enables session persistence across app restarts without a backend
* **Type Safety**: Full TypeScript integration ensures compile-time type checking

---

### Core Entities

```typescript
User {
  id: string
  displayName: string
  email: string
  currency: Currency (INR/USD/EUR)
  avatarColor: AvatarColor
  createdAt: string
}

Group {
  id: string
  name: string
  icon: string
  description?: string
  memberIds: string[]
  createdAt: string
  archived: boolean
  lastActivity: string
}

Expense {
  id: string
  groupId: string
  amount: number
  currency: Currency
  description: string
  date: string
  category: ExpenseCategory
  paidBy: string
  split: ExpenseSplit {
    type: SplitType (equal/exact/percentage/shares)
    participants: { userId: string, amount: number }[]
  }
  receiptPhoto?: string
  location?: Location
  historicalRate?: number
  auditLog: AuditLogEntry[]
}

Settlement {
  id: string
  groupId: string
  fromUserId: string
  toUserId: string
  amount: number
  currency: Currency
  date: string
  note?: string
}
```

---

### Redux Store Structure

```
Redux/
├── Store.ts
├── authSlice.ts
├── groupsSlice.ts
├── expensesSlice.ts
├── settlementsSlice.ts
└── currencySlice.ts
```

---

### Persistence Layer

We use **redux-persist** with **AsyncStorage** to automatically persist and rehydrate Redux state across app restarts.

---

## 2. Settlement Algorithm

### Overview

The settlement system is implemented using a **Greedy Optimization Algorithm** to minimize the number of transactions required to settle balances.

---

### Algorithm Steps

1. **Separate balances** into:

   * `creditors[]`: Users who are owed money
   * `debtors[]`: Users who owe money

2. **Sort both lists** in descending order of absolute balance

3. **Match largest creditor with largest debtor**:

   * Settlement amount = `min(creditor.balance, debtor.balance)`
   * Reduce both balances accordingly
   * Record settlement transaction

4. **Remove settled entries**:

   * If balance becomes 0, move pointer

5. **Repeat** until all balances are settled

---

### Circular Debt Example

```
Initial State:
- Alice paid $300 (3 people → $100 each)
- Bob paid $150 (3 people → $50 each)
- Carol paid $0

Expected Contribution: $150 each

Balances:
- Alice: +150
- Bob: 0
- Carol: -150

Settlement:
Carol → Alice: $150

Result: 1 transaction (optimal)
```

---

### Complexity

* **Time Complexity**: O(n log n)
* **Space Complexity**: O(n)

---

### Testing

The algorithm is covered with unit tests including:

* Basic settlements
* Circular debt scenarios
* Edge cases (zero/equal balances)

---

## 3. Balance Consistency

### Where Balances are Computed

Balances are **computed on-demand**, not stored.

```typescript
calculateBalances(expenses, settlements, groupId, currency)
```

---

### Computation Flow

1. Process **expenses**:

   * Add full amount to payer
   * Subtract split shares from participants

2. Process **settlements**:

   * Deduct from payer
   * Add to receiver

3. Return balances in user’s currency

---

### Consistency Strategy

This follows a **derived state pattern**, ensuring a single source of truth.

✅ Benefits:

* No stale or duplicated data
* Always reflects latest updates
* Maintains accurate audit trail

---

### Performance Note

Memoization (e.g., selectors / `useMemo`) can optimize recomputation for larger datasets.

---

## 4. Split Validation

### Location

`src/utils/balanceCalculator.ts → validateSplit()`

---

### Validation Rules

```typescript
equal: participants.length > 0
exact: sum(amounts) === totalAmount
percentage: sum(percentages) === 100
shares: totalShares > 0
```

---

### Data Safety

Invalid data is prevented at multiple layers:

1. UI validation (disabled submit)
2. Pre-dispatch validation
3. TypeScript type safety
4. Floating-point tolerance (0.01)

---

## 5. Currency Architecture

### Flow Example (Offline Scenario)

1. Expense created in USD
2. Cached exchange rate used
3. Stored with `historicalRate`
4. Display converted value in INR
5. Sync updated rates when online

---

### Key Design Decisions

* Historical rates ensure consistency
* Offline support via cached rates
* Transparent UI indicators
* Periodic rate refresh

---

## 6. Location Search

### Debounce Strategy

* 400ms delay before API call
* Prevents excessive requests

---

### Cancellation Strategy

* Uses `AbortController`
* Cancels previous API calls

---

### Flow

User Input → Debounce → Cancel Previous → Fetch → Cache → Display → Select

---

## 7. Extensibility: Recurring Expenses

### New Entity

```typescript
RecurringExpense {
  id: string
  groupId: string
  templateExpenseId: string
  frequency: 'daily' | 'weekly' | 'monthly'
  nextOccurrence: string
  isActive: boolean
}
```

---

### Required Changes

* New Redux slice
* UI updates (forms + screens)
* Background processing logic

---

## Technology Stack

* **Frontend**: React Native + TypeScript
* **State Management**: Redux Toolkit
* **Navigation**: React Navigation
* **Persistence**: AsyncStorage (redux-persist)
* **Date Handling**: date-fns
* **Charts**: Custom components / SVG
* **APIs**: Frankfurter (currency), Nominatim (location)
* **Notifications**: In-app / React Native notifications

---

## 🏗️ Project Architecture

The application follows a **feature-based modular architecture** ensuring scalability and maintainability.

---

## 📁 Folder Structure

```
src/
├── api/
│   ├── currencyApi.ts
│   └── locationApi.ts

├── app/
│   └── AppNavigator.tsx

├── components/
│   ├── common/
│   └── notifications/

├── constants/
│   └── config.ts

├── data/

├── navigation/
│   ├── BottomTabs.tsx
│   ├── RootNavigator.tsx
│   ├── screenTypes.ts
│   └── types.ts

├── Redux/
│   ├── Store.ts
│   ├── authSlice.ts
│   ├── currencySlice.ts
│   ├── expensesSlice.ts
│   ├── groupsSlice.ts
│   └── settlementsSlice.ts

├── screens/
│   ├── analytics/
│   ├── auth/
│   ├── balances/
│   ├── expenses/
│   ├── groups/
│   ├── home/
│   ├── notifications/
│   └── profile/

├── styles/
│   └── theme.ts

├── types/
│   └── index.ts

└── utils/
```

---

## ✅ Key Strengths

---

