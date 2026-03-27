# SplitTab - Expense Sharing Mobile Application

## 📱 APK Download

Download the latest APK here: https://drive.google.com/file/d/1RfPAeufp6k2JOIRU2NWkwdJRxBSnlmcC/view?usp=sharing


> Install the APK on your Android device (enable "Install from unknown sources" if required).


## 🚀 Features

### ✅ Authentication & Onboarding
- Mock login with hardcoded credentials
- 4-step onboarding flow (name, email, currency, avatar)
- Persistent sessions across app restarts using AsyncStorage

### 👥 Group Management
- Create groups with custom icons and descriptions
- Add members from mock contact list
- Archive/unarchive groups
- Real-time balance tracking

### 💰 Expense Management
- Multiple split types: Equal, Exact, Percentage, Shares
- Currency support: INR, USD, EUR
- Category tracking: Food, Travel, Utilities, Entertainment, Other
- Optional receipt photos and location tagging
- Full edit history with audit log
- Delete with confirmation

### 📊 Smart Balances & Settlements
- Real-time balance calculation
- Minimum settlements algorithm (O(n log n))
- Handles circular debts correctly
- Settlement history with filtering
- Unit tested settlement logic

### 📈 Analytics
- Monthly spending bar chart (last 6 months)
- Category breakdown donut chart
- Custom SVG charts (no external libraries)
- Real-time currency conversion
- Lifetime statistics

### 🔔 Notifications
- Local notification support
- Deep-linking to relevant screens
- Simulate expense/settlement notifications
- Works in background mode

### 🌍 API Integrations
- **Currency Conversion**: Frankfurter API with 24h caching
- **Location Search**: Nominatim API with debouncing
- Offline mode with cached data
- Graceful error handling

## 🛠️ Tech Stack

- **React Native** - Mobile framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Navigation** - Navigation
- **AsyncStorage** - Persistence


## 📦 Setup Instructions

### Prerequisites

- Node.js 16+
- pnpm (or npm/yarn)

### Installation

```bash
# Clone the repository
git clone   https://github.com/Rohit05292000/SplitTab-App.git

cd SplitTab-App 

cd SplitTab

# Install dependencies
npm install
# OR
pnpm install

# Start Metro bundler
npx react-native start

# Run on Android (in another terminal)
npx react-native run-android

### Demo Credentials

```
Email: demo@splittab.com
Password: demo123
```

## 📁 Project Structure

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

## 🏗️ Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation including:

1. Data Model & Storage
2. Settlement Algorithm
3. Balance Consistency
4. Split Validation
5. Currency Architecture
6. Location Search
7. Extensibility

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test balanceCalculator.test.ts


# Run on Android (in another terminal)
npx react-native run-android

> Make sure you have Android Studio set up with an emulator or a physical device connected.

## 🎯 Key Features Implemented

✅ Onboarding with 4 steps
✅ Mock authentication with session persistence
✅ Group creation with members
✅ 4 split types (equal, exact, percentage, shares)
✅ Currency conversion with offline support
✅ Location search with debouncing
✅ Minimum settlement algorithm
✅ Custom SVG analytics charts
✅ Audit log for expense edits
✅ Local notifications with deep-linking
✅ Full TypeScript coverage
✅ Responsive design
✅ < 300 lines per component

## 🔐 Security Note

This is a demo application with:
- Mock authentication (hardcoded credentials)
- Client-side only storage (AsyncStorage)
- No real backend or API keys

For production, integrate with Firebase/Supabase for:
- Real authentication
- Secure database
- Server-side validation

## 📝 License

MIT License - Feel free to use this for learning and projects!

## 🤝 Contributing

This is an assignment project, but feedback is welcome!

---
Built with ❤️ using React, TypeScript, and Redux Toolkit

