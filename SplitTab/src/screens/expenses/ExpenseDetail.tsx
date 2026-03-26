import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../Redux/Store';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { format } from 'date-fns';
import { ExpenseDetailScreenProps } from '../../navigation/screenTypes';
import { deleteExpense } from '../../Redux/expensesSlice';

// ✅ reusable
import { Card } from '../../components/common/Card';
import { Section } from '../../components/common/Section';

export const ExpenseDetail = ({
  route,
  navigation,
}: ExpenseDetailScreenProps) => {
  const { expenseId } = route.params;

  const dispatch = useDispatch<AppDispatch>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  const expense = useSelector((state: RootState) =>
    state.expenses.expenses.find(e => e.id === expenseId)
  );

  if (!expense) {
    return (
      <View style={styles.center}>
        <Text>Expense not found</Text>
      </View>
    );
  }

  const openInMaps = async () => {
    if (!expense.location) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${expense.location.lat},${expense.location.lon}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      Linking.openURL(url);
    }
  };

  const handleDelete = () => {
    dispatch(deleteExpense(expenseId));
    setShowDeleteModal(false);
    navigation.goBack();
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>

        {/* ✅ GRID CARD */}
        <Card>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Amount</Text>
              <Text style={styles.value}>
                {expense.currency} {(expense.amount ?? 0).toFixed(2)}
              </Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>
                {format(new Date(expense.date), 'MMM dd, yyyy')}
              </Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.value}>{expense.category}</Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.label}>Paid By</Text>
              <Text style={styles.value}>
                {expense.paidBy === user?.id
                  ? 'You'
                  : `Member ${expense.paidBy}`}
              </Text>
            </View>
          </View>
        </Card>

        {/* DESCRIPTION */}
        <Card>
          <Section title="Description">
            <Text style={styles.value}>
              {expense.description || 'No description'}
            </Text>
          </Section>
        </Card>

        {/* SPLIT */}
        <Card>
          <Section title={`Split Breakdown (${expense.split.type})`}>
            <View style={styles.box}>
              {expense.split.participants.map((participant) => (
                <View key={participant.userId} style={styles.row}>
                  <Text style={styles.smallText}>
                    {participant.userId === user?.id
                      ? 'You'
                      : `Member ${participant.userId}`}
                  </Text>

                  <Text style={styles.value}>
                    {expense.currency}{' '}
                    {(participant.amount ?? 0).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </Section>
        </Card>

        {/* LOCATION */}
        {expense.location && (
          <Card>
            <Section title="Location">
              <View style={styles.locationBox}>
                <Text style={styles.smallText}>
                  📍 {expense.location.displayName || 'Unknown location'}
                </Text>

                <Button size="sm" onPress={openInMaps}>
                  Open in Maps
                </Button>
              </View>
            </Section>
          </Card>
        )}

        {/* AUDIT */}
        {expense.auditLog?.length > 0 && (
          <Card>
            <Section title="Audit Log">
              <View style={styles.auditBox}>
                {expense.auditLog.map((log) => (
                  <View key={log.timestamp} style={{ marginBottom: 8 }}>
                    <Text style={styles.auditText}>{log.changes}</Text>
                    <Text style={styles.auditTime}>
                      {format(
                        new Date(log.timestamp),
                        'MMM dd, yyyy HH:mm'
                      )}
                    </Text>
                  </View>
                ))}
              </View>
            </Section>
          </Card>
        )}

        {/* DELETE */}
        <View style={styles.footer}>
          <Button
            variant="danger"
            fullWidth
            onPress={() => setShowDeleteModal(true)}
          >
            Delete Expense
          </Button>
        </View>

      </ScrollView>

      {/* MODAL */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Expense"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Are you sure you want to delete this expense?
          </Text>

          <View style={styles.modalActions}>
            <Button
              variant="secondary"
              onPress={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onPress={handleDelete}
            >
              Delete
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  gridItem: {
    width: '48%',
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },

  value: {
    fontWeight: '600',
  },

  box: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  smallText: {
    fontSize: 12,
  },

  locationBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },

  auditBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 10,
    maxHeight: 120,
    marginTop: 6,
  },

  auditText: {
    fontSize: 12,
    color: '#1f2937',
  },

  auditTime: {
    fontSize: 10,
    color: '#6b7280',
  },

  footer: {
    marginTop: 16,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    padding: 16,
  },

  modalText: {
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});