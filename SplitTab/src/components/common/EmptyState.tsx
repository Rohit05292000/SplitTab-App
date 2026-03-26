// components/common/EmptyState.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  style,
}: EmptyStateProps) => {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}

      {title && <Text style={styles.title}>{title}</Text>}

      {description && (
        <Text style={styles.description}>{description}</Text>
      )}

      {actionLabel && onAction && (
        <View style={styles.action}>
          <Button onPress={onAction}>{actionLabel}</Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },

  icon: {
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#111827',
  },

  description: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },

  action: {
    marginTop: 14,
  },
});