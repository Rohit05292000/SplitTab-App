import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
}

export const InputField = ({
  label,
  error,
  rightElement,
  leftElement,
  style,
  multiline,
  ...props
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Input Wrapper */}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.focused,
          error && styles.errorBorder,
        ]}
      >
        {leftElement}

        <TextInput
          {...props}
          multiline={multiline}
          style={[
            styles.input,
            multiline && { height: 80 },
            style,
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {rightElement}
      </View>

      {/* Error */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    marginBottom: 4,
    color: '#374151',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },

  input: {
    flex: 1,
    paddingVertical: 10,
  },

  focused: {
    borderColor: '#2563eb',
  },

  errorBorder: {
    borderColor: '#dc2626',
  },

  errorText: {
    color: '#dc2626',
    fontSize: 11,
    marginTop: 4,
  },
});