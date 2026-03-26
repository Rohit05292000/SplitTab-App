// components/common/Card.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>; // ✅ FIXED
  padding?: number;
}

export const Card = ({
  children,
  title,
  onPress,
  style,
  padding = 16,
}: CardProps) => {
  const isPressable = !!onPress;

  const content = (
    <>
      {title && <Text style={styles.title}>{title}</Text>}
      <View>{children}</View>
    </>
  );

  if (isPressable) {
    return (
      <TouchableOpacity
        style={[styles.card, { padding }, style]}
        activeOpacity={0.8}
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, { padding }, style]}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,

    // Android shadow
    elevation: 2,

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    borderWidth: 1,
    borderColor: '#f3f4f6',
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#111827',
  },
});