import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import { format } from 'date-fns';

// ✅ reusable components
import { Card } from '../../components/common/Card';
import { Section } from '../../components/common/Section';
import { SelectableOption } from '../../components/common/SelectableOption';
import { EmptyState } from '../../components/common/EmptyState';
import { FullScreenSpinner } from '../../components/common/FullScreenSpinner';

interface SettlementHistoryProps {
  groupId: string;
}

export const SettlementHistory = ({ groupId }: SettlementHistoryProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const settlements = useSelector((state: RootState) =>
    state.settlements.settlements
  );

  const group = useSelector((state: RootState) =>
    state.groups.groups.find(g => g.id === groupId)
  );

  const [filterUserId, setFilterUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const filteredSettlements = useMemo(() => {
    let filtered = settlements
      .filter(s => s.groupId === groupId)
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      );

    if (filterUserId) {
      filtered = filtered.filter(
        s =>
          s.fromUserId === filterUserId ||
          s.toUserId === filterUserId
      );
    }

    return filtered;
  }, [settlements, groupId, filterUserId]);

  const handleFilterChange = (id: string | null) => {
    setLoading(true);
    setFilterUserId(id);
    setTimeout(() => setLoading(false), 200);
  };

  return (
    <>
      {/* ✅ Spinner */}
      {loading && <FullScreenSpinner overlay text="Loading..." />}

      <View style={styles.container}>
        {/* Header */}
        <Card>
          <Section title="Settlement History">
            <View style={styles.selectBox}>
              <SelectableOption
                label="All Members"
                selected={!filterUserId}
                onPress={() => handleFilterChange(null)}
              />

              {group?.memberIds.map((memberId) => (
                <SelectableOption
                  key={memberId}
                  label={
                    memberId === user.id
                      ? 'You'
                      : `Member ${memberId}`
                  }
                  selected={filterUserId === memberId}
                  onPress={() => handleFilterChange(memberId)}
                />
              ))}
            </View>
          </Section>
        </Card>

        {/* Empty */}
        {filteredSettlements.length === 0 ? (
          <EmptyState title="No settlements recorded" />
        ) : (
          filteredSettlements.map((item) => (
            <Card key={item.id} padding={12}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.name}>
                    {item.fromUserId === user.id
                      ? 'You'
                      : `Member ${item.fromUserId}`}
                    {' → '}
                    {item.toUserId === user.id
                      ? 'You'
                      : `Member ${item.toUserId}`}
                  </Text>

                  <Text style={styles.date}>
                    {format(new Date(item.date), 'MMM dd, yyyy')}
                  </Text>

                  {item.note ? (
                    <Text style={styles.note}>{item.note}</Text>
                  ) : null}
                </View>

                <Text style={styles.amount}>
                  {item.currency} {item.amount.toFixed(2)}
                </Text>
              </View>
            </Card>
          ))
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9fafb',
  },

  selectBox: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 6,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    fontWeight: '500',
  },

  date: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },

  note: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },

  amount: {
    fontWeight: '600',
    color: 'green',
  },
});