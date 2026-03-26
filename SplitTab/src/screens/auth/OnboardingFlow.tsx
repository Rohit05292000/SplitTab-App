import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import { useDispatch } from 'react-redux';
import { completeOnboarding } from '../../Redux/authSlice';
import { Currency, AvatarColor } from '../../types';
import { AVATAR_COLORS, CURRENCIES } from '../../utils/mockData';
import { AppDispatch } from '../../Redux/Store'; 
import { FullScreenSpinner } from '../../components/common/FullScreenSpinner';

export const OnboardingFlow = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [avatarColor, setAvatarColor] = useState<AvatarColor>('blue');
  const [loading, setLoading] = useState(false);

  const handleComplete = () => {
  if (!displayName.trim() || !email.trim()) {
    Alert.alert('Error', 'Please fill in all required fields');
    return;
  }

  setLoading(true);

  setTimeout(() => {
    dispatch(
      completeOnboarding({
        name: displayName.trim(),
        email: email.trim(),
        currency,
        avatarColor,
      })
    );

  }, 800);
};

  const getColorStyle = (color: string) => {
    const colorMap: Record<string, string> = {
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#10b981',
      yellow: '#f59e0b',
      purple: '#8b5cf6',
      orange: '#f97316',
      pink: '#ec4899',
      teal: '#14b8a6',
    };
    return colorMap[color] || '#9ca3af';
  };

  return (
     <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
     {loading && (
        <FullScreenSpinner
          text="Setting up your profile..."
          overlay
        />
      )}
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
     <ScrollView
  contentContainerStyle={{ flexGrow: 1 }}
  keyboardShouldPersistTaps="handled"
>
  <View style={styles.container}>
      <View style={styles.card}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            {[1, 2, 3, 4].map((s) => (
              <View
                key={s}
                style={[
                  styles.progressStep,
                  s <= step ? styles.progressActive : styles.progressInactive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.stepText}>Step {step} of 4</Text>
        </View>

        <Text style={styles.title}>Welcome to SplitTab</Text>


        {/* STEP 1 */}
        {step === 1 && (
          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Display Name</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                style={styles.input}
                placeholder="John Doe"
              />
            </View>

            <TouchableOpacity
              onPress={() => setStep(2)}
              disabled={!displayName.trim()}
              style={[styles.button, !displayName.trim() && styles.disabledButton]}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="john@example.com"
                keyboardType="email-address"
                autoCapitalize="none" // ✅ FIXED
              />
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => setStep(1)}
                style={[styles.button, styles.grayButton, styles.marginRight]}
              >
                <Text style={styles.grayText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setStep(3)}
                disabled={!email.trim()}
                style={[styles.button, !email.trim() && styles.disabledButton]}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <View style={styles.section}>
            <View>
              <Text style={styles.label}>Display Currency</Text>
              <View style={styles.grid3}>
                {CURRENCIES.map((curr) => (
                  <TouchableOpacity
                    key={curr}
                    onPress={() => setCurrency(curr as Currency)}
                    style={[
                      styles.currencyBtn,
                      currency === curr && styles.currencyActive,
                    ]}
                  >
                    <Text>{curr}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => setStep(2)}
                style={[styles.button, styles.grayButton, styles.marginRight]}
              >
                <Text style={styles.grayText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setStep(4)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <View style={styles.section}>
            <View>
              <Text style={styles.label}>Choose Avatar Color</Text>
              <View style={styles.grid4}>
                {AVATAR_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setAvatarColor(color)}
                    style={[
                      styles.avatar,
                      { backgroundColor: getColorStyle(color) },
                      avatarColor === color && styles.avatarSelected,
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => setStep(3)}
                style={[styles.button, styles.grayButton, styles.marginRight]}
              >
                <Text style={styles.grayText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleComplete}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
      </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fdf2f8',
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 5,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  progressStep: {
    flex: 1,
    height: 6,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  progressActive: {
    backgroundColor: '#7c3aed',
  },
  progressInactive: {
    backgroundColor: '#e5e7eb',
  },
  stepText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7280',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  section: {},
  inputGroup: {
    marginBottom: 12, // replaces gap
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
  },
 button: {
  flex: 1,
  backgroundColor: '#7c3aed',
  padding: 14,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center', 
},
  disabledButton: {
    backgroundColor: '#c4b5fd', 
  },
  grayButton: {
    backgroundColor: '#e5e7eb',
  },
  grayText: {
    color: '#374151',
  },
 buttonText: {
  color: '#ffffff', 
  fontWeight: '600',
  fontSize: 16, 
},
  row: {
    flexDirection: 'row',
    marginTop: 8,
  },
  marginRight: {
    marginRight: 8,
  },
  grid3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  grid4: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  currencyBtn: {
    flexBasis: '30%',
    margin: 4,
    padding: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    alignItems: 'center',
  },
  currencyActive: {
    borderColor: '#7c3aed',
    backgroundColor: '#f3e8ff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,
  },
  avatarSelected: {
    borderWidth: 4,
    borderColor: '#7c3aed',
  },
});