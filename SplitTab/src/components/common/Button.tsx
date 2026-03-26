import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

interface ButtonProps {
  children?: React.ReactNode;
  title?: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = ({
  children,
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  loading = false,
}: ButtonProps) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: '#e5e7eb' };
      case 'danger':
        return { backgroundColor: '#dc2626' };
      default:
        return { backgroundColor: '#2563eb' };
    }
  };

  const getTextVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'secondary':
        return { color: '#374151' };
      default:
        return { color: '#ffffff' };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      case 'lg':
        return { paddingVertical: 12, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 8, paddingHorizontal: 16 };
    }
  };

  const getTextSizeStyle = (): TextStyle => {
    switch (size) {
      case 'sm':
        return { fontSize: 14 };
      case 'lg':
        return { fontSize: 18 };
      default:
        return { fontSize: 16 };
    }
  };

  const content = children || title;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
      ]}
      activeOpacity={0.7}
    >
    {loading ? (
  <ActivityIndicator color="#fff" />
) : typeof content === 'string' || typeof content === 'number' ? (
  <Text
    style={[
      styles.text,
      getTextVariantStyle(),
      getTextSizeStyle(),
    ]}
  >
    {content}
  </Text>
) : Array.isArray(content) ? (
  <Text
    style={[
      styles.text,
      getTextVariantStyle(),
      getTextSizeStyle(),
    ]}
  >
    {content.join('')}
  </Text>
) : (
  content
)}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});