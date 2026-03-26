import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}: ModalProps) => {

  const getMaxWidthStyle = (): ViewStyle => {
    switch (maxWidth) {
      case 'sm':
        return { width: '70%' };
      case 'lg':
        return { width: '90%' };
      case 'xl':
        return { width: '95%' };
      default:
        return { width: '85%' };
    }
  };

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.root}>

        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.centered}
        >
          <View style={[styles.modal, getMaxWidthStyle()]}>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.close}>×</Text>
              </TouchableOpacity>
            </View>

            {/* ✅ Scrollable body */}
<View style={styles.body}>
  {children}
</View>

          </View>
        </KeyboardAvoidingView>

      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',   // ✅ better UI
    alignItems: 'center',
     paddingVertical: 20,
  },
 modal: {
  width: '85%',
  maxHeight: '90%',
  backgroundColor: '#fff',
  borderRadius: 12,
  overflow: 'hidden',


},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  close: {
    fontSize: 22,
  },
body: {
 height: '100%',
}
});