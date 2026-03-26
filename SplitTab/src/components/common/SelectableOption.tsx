// components/common/SelectableOption.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const SelectableOption = ({ label, selected, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.option, selected && styles.selected]}
    >
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    padding: 8,
    borderRadius: 6,
  },
  selected: {
    backgroundColor: '#dbeafe',
  },
});