import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import { MonthlySpendChart } from './MonthlySpendChart';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';
import { convertCurrency } from '../../api/currencyApi';
import { startOfMonth, subMonths, format } from 'date-fns';

 const AnalyticsScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const settlements = useSelector((state: RootState) => state.settlements.settlements);
  const currencyRates = useSelector((state: RootState) => state.currency.rates);

  if (!user || !currencyRates) return null; // ✅ SAFETY CHECK

  const calculateMonthlyData = () => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = startOfMonth(subMonths(new Date(), i - 1));

      const monthExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= monthStart && expenseDate < monthEnd;
      });

      const total = monthExpenses.reduce((sum, e) => {
        return sum + convertCurrency(e.amount, e.currency, user.currency, currencyRates);
      }, 0);

      data.push({
        month: format(monthStart, 'MMM'),
        total: Math.round(total * 100) / 100,
      });
    }
    return data;
  };

  const calculateCategoryData = () => {
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate >= currentMonthStart;
    });

    const categoryTotals: Record<string, number> = {};

    currentMonthExpenses.forEach(e => {
      const amount = convertCurrency(e.amount, e.currency, user.currency, currencyRates);
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + amount;
    });

    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total: Math.round(total * 100) / 100,
    }));
  };

  const calculateStats = () => {
    const totalPaid = expenses
      .filter(e => e.paidBy === user.id)
      .reduce((sum, e) => {
        return sum + convertCurrency(e.amount, e.currency, user.currency, currencyRates);
      }, 0);

    const totalOwed = expenses
      .filter(e => e.split?.participants?.some(p => p.userId === user.id)) // ✅ SAFE ACCESS
      .reduce((sum, e) => {
        const userSplit = e.split?.participants?.find(p => p.userId === user.id); // ✅ SAFE ACCESS
        if (userSplit) {
          return sum + convertCurrency(userSplit.amount, e.currency, user.currency, currencyRates);
        }
        return sum;
      }, 0);

    return { totalPaid, totalOwed };
  };

  const monthlyData = calculateMonthlyData();
  const categoryData = calculateCategoryData();
  const stats = calculateStats();

  const topCategory =
    categoryData.length > 0
      ? categoryData.reduce((max, curr) => (curr.total > max.total ? curr : max))
      : { category: 'None', total: 0 }; // ✅ SAFE EMPTY CASE

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Analytics</Text>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.label}>Total Paid</Text>
          <Text style={[styles.value, styles.green]}>
            {user.currency} {stats.totalPaid.toFixed(2)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Total Owed</Text>
          <Text style={[styles.value, styles.red]}>
            {user.currency} {stats.totalOwed.toFixed(2)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Top Category</Text>
          <Text style={[styles.value, styles.blue]}>
            {topCategory.category}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Monthly Spending (Last 6 Months)
        </Text>
        <MonthlySpendChart data={monthlyData} currency={user.currency} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Category Breakdown (Current Month)
        </Text>
        {categoryData.length > 0 ? (
          <CategoryBreakdownChart data={categoryData} currency={user.currency} />
        ) : (
          <Text style={styles.emptyText}>No expenses this month</Text>
        )}
      </View>
    </ScrollView>
  );
};
export default AnalyticsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    // gap removed (not reliable in RN) ✅
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  green: {
    color: 'green',
  },
  red: {
    color: 'red',
  },
  blue: {
    color: 'blue',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 16,
  },
});