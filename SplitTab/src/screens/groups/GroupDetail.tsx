import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../Redux/Store';
import {
  archiveGroup,
  unarchiveGroup,
  deleteGroup,
} from '../../Redux/groupsSlice';
import { Button } from '../../components/common/Button';
import { ExpenseList } from '../expenses/ExpenseList';
import { BalanceScreen } from '../balances/BalanceScreen';
import { Modal } from '../../components/common/Modal';
import { GroupDetailScreenProps } from '../../navigation/screenTypes';

const tabs = ['expenses', 'balances'] as const;
type TabType = (typeof tabs)[number];

export const GroupDetail = ({
  route,
  navigation,
}: GroupDetailScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { groupId } = route.params;

  const group = useSelector((state: RootState) =>
    state.groups.groups.find(g => g.id === groupId)
  );

  const [activeTab, setActiveTab] = useState<TabType>('expenses');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!group) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Group not found</Text>
        <Button onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  const handleArchiveToggle = () => {
    if (group.archived) {
      dispatch(unarchiveGroup(group.id));
    } else {
      Alert.alert(
        'Archive Group',
        'Are you sure you want to archive this group?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Archive',
            style: 'destructive',
            onPress: () => dispatch(archiveGroup(group.id)),
          },
        ]
      );
    }
  };

  const handleDeleteGroup = () => {
    dispatch(deleteGroup(group.id));
    setShowDeleteModal(false);
    navigation.goBack();
  };

  return (
    <>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            <View style={styles.actions}>
              <View style={styles.actionBtn}>
                <Button
                  variant="secondary"
                  size="sm"
                  onPress={handleArchiveToggle}
                >
                  {group.archived ? 'Unarchive' : 'Archive'}
                </Button>
              </View>

              <Button
                variant="danger"
                size="sm"
                onPress={() => setShowDeleteModal(true)}
              >
                Delete
              </Button>
            </View>
          </View>

          <View style={styles.groupInfo}>
            <Text style={styles.icon}>{group.icon}</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={1}>
                {group.name}
              </Text>

              {group.description ? (
                <Text style={styles.desc} numberOfLines={2}>
                  {group.description}
                </Text>
              ) : null}

              <Text style={styles.members}>
                {group.memberIds.length} members
              </Text>
            </View>
          </View>

          {/* TABS */}
          <View style={styles.tabs}>
            {tabs.map(tab => {
              const isActive = activeTab === tab;

              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tab,
                    isActive && styles.activeTab,
                  ]}
                >
                  <Text
                    style={
                      isActive
                        ? styles.activeTabText
                        : styles.tabText
                    }
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* CONTENT */}
        <View style={{ flex: 1 }}>
        {activeTab === 'expenses' ? (
  <>
    {/* ✅ ADD EXPENSE BUTTON (FIXED HERE) */}
    <View style={{ padding: 16 }}>
      <Button
        fullWidth
        disabled={group.archived}
        onPress={() =>
          navigation.navigate('AddExpense', {
            groupId: group.id,
          })
        }
      >
        {group.archived ? 'Group Archived' : 'Add Expense'}
      </Button>
    </View>

    {/* ✅ LIST */}
    <ExpenseList groupId={group.id} />
  </>
) : (
  <BalanceScreen groupId={group.id} />
)}
        </View>
      </View>

      {/* DELETE MODAL */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Group"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Are you sure you want to delete this group?
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
              onPress={handleDeleteGroup}
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
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 16,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  backButton: {
    padding: 6,
  },

  backArrow: {
    fontSize: 20,
    color: '#2563eb',
    fontWeight: '600',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionBtn: {
    marginRight: 8, // ✅ replaces gap
  },

  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  icon: {
    fontSize: 32,
    marginRight: 10, // ✅ replaces gap
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
  },

  desc: {
    color: '#6b7280',
    fontSize: 12,
  },

  members: {
    fontSize: 12,
    color: '#9ca3af',
  },

  tabs: {
    flexDirection: 'row',
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    marginRight: 8, // ✅ replaces gap
  },

  activeTab: {
    backgroundColor: '#2563eb',
  },

  tabText: {
    color: '#6b7280',
    textTransform: 'capitalize',
  },

  activeTabText: {
    color: '#ffffff',
    fontWeight: '500',
    textTransform: 'capitalize',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    marginBottom: 10,
    color: '#6b7280',
  },

  modalContent: {
    padding: 10,
  },

  modalText: {
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});