import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import notifee, { AuthorizationStatus } from '@notifee/react-native';

import { RootState } from '../../Redux/Store';
import { Button } from '../common/Button';

export const NotificationPanel = () => {
  const groups = useSelector((state: RootState) => state.groups.groups);

  const [hasPermission, setHasPermission] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  const requestPermission = async () => {
    const settings = await notifee.requestPermission();

    setHasPermission(
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED
    );
  };

  const showNotification = async (title: string, body: string) => {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
      },
    });
  };

  const handleSimulateExpense = async () => {
    if (!selectedGroupId) {
      Alert.alert('Error', 'Select a group first');
      return;
    }

    await showNotification(
      'New Expense 💸',
      `Expense added in group ${selectedGroupId}`
    );
  };

  const handleSimulateSettlement = async () => {
    if (!selectedGroupId) {
      Alert.alert('Error', 'Select a group first');
      return;
    }

    await showNotification(
      'Settlement Done ✅',
      `Settlement recorded in group ${selectedGroupId}`
    );
  };

  const activeGroups = groups.filter(g => !g.archived);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Permission</Text>

        {hasPermission ? (
          <Text style={{ color: 'green' }}>✓ अनुमति granted</Text>
        ) : (
          <Button title="Enable Notifications" onPress={requestPermission} />
        )}
      </View>

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
          title="Simulate Expense"
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
      </View>
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