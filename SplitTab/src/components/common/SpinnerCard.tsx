// components/common/SpinnerCard.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Card } from './Card';

interface SpinnerCardProps {
  text?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
  fullScreen?: boolean;
}

export const SpinnerCard = ({
  text = 'Loading...',
  size = 'small',
  style,
  fullScreen = false,
}: SpinnerCardProps) => {
  const content = (
    <Card style={[styles.card, style]}>
      <ActivityIndicator size={size} color="#2563eb" />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </Card>
  );

  if (fullScreen) {
    return <View style={styles.fullScreen}>{content}</View>;
  }

  return <View style={styles.wrapper}>{content}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },

  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    minWidth: 120,
  },

  text: {
    marginTop: 8,
    fontSize: 12,
    color: '#6b7280',
  },
});