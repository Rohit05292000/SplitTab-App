import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AvatarColor } from '../../types'

interface AvatarProps {
  name: string;
  color: AvatarColor;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar = ({ name, color, size = 'md' }: AvatarProps) => {
  const getColorStyle = (color: AvatarColor) => {
    const colorMap: Record<AvatarColor, string> = {
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#10b981',
      yellow: '#f59e0b',
      purple: '#8b5cf6',
      orange: '#f97316',
      pink: '#ec4899',
      teal: '#14b8a6',
    };
    return { backgroundColor: colorMap[color] };
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { width: 32, height: 32, borderRadius: 16, fontSize: 12 };
      case 'lg':
        return { width: 64, height: 64, borderRadius: 32, fontSize: 20 };
      default:
        return { width: 40, height: 40, borderRadius: 20, fontSize: 14 };
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeStyle = getSizeStyle();

  return (
    <View
      style={[
        styles.container,
        getColorStyle(color),
        {
          width: sizeStyle.width,
          height: sizeStyle.height,
          borderRadius: sizeStyle.borderRadius,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: sizeStyle.fontSize }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});