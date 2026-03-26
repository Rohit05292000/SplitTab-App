// src/utils/notifications.ts

import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';
import { NotificationPayload } from '../types';

/**
 * ✅ Request Notification Permission
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  const settings = await notifee.requestPermission();

  return (
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
};

/**
 * ✅ Create Notification Channel (Android)
 */
export const createNotificationChannel = async () => {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
};

/**
 * ✅ Show Notification
 */
export const showNotification = async (
  payload: NotificationPayload
): Promise<void> => {
  await notifee.displayNotification({
    title: 'SplitTab',
    body: payload.message,
    android: {
      channelId: 'default',
      pressAction: {
        id: 'default',
      },
    },
    data: {
      type: payload.type,
      groupId: payload.groupId,
      expenseId: payload.expenseId || '',
      settlementId: payload.settlementId || '',
    },
  });
};

/**
 * ✅ Simulate Expense Notification
 */
export const simulateExpenseNotification = async (
  groupId: string,
  expenseId: string
): Promise<void> => {
  await showNotification({
    type: 'expense',
    groupId,
    expenseId,
    message: 'New expense added to the group',
  });
};

/**
 * ✅ Simulate Settlement Notification
 */
export const simulateSettlementNotification = async (
  groupId: string,
  settlementId: string
): Promise<void> => {
  await showNotification({
    type: 'settlement',
    groupId,
    settlementId,
    message: 'New settlement recorded',
  });
};