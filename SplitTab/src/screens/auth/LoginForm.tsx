  import React, { useState } from 'react';
  import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform
  } from 'react-native';
  import { useDispatch } from 'react-redux';
  import { login } from '../../Redux/authSlice';
  import { AppDispatch } from '../../Redux/Store'; 
  import { FullScreenSpinner } from '../../components/common/FullScreenSpinner';

  export const LoginForm = () => {
    const dispatch = useDispatch<AppDispatch>(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
  setError('');

  if (!email || !password) {
    setError('Please enter both email and password');
    return;
  }

  if (email !== 'demo@splittab.com' || password !== 'demo123') {
    setError('Invalid credentials. Use demo@splittab.com / demo123');
    return;
  }

  setLoading(true);

  dispatch(login({ email, password }));

  setLoading(false);
};

    return (
       <>
   {loading && (
  <FullScreenSpinner
    text="Setting up your profile..."
    overlay
  />
)}
        <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>SplitTab</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="demo@splittab.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholder="demo123"
                placeholderTextColor="#9ca3af"
                secureTextEntry
              />
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.demoBox}>
              <Text style={styles.demoText}>
                Demo credentials:{'\n'}
                <Text style={styles.bold}>Email:</Text> demo@splittab.com{'\n'}
                <Text style={styles.bold}>Password:</Text> demo123
              </Text>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
      backgroundColor: '#eef2ff',
    },
    card: {
      backgroundColor: '#fff',
      padding: 24,
      borderRadius: 16,
      elevation: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16,
    },
    subtitle: {
      textAlign: 'center',
      color: '#6b7280',
      marginBottom: 20,
    },
    form: {},
    inputGroup: {
      marginBottom: 12, // ✅ replaces gap
    },
    label: {
      fontSize: 12,
      color: '#374151',
      marginBottom: 4,
    },
    input: {
      borderWidth: 1,
      borderColor: '#d1d5db',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: '#111827',
    },
    errorBox: {
      backgroundColor: '#fee2e2',
      borderWidth: 1,
      borderColor: '#fecaca',
      padding: 10,
      borderRadius: 8,
      marginBottom: 12,
    },
    errorText: {
      color: '#b91c1c',
    },
    button: {
      backgroundColor: '#2563eb',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
    },
    demoBox: {
      marginTop: 12,
      padding: 12,
      backgroundColor: '#dbeafe',
      borderRadius: 8,
    },
    demoText: {
      fontSize: 12,
      color: '#1e3a8a',
    },
    bold: {
      fontWeight: 'bold',
    },
    
  });