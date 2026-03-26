import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../Redux/Store';
import {
  updateProfile,
  updateCurrency,
  logout,
} from '../../Redux/authSlice';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { AvatarColor, Currency } from '../../types';
import { AVATAR_COLORS, CURRENCIES } from '../../utils/mockData';
import { convertCurrency } from '../../api/currencyApi';

export const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const settlements = useSelector((state: RootState) => state.settlements.settlements);
  const groups = useSelector((state: RootState) => state.groups.groups);
  const currencyRates = useSelector((state: RootState) => state.currency.rates);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState<AvatarColor>('blue');

  if (!user) return null;

  // ✅ Sync modal state when opened
  useEffect(() => {
    if (isEditModalOpen) {
      setEditName(user.name);
      setEditColor(user.avatarColor);
    }
  }, [isEditModalOpen, user]);

  // ✅ Optimized stats
  const stats = useMemo(() => {
    const userExpenses = expenses.filter(e => e.paidBy === user.id);

    const totalPaid = userExpenses.reduce((sum, e) => {
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

    const userSettlements = settlements.filter(
      s => s.fromUserId === user.id
    );

    const totalSettled = userSettlements.reduce((sum, s) => {
      return (
        sum +
        convertCurrency(
          s.amount,
          s.currency,
          user.currency,
          currencyRates
        )
      );
    }, 0);

    const activeGroups = groups.filter(g => !g.archived).length;

    return { totalPaid, totalSettled, activeGroups };
  }, [expenses, settlements, groups, user, currencyRates]);

  const handleSave = () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    dispatch(
      updateProfile({
        name: editName.trim(),
        avatarColor: editColor,
      })
    );

    setIsEditModalOpen(false);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Avatar
            name={user.name}
            color={user.avatarColor}
            size="lg"
          />

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>

          <Button onPress={() => setIsEditModalOpen(true)}>
            Edit
          </Button>
        </View>

        {/* Currency */}
        <View style={styles.section}>
          <Text style={styles.label}>Display Currency</Text>

          <View style={styles.currencyContainer}>
            {CURRENCIES.map(curr => (
              <TouchableOpacity
                key={curr}
                onPress={() =>
                  dispatch(updateCurrency(curr as Currency))
                }
                style={[
                  styles.currencyButton,
                  user.currency === curr &&
                    styles.currencySelected,
                ]}
              >
                <Text>{curr}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.card}>
        <Text style={styles.heading}>Lifetime Statistics</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: '#ECFDF5' }]}>
            <Text style={styles.statLabel}>Total Paid</Text>
            <Text style={[styles.statValue, { color: 'green' }]}>
              {user.currency} {stats.totalPaid.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: '#EFF6FF' }]}>
            <Text style={styles.statLabel}>Total Settled</Text>
            <Text style={[styles.statValue, { color: 'blue' }]}>
              {user.currency} {stats.totalSettled.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: '#F5F3FF' }]}>
            <Text style={styles.statLabel}>Active Groups</Text>
            <Text style={[styles.statValue, { color: 'purple' }]}>
              {stats.activeGroups}
            </Text>
          </View>
        </View>
      </View>

      {/* Logout */}
      <Button variant="danger" fullWidth onPress={handleLogout}>
        Logout
      </Button>

      {/* Modal */}
      <Modal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  title="Edit Profile"
>
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
    {/* ✅ USE VIEW (not ScrollView) */}
    <View style={styles.modalContent}>

      {/* Name */}
      <View>
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          value={editName}
          onChangeText={setEditName}
          style={styles.input}
        />
      </View>

      {/* Avatar Colors */}
      <View>
        <Text style={styles.label}>Avatar Color</Text>

        <View style={styles.colorGrid}>
          {AVATAR_COLORS.map(color => (
            <TouchableOpacity
              key={color}
              onPress={() => setEditColor(color)}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                editColor === color && styles.selectedColor,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Buttons (using your custom Button ✅) */}
      <View style={styles.modalButtons}>
  <Button
    variant="secondary"
    fullWidth
    onPress={() => setIsEditModalOpen(false)}
  >
    Cancel
  </Button>

  <Button fullWidth onPress={handleSave}>
    Save
  </Button>
</View>

    </View>
  </KeyboardAvoidingView>
</Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  email: {
    color: '#666',
  },
  section: {
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
currencyContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
},
  currencyButton: {
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ddd',
  marginRight: 8,
  marginBottom: 8,
},
  currencySelected: {
    borderColor: '#2563EB',
    backgroundColor: '#DBEAFE',
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },
colorGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
},

 colorCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 10,
  marginBottom: 10,
},
  selectedColor: {
    borderWidth: 3,
    borderColor: '#2563EB',
  },
 modalButtons: {
  flexDirection: 'row',
  marginTop: 12,
},
  modalContent: {
  padding: 16,
  gap: 12,
},
modalBtn: {
  flex: 1,
  marginRight: 8,
},
});