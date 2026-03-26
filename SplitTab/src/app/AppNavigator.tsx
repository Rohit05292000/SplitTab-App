import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from '../Redux/Store';
import { RootNavigator } from '../navigation/RootNavigator';
import { FullScreenSpinner } from '../components/common/FullScreenSpinner';

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate app boot (can replace with async storage, API, etc.)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 sec splash

    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>

        {loading ? (
          <FullScreenSpinner text="Starting app..." />
        ) : (
          <RootNavigator />
        )}

      </SafeAreaProvider>
    </Provider>
  );
}