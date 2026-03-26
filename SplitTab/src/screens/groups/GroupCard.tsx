import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import { Group } from '../../types';
import { format } from 'date-fns';
import { calculateBalances } from '../../utils/balanceCalculator';
import { convertCurrency } from '../../api/currencyApi';
import { Card } from '../../components/common/Card';

interface GroupCardProps {
  group: Group;
  onClick: () => void;
}

export const GroupCard = ({ group, onClick }: GroupCardProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const settlements = useSelector((state: RootState) => state.settlements.settlements);
  const currencyRates = useSelector((state: RootState) => state.currency.rates);

  if (!user) return null;

  const groupExpenses = useMemo(
    () => expenses.filter(e => e.groupId === group.id),
    [expenses, group.id]
  );

  const groupSettlements = useMemo(
    () => settlements.filter(s => s.groupId === group.id),
    [settlements, group.id]
  );

  const totalSpend = useMemo(() => {
    if (!currencyRates) return 0;

    return groupExpenses.reduce((sum, e) => {
      return (
        sum +
        convertCurrency(
          e.amount,
          e.currency,
          user.currency,
          currencyRates
        )
      );
    }, 0);
  }, [groupExpenses, user.currency, currencyRates]);

  const balances = useMemo(() => {
    if (!currencyRates) return [];

    return calculateBalances(
      groupExpenses,
      groupSettlements,
      group.id,
      user.currency,
      (amount, from, to) =>
        convertCurrency(amount, from, to, currencyRates)
    );
  }, [groupExpenses, groupSettlements, group.id, user.currency, currencyRates]);

  const userBalance = balances.find(b => b.userId === user.id);
  const netBalance = userBalance?.netBalance ?? 0;

  const formattedDate = useMemo(() => {
    const date = new Date(group.lastActivity);
    return isNaN(date.getTime()) ? '—' : format(date, 'MMM d');
  }, [group.lastActivity]);

  return (
    <Card onPress={onClick}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.row}>
          <Text style={styles.icon}>{group.icon}</Text>

          <View style={{ maxWidth: 180 }}>
            <Text style={styles.title} numberOfLines={1}>
              {group.name}
            </Text>
            <Text style={styles.subText}>
              {group.memberIds.length} members
            </Text>
          </View>
        </View>

        {group.archived && (
          <View style={styles.archivedBadge}>
            <Text style={styles.archivedText}>Archived</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.label}>Total Spend</Text>
          <Text style={styles.value}>
            {user.currency} {totalSpend.toFixed(2)}
          </Text>
        </View>

        <View>
          <Text style={styles.label}>Your Balance</Text>
          <Text
            style={[
              styles.value,
              netBalance > 0
                ? styles.green
                : netBalance < 0
                ? styles.red
                : styles.gray,
            ]}
          >
            {netBalance > 0 ? '+' : ''}
            {user.currency} {netBalance.toFixed(2)}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.label}>Last Activity</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    fontSize: 28,
    marginRight: 10, // ✅ replaced gap
  },

  title: {
    fontWeight: '600',
    fontSize: 16,
  },

  subText: {
    fontSize: 12,
    color: '#6b7280',
  },

  archivedBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  archivedText: {
    fontSize: 10,
    color: '#374151',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },

  label: {
    fontSize: 10,
    color: '#6b7280',
  },

  value: {
    fontWeight: '600',
  },

  green: {
    color: '#16a34a',
  },

  red: {
    color: '#dc2626',
  },

  gray: {
    color: '#6b7280',
  },

  date: {
    fontSize: 12,
  },
});