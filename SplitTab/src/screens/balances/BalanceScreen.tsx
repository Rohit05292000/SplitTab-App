import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView, // ✅ FIXED
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import {
  calculateBalances,
  calculateMinimumSettlements,
} from '../../utils/balanceCalculator';
import { convertCurrency } from '../../api/currencyApi';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { AddSettlementForm } from './AddSettlementForm';
import { SettlementHistory } from './SettlementHistory';

// reusable components
import { Card } from '../../components/common/Card';
import { Section } from '../../components/common/Section';
import { EmptyState } from '../../components/common/EmptyState';
import { FullScreenSpinner } from '../../components/common/FullScreenSpinner';

interface BalanceScreenProps {
  groupId: string;
}

export const BalanceScreen = ({ groupId }: BalanceScreenProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const settlements = useSelector((state: RootState) => state.settlements.settlements);
  const currencyRates = useSelector((state: RootState) => state.currency.rates);
  const isOffline = useSelector((state: RootState) => state.currency.isOffline);

  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const balances = calculateBalances(
    expenses,
    settlements,
    groupId,
    user.currency,
    (amount, from, to) =>
      convertCurrency(amount, from, to, currencyRates)
  );

  const suggestions = calculateMinimumSettlements(balances);

  return (
    <>
      {loading && <FullScreenSpinner overlay text="Processing..." />}

      {/* ✅ FIXED: ScrollView instead of FlatList */}
      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>

        {/* OFFLINE WARNING */}
        {isOffline && (
          <Card>
            <Text style={styles.warningText}>
              ⚠️ Offline mode: Using cached exchange rates
            </Text>
          </Card>
        )}

        {/* BALANCES */}
        <Card>
          <Section title="Member Balances">
            {balances.length === 0 ? (
              <EmptyState title="No expenses yet" />
            ) : (
              balances.map((balance) => (
                <View key={balance.userId} style={styles.row}>
                  <Text style={styles.name}>
                    {balance.userId === user.id
                      ? 'You'
                      : `Member ${balance.userId}`}
                  </Text>

                  <Text
                    style={[
                      styles.amount,
                      balance.netBalance > 0
                        ? styles.green
                        : balance.netBalance < 0
                        ? styles.red
                        : styles.gray,
                    ]}
                  >
                    {balance.netBalance > 0 ? '+' : ''}
                    {user.currency} {balance.netBalance.toFixed(2)}
                  </Text>
                </View>
              ))
            )}
          </Section>
        </Card>

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
          <Card>
            <Section title="Settlement Suggestions">
              {suggestions.map((s) => (
                <View
                  key={`${s.from}-${s.to}`}
                  style={styles.suggestionBox}
                >
                  {/* ✅ FIXED TEXT */}
                  <Text style={styles.name}>
                    {`${s.from === user.id ? 'You' : `Member ${s.from}`} → ${
                      s.to === user.id ? 'You' : `Member ${s.to}`
                    }`}
                  </Text>

                  <Text style={styles.blue}>
                    {user.currency} {s.amount.toFixed(2)}
                  </Text>
                </View>
              ))}
            </Section>
          </Card>
        )}

        {/* BUTTONS */}
        <View style={styles.buttonColumn}>
          <Button
            onPress={() => {
              setLoading(true);
              setIsSettlementModalOpen(true);
              setTimeout(() => setLoading(false), 200);
            }}
            fullWidth
          >
            Record Settlement
          </Button>

          <View style={styles.spacing} />

          <Button
  variant="secondary"
  onPress={() => setShowHistory(!showHistory)}
  fullWidth
>
  {showHistory ? 'Hide' : 'Show'} History
</Button>
        </View>

        {/* HISTORY */}
        {showHistory && (
          <View style={{ marginTop: 10 }}>
            <SettlementHistory groupId={groupId} />
          </View>
        )}

      </ScrollView>

      {/* MODAL */}
      <Modal
        isOpen={isSettlementModalOpen}
        onClose={() => setIsSettlementModalOpen(false)}
        title="Record Settlement"
      >
        <AddSettlementForm
          groupId={groupId}
          onSuccess={() => setIsSettlementModalOpen(false)}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  name: {
    fontWeight: '500',
  },

  amount: {
    fontWeight: '600',
  },

  green: {
    color: 'green',
  },

  red: {
    color: 'red',
  },

  gray: {
    color: '#6b7280',
  },

  blue: {
    color: '#1d4ed8',
    fontWeight: '600',
  },

  suggestionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  warningText: {
    fontSize: 12,
    color: '#92400e',
  },

  buttonColumn: {
    marginTop: 'auto',
  },

  spacing: {
    height: 10,
  },
});