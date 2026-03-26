import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import notifee, {
  AuthorizationStatus,
  AndroidImportance,
} from '@notifee/react-native';

import { RootState } from '../../Redux/Store';
import {Button} from '../../components/common/Button';

export const NotificationPanel = () => {
  const groups = useSelector((state: RootState) => state.groups.groups);
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const settlements = useSelector((state: RootState) => state.settlements.settlements);

  const [hasPermission, setHasPermission] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  useEffect(() => {
    initNotifications();
  }, []);

  const initNotifications = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    const settings = await notifee.requestPermission();

    const granted =
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;

    setHasPermission(granted);
  };

  const handleSimulateExpense = async () => {
    if (!selectedGroupId) {
      Alert.alert('Error', 'Please select a group first');
      return;
    }

    await notifee.displayNotification({
      title: 'New Expense 💸',
      body: `Expense added in group ${selectedGroupId}`,
      android: {
        channelId: 'default',
        pressAction: { id: 'default' },
      },
      data: {
        type: 'expense',
        groupId: selectedGroupId,
      },
    });
  };

  const handleSimulateSettlement = async () => {
    if (!selectedGroupId) {
      Alert.alert('Error', 'Please select a group first');
      return;
    }

    await notifee.displayNotification({
      title: 'Settlement Done ✅',
      body: `Settlement recorded in group ${selectedGroupId}`,
      android: {
        channelId: 'default',
        pressAction: { id: 'default' },
      },
      data: {
        type: 'settlement',
        groupId: selectedGroupId,
      },
    });
  };

  const activeGroups = groups.filter(g => !g.archived);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Notification Settings</Text>

        {hasPermission ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>
              ✓ Notifications are enabled
            </Text>
          </View>
        ) : (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Enable notifications to get updates
            </Text>
            <Button title="Enable Notifications" onPress={initNotifications} />
          </View>
        )}
      </View>

      {hasPermission && (
        <View style={styles.card}>
          <Text style={styles.heading}>Test Notifications</Text>

          {activeGroups.map(group => (
            <Button
              key={group.id}
              title={`${group.icon} ${group.name}`}
              onPress={() => setSelectedGroupId(group.id)}
              variant={selectedGroupId === group.id ? 'primary' : 'secondary'}
            />
          ))}

          <View style={{ height: 10 }} />

          <Button
            title="Simulate New Expense"
            onPress={handleSimulateExpense}
            disabled={!selectedGroupId}
          />

          <View style={{ height: 10 }} />

          <Button
            title="Simulate Settlement"
            onPress={handleSimulateSettlement}
            variant="secondary"
            disabled={!selectedGroupId}
          />

          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              • Tap button to trigger notification{"\n"}
              • Works in background also
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: '#DBEAFE',
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    marginBottom: 8,
    color: '#1E3A8A',
  },
  successBox: {
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 8,
  },
  successText: {
    color: '#166534',
  },
  noteBox: {
    marginTop: 12,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#374151',
  },
});