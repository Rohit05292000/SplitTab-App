# SplitTab Architecture Documentation

## 1. Data Model

### Schema & Storage Choice

We use **Redux Toolkit** with **AsyncStorage** persistence for client-side state management.

- **Redux Toolkit**: Provides predictable state management with built-in immutability and middleware support
- **AsyncStorage**: Enables session persistence across app restarts without a backend- **Type Safety**: Full TypeScript integration ensures compile-time type checking

#### Core Entities

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

#### Redux Store Structure

#### Persistence Layer

We use **redux-persist** with **AsyncStorage** to automatically persist and rehydrate Redux state across app restarts.
```
store/
├── authSlice - User authentication and profile
├── groupsSlice - Group management
├── expensesSlice - Expense CRUD operations
├── settlementsSlice - Settlement records
└── currencySlice - Exchange rates and offline status
```

---

## 2. Settlement Algorithm

### Overview

We use a **Greedy Algorithm** to minimize the number of settlement transactions.

### Algorithm Steps

1. **Separate balances** into two lists:
   - `creditors[]`: Users with positive balance (owed money)
   - `debtors[]`: Users with negative balance (owe money)

2. **Sort both lists** by absolute amount (descending)

3. **Match largest creditor with largest debtor**:
   - Settlement amount = min(creditor.balance, debtor.balance)
   - Reduce both balances by settlement amount
   - Record settlement suggestion

4. **Remove settled balances**:
   - If creditor balance = 0, move to next creditor
   - If debtor balance = 0, move to next debtor

5. **Repeat** until all balances are settled

### Circular Debt Example

```
Initial State:
- Alice paid $300 (for 3 people = $100 each)
- Bob paid $150 (for 3 people = $50 each)
- Carol paid $0

Expected Contributions: $150 each

Balances:
- Alice: +300 - 150 = +150 (owed)
- Bob: +150 - 150 = 0 (even)
- Carol: +0 - 150 = -150 (owes)

Algorithm Output:
1. Creditors: [Alice: 150]
2. Debtors: [Carol: 150]
3. Settlement: Carol → Alice: $150

Result: 1 transaction (minimal)
```

### Time Complexity

- **Sorting**: O(n log n) where n = number of people
- **Matching**: O(n) linear pass through lists
- **Overall**: **O(n log n)**

### Space Complexity

- O(n) for storing creditors and debtors lists



### Testing

The settlement algorithm is covered by unit tests using Jest, including:
- Basic two-user settlement
- Circular debt scenarios
- Edge cases (zero balances, equal splits)



## 3. Balance Consistency

### Where Balances are Computed

Balances are **computed on-demand**, not stored:

```typescript
// src/utils/balanceCalculator.ts
calculateBalances(expenses, settlements, groupId, currency)
```

### Computation Flow

1. **Iterate through expenses** for the group:
   - Add full amount to `paidBy` user's balance
   - Subtract split amounts from each participant's balance

2. **Iterate through settlements**:
   - Subtract from `fromUserId` balance
   - Add to `toUserId` balance

3. **Return computed balances** in user's display currency

### Ensuring No Stale Data

**Strategy**: Always compute from source of truth (expenses + settlements)

✅ **Benefits**:
- No denormalization means no sync issues
- Currency conversion always uses latest rates
- Audit trail is complete and accurate

✅ **Invalid data prevention**:
- Split validation runs **before** saving expense
- Redux reducers enforce immutability
- TypeScript prevents type mismatches



### Performance Note

For larger datasets, memoization (e.g., selectors or useMemo) can be used to avoid unnecessary recomputation of balances.



## 4. Split Validation

### Where Validation Lives

**Location**: `src/utils/balanceCalculator.ts` - `validateSplit()` function

**When it runs**:
1. **Real-time**: As user enters split amounts (UI feedback)
2. **Pre-save**: Before dispatching `addExpense` action
3. **Unit tests**: Comprehensive test coverage

### Validation Rules by Split Type

```typescript
equal: Always valid if participants exist
exact: sum(amounts) === totalAmount
percentage: sum(percentages) === 100
shares: totalShares > 0 (proportional)
```

### Can Invalid Data Be Saved?

**NO.** Multiple layers prevent this:

1. **UI Layer**: Form validation with disabled submit button
2. **Action Layer**: Validation before Redux dispatch
3. **Type Safety**: TypeScript enforces correct data types
4. **Tolerance**: 0.01 tolerance for floating-point rounding

---

## 5. Currency Architecture

### Flow Example: USD Expense While User is INR and Offline

1. **Expense Creation** (User creates $50 USD expense):
   ```
   - Check currencyRates from Redux store
   - If offline: use cached rates (with warning)
   - Store expense with:
     * amount: 50
     * currency: "USD"
     * historicalRate: 83.0 (cached INR/USD rate)
   ```

