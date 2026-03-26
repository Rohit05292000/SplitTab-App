// components/common/Section.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  rightElement?: React.ReactNode; // action button, link, etc.
  noSpacing?: boolean; // remove margin when needed
}

export const Section = ({
  title,
  children,
  style,
  rightElement,
  noSpacing = false,
}: SectionProps) => {
  return (
    <View style={[!noSpacing && styles.section, style]}>
      
      {/* Header */}
      {(title || rightElement) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {rightElement && <View>{rightElement}</View>}
        </View>
      )}

      {/* Content */}
      <View>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 12,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  title: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
});