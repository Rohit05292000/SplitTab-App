import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';

import { BottomTabs } from './BottomTabs';

// Auth
import { LoginForm } from '../screens/auth/LoginForm';
import { OnboardingFlow } from '../screens/auth/OnboardingFlow';

// App Screens
import { GroupDetail } from '../screens/groups/GroupDetail';
import { CreateGroupScreen } from '../screens/groups/CreateGroupScreen';
import { AddExpenseForm } from '../screens/expenses/AddExpenseForm';
import { ExpenseDetail } from '../screens/expenses/ExpenseDetail';
import { AddSettlementForm } from '../screens/balances/AddSettlementForm';
import { SettlementHistory } from '../screens/balances/SettlementHistory';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

import { RootStackParamList } from './types';
import { SettlementHistoryScreen } from '../screens/balances/SettlementHistoryScreen';
import { AddSettlementScreen } from '../screens/balances/AddSettlementScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user, hasCompletedOnboarding } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>

        {!user ? (
          // 🔐 LOGIN
          <Stack.Screen
            name="Login"
            component={LoginForm}
            options={{ headerShown: false }}
          />
        ) : !hasCompletedOnboarding ? (
          // 🚀 ONBOARDING
          <Stack.Screen
            name="Onboarding"
            component={OnboardingFlow}
            options={{ headerShown: false }}
          />
        ) : (
          // ✅ MAIN APP
          <>
            <Stack.Screen
              name="Tabs"
              component={BottomTabs}
              options={{ headerShown: false }}
            />

            <Stack.Screen name="GroupDetail" component={GroupDetail} />
            <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
            <Stack.Screen name="AddExpense" component={AddExpenseForm} />
            <Stack.Screen name="ExpenseDetail" component={ExpenseDetail} />
            <Stack.Screen name="AddSettlement" component={AddSettlementScreen} />
            <Stack.Screen name="SettlementHistory" component={SettlementHistoryScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
};