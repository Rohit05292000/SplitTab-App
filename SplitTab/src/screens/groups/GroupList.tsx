import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../Redux/Store';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { CreateGroupForm } from './CreateGroupForm';
import { GroupCard } from './GroupCard';
import { Group } from '../../types'; // ✅ ADD TYPE

const GroupList = () => {
  const navigation = useNavigation<any>();
  const groups = useSelector((state: RootState) => state.groups.groups);

  const [showArchived, setShowArchived] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredGroups = useMemo(
    () =>
      groups.filter(g =>
        showArchived ? g.archived : !g.archived
      ),
    [groups, showArchived]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Groups</Text>

        <View style={styles.actions}>
          <Button
            variant="secondary"
            size="sm"
            onPress={() => setShowArchived(prev => !prev)}
          >
            {showArchived ? 'Hide Archived' : 'Show Archived'}
          </Button>

          <Button
            size="sm"
            onPress={() => setIsCreateModalOpen(true)}
          >
            + Create
          </Button>
        </View>
      </View>

      {/* Empty State */}
      {filteredGroups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {showArchived
              ? 'No archived groups'
              : 'No active groups yet'}
          </Text>

          {!showArchived && (
            <Button onPress={() => setIsCreateModalOpen(true)}>
              Create Your First Group
            </Button>
          )}
        </View>
      ) : (
        <FlatList<Group>   
          data={filteredGroups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GroupCard
              group={item}
              onClick={() =>
                navigation.navigate('GroupDetail', {
                  groupId: item.id,
                })
              }
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={5}
          keyboardShouldPersistTaps="handled"   // ✅ FIX TOUCH ISSUES
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Group"
      >
        <CreateGroupForm
          onSuccess={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </View>
  );
};

export default GroupList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },

  list: {
    padding: 16,
    paddingBottom: 24,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    textAlign: 'center',
  },
});