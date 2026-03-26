import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addSettlement } from '../../Redux/settlementsSlice';
import { updateLastActivity } from '../../Redux/groupsSlice';
import { RootState, AppDispatch } from '../../Redux/Store';
import { Currency } from '../../types';
import { Button } from '../../components/common/Button';
import { CURRENCIES } from '../../utils/mockData';
import { FullScreenSpinner } from '../../components/common/FullScreenSpinner'; 

// ✅ custom components
import { Card } from '../../components/common/Card';
import { Section } from '../../components/common/Section';
import { InputField } from '../../components/common/InputField';
import { SelectableOption } from '../../components/common/SelectableOption';


interface AddSettlementFormProps {
  groupId: string;
  onSuccess: () => void;
}

export const AddSettlementForm = ({
  groupId,
  onSuccess,
}: AddSettlementFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const group = useSelector((state: RootState) =>
    state.groups.groups.find(g => g.id === groupId)
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const [fromUserId, setFromUserId] = useState(user?.id || '');
  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>(
    user?.currency || 'USD'
  );
  const [note, setNote] = useState('');
   const [loading, setLoading] = useState(false);

   const handleSubmit = () => {
    if (!fromUserId || !toUserId || !amount.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (fromUserId === toUserId) {
      Alert.alert('Error', 'Cannot settle with yourself');
      return;
    }

    const numAmount = parseFloat(amount.trim());
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true); // ✅ START LOADING

    try {
      dispatch(
        addSettlement({
          groupId,
          fromUserId,
          toUserId,
          amount: numAmount,
          currency,
          date: new Date().toISOString(),
          note: note.trim(),
        })
      );

      dispatch(updateLastActivity(groupId));

      onSuccess();
    } catch {
      Alert.alert('Error', 'Failed to record settlement');
    } finally {
      setLoading(false); // ✅ STOP LOADING
    }
  };


  if (!group || !user) return null;

  const availableMembers = group.memberIds.filter(
    id => id !== fromUserId
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
       {loading && <FullScreenSpinner overlay text="Saving..." />}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* 🔥 MAIN CARD */}
          <Card>

            {/* FROM */}
            <Section title="From *">
              <View style={styles.selectBox}>
                {group.memberIds.map(memberId => (
                  <SelectableOption
                    key={memberId}
                    label={
                      memberId === user.id
                        ? 'You'
                        : `Member ${memberId}`
                    }
                    selected={fromUserId === memberId}
                    onPress={() => {
                      setFromUserId(memberId);
                      setToUserId('');
                    }}
                  />
                ))}
              </View>
            </Section>

            {/* TO */}
            <Section title="To *">
              <View style={styles.selectBox}>
                {availableMembers.map(memberId => (
                  <SelectableOption
                    key={memberId}
                    label={
                      memberId === user.id
                        ? 'You'
                        : `Member ${memberId}`
                    }
                    selected={toUserId === memberId}
                    onPress={() => setToUserId(memberId)}
                  />
                ))}
              </View>
            </Section>

            {/* AMOUNT + CURRENCY */}
            <View style={styles.row}>
              <View style={[styles.flex1, styles.marginRight]}>
                <InputField
                  label="Amount *"
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.flex1}>
                <Section title="Currency *">
                  <View style={styles.selectBox}>
                    {CURRENCIES.map(curr => (
                      <SelectableOption
                        key={curr}
                        label={curr}
                        selected={currency === curr}
                        onPress={() =>
                          setCurrency(curr as Currency)
                        }
                      />
                    ))}
                  </View>
                </Section>
              </View>
            </View>

            {/* NOTE */}
            <InputField
              label="Note (Optional)"
              value={note}
              onChangeText={setNote}
              placeholder="Add a note..."
            />

            {/* BUTTON */}
            <Button onPress={handleSubmit} fullWidth>
              Record Settlement
            </Button>

          </Card>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  flex1: {
    flex: 1,
  },

  marginRight: {
    marginRight: 10,
  },

  selectBox: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 6,
  },
});