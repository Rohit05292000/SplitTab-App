import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExpense } from '../../Redux/expensesSlice';
import { RootState } from '../../Redux/Store';
import { Expense } from '../../types';
import { format } from 'date-fns';

// ✅ Navigation imports
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { FullScreenSpinner } from '../../components/common/FullScreenSpinner';
import { useState } from 'react'; 

// ✅ Reusable
import { Card } from '../../components/common/Card';

interface ExpenseCardProps {
  expense: Expense;
}

export const ExpenseCard = ({ expense }: ExpenseCardProps) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Food: '🍔',
      Travel: '✈️',
      Utilities: '💡',
      Entertainment: '🎬',
      Other: '📦',
    };
    return icons[category] || '📦';
  };

 const handleDelete = () => {
  Alert.alert(
    'Confirm',
    'Are you sure you want to delete this expense?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setLoading(true); // ✅ start loading

          setTimeout(() => {
            dispatch(deleteExpense(expense.id));
            setLoading(false); // ✅ stop loading
          }, 500); // small delay for UX
        },
      },
    ]
  );
};

  if (!user) return null;

   if (loading) {
    return <FullScreenSpinner text="Deleting expense..." overlay />;
  }

  const userSplit = expense.split.participants.find(
    p => p.userId === user.id
  );

  return (
    <Card
      onPress={() =>
        navigation.navigate('ExpenseDetail', {
          expenseId: expense.id,
        })
      }
      style={styles.card} // optional override
    >
      <View style={styles.row}>
        {/* LEFT */}
        <View style={styles.left}>
          <Text style={styles.icon}>
            {getCategoryIcon(expense.category)}
          </Text>

          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {expense.description}
            </Text>

            <Text style={styles.sub}>
              {expense.category}
            </Text>

            <Text style={styles.date}>
              {format(new Date(expense.date), 'MMM dd, yyyy')}
            </Text>

            {expense.location && (
              <Text style={styles.location}>
                📍 {expense.location.displayName}
              </Text>
            )}
          </View>
        </View>

        {/* RIGHT */}
        <View style={styles.right}>
          <Text style={styles.amount}>
            {expense.currency} {expense.amount.toFixed(2)}
          </Text>

          {userSplit && (
            <Text style={styles.share}>
              Your share: {expense.currency}{' '}
              {userSplit.amount.toFixed(2)}
            </Text>
          )}

          <Text style={styles.split}>
            {expense.split.type} split
          </Text>
        </View>
      </View>
    </Card>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  left: {
    flexDirection: 'row',
    flex: 1,
  },

  textContainer: {
    flex: 1,
    marginLeft: 10,
  },

  right: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },

  icon: {
    fontSize: 22,
  },

  title: {
    fontWeight: '500',
  },

  sub: {
    fontSize: 12,
    color: '#6b7280',
  },

  date: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },

  location: {
    fontSize: 11,
    color: '#2563eb',
    marginTop: 2,
  },

  amount: {
    fontWeight: '600',
  },

  share: {
    fontSize: 12,
    color: '#6b7280',
  },

  split: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
    textTransform: 'capitalize',
  },
});