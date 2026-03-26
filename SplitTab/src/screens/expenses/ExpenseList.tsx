import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import { ExpenseCard } from './ExpenseCard';
import { Expense, Settlement } from '../../types';

// ✅ NEW IMPORTS
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';

interface ExpenseListProps {
  groupId: string;
  ListHeaderComponent?: React.ReactNode;
}

type Activity =
  | {
      type: 'expense';
      data: Expense;
      timestamp: number;
    }
  | {
      type: 'settlement';
      data: Settlement;
      timestamp: number;
    };

export const ExpenseList = ({ groupId }: ExpenseListProps) => {
  const expenses = useSelector(
    (state: RootState) => state.expenses.expenses
  );

  const settlements = useSelector(
    (state: RootState) => state.settlements.settlements
  );

  const activities: Activity[] = useMemo(() => {
    const expenseActivities: Activity[] = expenses
      .filter(e => e.groupId === groupId)
      .map(e => ({
        type: 'expense',
        data: e,
        timestamp: new Date(e.date).getTime(),
      }));

    const settlementActivities: Activity[] = settlements
      .filter(s => s.groupId === groupId)
      .map(s => ({
        type: 'settlement',
        data: s,
        timestamp: new Date(s.date).getTime(),
      }));

    return [...expenseActivities, ...settlementActivities].sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }, [expenses, settlements, groupId]);

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => `${item.type}-${item.data.id}`}
      contentContainerStyle={[
        styles.container,
        activities.length === 0 && { flex: 1 },
      ]}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
      removeClippedSubviews={false}

      ListEmptyComponent={
        <EmptyState title="No expenses or settlements yet" />
      }

      renderItem={({ item }) => {
        if (item.type === 'expense') {
          return <ExpenseCard expense={item.data} />;
        }

        return (
          <Card>
            <View style={styles.row}>
              <View>
                <Text style={styles.settlementTitle}>
                  Settlement
                </Text>
                <Text style={styles.settlementAmount}>
                  {item.data.currency}{' '}
                  {item.data.amount.toFixed(2)}
                </Text>
              </View>

              <Text style={styles.date}>
                {new Date(item.data.date).toLocaleDateString()}
              </Text>
            </View>
          </Card>
        );
      }}

      initialNumToRender={6}
      windowSize={5}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  settlementTitle: {
    fontWeight: '600',
    color: '#065f46',
  },

  settlementAmount: {
    fontSize: 13,
    color: '#047857',
  },

  date: {
    fontSize: 11,
    color: '#4b5563',
  },
});