2. **Display in Expense List**:
   ```
   - Fetch expense.historicalRate (83.0)
   - Convert: 50 USD × 83.0 = 4150 INR
   - Display: "₹4150 (originally $50 USD)"
   ```

3. **Balance Calculation**:
   ```
   - Use cached rate for conversion to INR
   - Show offline indicator in UI
   - Balance displayed in user's currency (INR)
   ```

4. **When Back Online**:
   ```
   - Fetch fresh rates from Frankfurter API
   - Update currency.rates in Redux
   - Remove offline indicator
   - NOTE: Historical expenses still use stored rate
   ```

### Key Design Decisions

- **Historical rates stored**: Ensures consistency when viewing old expenses
- **Graceful offline handling**: Cached rates allow continued usage
- **24-hour refresh**: Balance between accuracy and API usage
- **User sees currency indicator**: Transparency about conversions

---

## 6. Location Search

### Debounce Implementation

```typescript
// src/api/locationApi.ts
let debounceTimer: NodeJS.Timeout | null = null;

searchLocation(query, callback) {
  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Wait 400ms before executing
  debounceTimer = setTimeout(() => {
    // Execute API call
  }, 400);
}
```

### Cancellation Implementation

```typescript
let abortController: AbortController | null = null;

searchLocation(query, callback) {
  // Cancel previous request
  if (abortController) {
    abortController.abort();
  }

  // Create new controller
  abortController = new AbortController();

  fetch(url, { signal: abortController.signal });
}
```

### Data Flow

```
User types "New"
  ↓
Clear previous timer (400ms)
  ↓
User types "New Y"
  ↓
Clear previous timer again
  ↓
User stops typing
  ↓
Wait 400ms
  ↓
Cancel any in-flight request
  ↓
Fetch from Nominatim API
  ↓
Cache result in memory (last 5)
  ↓
Display results in dropdown
  ↓
User selects → Store in expense.location
```

---

## 7. Extensibility: Adding Recurring Expenses

### Required Data Changes

```typescript
// New entity
RecurringExpense {
  id: string
  groupId: string
  templateExpenseId: string  // Reference to expense template
  frequency: 'daily' | 'weekly' | 'monthly'
  startDate: string
  endDate?: string
  nextOccurrence: string
  isActive: boolean
}

// Add to Expense type
Expense {
  ...existing fields
  recurringId?: string  // Link to recurring expense
  isRecurring: boolean
}
```

### State Management Changes

```typescript
// New slice: src/store/recurringSlice.ts
{
  recurring: RecurringExpense[]
}

// Actions
- addRecurringExpense
- pauseRecurringExpense
- deleteRecurringExpense
- generateExpenseFromRecurring
```

### UI Changes

1. **Add Expense Form**:
   - Add checkbox: "Make this recurring"
   - Show frequency selector
   - Show end date picker

2. **Expense List**:
   - Badge indicator for recurring expenses
   - "View Series" button

3. **New Screen**: Recurring Expenses Manager
   - List all recurring expenses
   - Pause/Resume/Edit/Delete actions
   - Preview next occurrence date

### Background Processing

```typescript
// Check on app load and daily
function processRecurringExpenses() {
  const now = new Date();

  activeRecurring.forEach(recurring => {
    if (now >= recurring.nextOccurrence) {
      // Create new expense from template
      dispatch(addExpense({
        ...templateExpense,
        date: now,
        recurringId: recurring.id
      }));

      // Update next occurrence
      dispatch(updateRecurringExpense({
        id: recurring.id,
        nextOccurrence: calculateNext(recurring.frequency)
      }));
    }
  });
}
```

---

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4
- **Date Handling**: date-fns
- **Charts**: Custom SVG (no libraries)
- **Persistence**: localStorage
- **APIs**: Frankfurter (currency), Nominatim (location)
- **Notifications**: Web Notification API

---

## Project Structure

```
src/
├── api/              # External API integrations
│   ├── currencyApi.ts
│   └── locationApi.ts
├── store/            # Redux slices
│   ├── index.ts
│   ├── authSlice.ts
│   ├── groupsSlice.ts
│   ├── expensesSlice.ts
│   ├── settlementsSlice.ts
│   └── currencySlice.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Helper functions
│   ├── balanceCalculator.ts
│   ├── notifications.ts
│   └── mockData.ts
└── app/
    ├── components/   # React components
    │   ├── auth/
    │   ├── common/
    │   ├── groups/
    │   ├── expenses/
    │   ├── balances/
    │   ├── analytics/
    │   ├── notifications/
    │   ├── profile/
    │   └── navigation/
    └── App.tsx       # Main application component
```
