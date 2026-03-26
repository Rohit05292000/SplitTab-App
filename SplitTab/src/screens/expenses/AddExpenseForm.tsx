import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from '../../Redux/expensesSlice';
import { updateLastActivity } from '../../Redux/groupsSlice';
import { RootState, AppDispatch } from '../../Redux/Store';
import { Currency, ExpenseCategory, SplitType } from '../../types';
import { Button } from '../../components/common/Button';
import { SplitTypeSelector } from './SplitTypeSelector';
import { LocationSearch } from './LocationSearch';
import { CURRENCIES, EXPENSE_CATEGORIES } from '../../utils/mockData';
import { fetchCurrencyRates } from '../../api/currencyApi';
import { setRates } from '../../Redux/currencySlice';
import { AddExpenseScreenProps } from '../../navigation/screenTypes';

// ✅ reusable components
import { Card } from '../../components/common/Card';
import { InputField } from '../../components/common/InputField';
import { Section } from '../../components/common/Section';
import { SelectableOption } from '../../components/common/SelectableOption';
import { FullScreenSpinner } from '../../components/common/FullScreenSpinner';

export const AddExpenseForm = ({ route, navigation }: AddExpenseScreenProps) => {
  const { groupId } = route.params;
  const dispatch = useDispatch<AppDispatch>();

  const group = useSelector((state: RootState) =>
    state.groups.groups.find(g => g.id === groupId)
  );

  const user = useSelector((state: RootState) => state.auth.user);
  const currencyRates = useSelector((state: RootState) => state.currency.rates);

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>(user?.currency || 'USD');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const [paidBy, setPaidBy] = useState(user?.id || '');
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [participants, setParticipants] = useState<{ userId: string; amount: number }[]>([]);
  const [location, setLocation] = useState<
    { displayName: string; lat: number; lon: number } | undefined
  >();

  useEffect(() => {
    if (!currencyRates && user?.currency) {
      fetchCurrencyRates(user.currency).then(rates => {
        dispatch(setRates(rates));
      });
    }
  }, [currencyRates, user?.currency, dispatch]);

  useEffect(() => {
    if (group) {
      setParticipants(
        group.memberIds.map(id => ({ userId: id, amount: 0 }))
      );
    }
  }, [group]);

  const handleSubmit = () => {
    if (!amount || !description || !paidBy || participants.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!Date.parse(date)) {
      Alert.alert('Error', 'Invalid date format');
      return;
    }

    dispatch(addExpense({
      groupId,
      amount: numAmount,
      currency,
      description,
      date,
      category,
      paidBy,
      split: {
        type: splitType,
        participants,
      },
      location,
      historicalRate: currencyRates?.rates?.[currency] ?? 1,
    }));

    dispatch(updateLastActivity(groupId));
    navigation.goBack();
  };

  if (!group || !user) {
    return <FullScreenSpinner text="Loading..." />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >

          {/* MAIN CARD */}
          <Card>

            {/* AMOUNT + CURRENCY */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputField
                  label="Amount *"
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Section title="Currency *">
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setShowCurrencyDropdown(prev => !prev)}
                  >
                    <Text>{currency}</Text>
                  </TouchableOpacity>

                  {showCurrencyDropdown && (
                    <View style={styles.dropdownList}>
                      {CURRENCIES.map(curr => (
                        <SelectableOption
                          key={curr}
                          label={curr}
                          selected={currency === curr}
                          onPress={() => {
                            setCurrency(curr as Currency);
                            setShowCurrencyDropdown(false);
                          }}
                        />
                      ))}
                    </View>
                  )}
                </Section>
              </View>
            </View>

            {/* DESCRIPTION */}
            <InputField
              label="Description *"
              value={description}
              onChangeText={setDescription}
              placeholder="e.g., Dinner at restaurant"
            />

            {/* DATE */}
            <InputField
              label="Date *"
              value={date}
              onChangeText={setDate}
            />

            {/* CATEGORY */}
            <Section title="Category *">
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowCategoryDropdown(prev => !prev)}
              >
                <Text>{category}</Text>
              </TouchableOpacity>

              {showCategoryDropdown && (
                <View style={styles.dropdownList}>
                  {EXPENSE_CATEGORIES.map(cat => (
                    <SelectableOption
                      key={cat}
                      label={cat}
                      selected={category === cat}
                      onPress={() => {
                        setCategory(cat as ExpenseCategory);
                        setShowCategoryDropdown(false);
                      }}
                    />
                  ))}
                </View>
              )}
            </Section>

            {/* PAID BY */}
            <Section title="Paid By *">
              <View style={styles.selectBox}>
                {group.memberIds.map(memberId => (
                  <SelectableOption
                    key={memberId}
                    label={
                      memberId === user.id
                        ? 'You'
                        : `Member ${memberId}`
                    }
                    selected={paidBy === memberId}
                    onPress={() => setPaidBy(memberId)}
                  />
                ))}
              </View>
            </Section>

          </Card>

          {/* ✅ FIXED: SPLIT INSIDE CARD */}
          <Card>
            <SplitTypeSelector
              splitType={splitType}
              onSplitTypeChange={setSplitType}
              participants={participants}
              onParticipantsChange={setParticipants}
              totalAmount={parseFloat(amount) || 0}
              groupMembers={group.memberIds}
            />
          </Card>

          {/* LOCATION */}
          <Card>
            <Section title="Location (Optional)">
              <LocationSearch onLocationSelect={setLocation} />
            </Section>
          </Card>

          {/* BUTTON */}
          <Button onPress={handleSubmit} fullWidth>
            Add Expense
          </Button>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 6,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: '#fff',
    zIndex: 1000,
    elevation: 5, // ✅ Android fix
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});