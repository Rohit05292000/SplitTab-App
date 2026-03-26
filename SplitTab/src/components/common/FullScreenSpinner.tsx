// components/common/FullScreenSpinner.tsx

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SpinnerCard } from './SpinnerCard';

interface FullScreenSpinnerProps {
  text?: string;
  style?: StyleProp<ViewStyle>;
  overlay?: boolean; // optional overlay mode
}

export const FullScreenSpinner = ({
  text,
  style,
  overlay = false,
}: FullScreenSpinnerProps) => {
  return (
    <View
      style={[
        styles.container,
        overlay && styles.overlay,
        style,
      ]}
    >
      <SpinnerCard text={text} size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // ✅ FIX (center horizontally)
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)', // dim background
    zIndex: 999,
  },
});