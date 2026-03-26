import React, { useMemo,useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';

import { Button } from '../../components/common/Button';
import { GroupCard } from '../groups/GroupCard';
import { FullScreenSpinner } from '../../components/common/FullScreenSpinner';

interface HomeScreenProps {
  navigation: any;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const groups = useSelector((state: RootState) => state.groups.groups);
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const handleCreateGroup = () => {
  setLoading(true);
  setTimeout(() => {
    navigation.navigate('CreateGroup');
    setLoading(false);
  }, 300);
};

  const handleGroupPress = (groupId: string) => {
    navigation.navigate('GroupDetail', { groupId });
  };

  const handleViewAllGroups = () => {
    navigation.navigate('Groups');
  };

  // Stats
  const totalGroups = groups.length;

  const totalMembers = useMemo(
    () =>
      groups.reduce(
        (sum, g) => sum + (g.memberIds?.length || 0),
        0
      ),
    [groups]
  );

  return (
    <SafeAreaView style={styles.container}>
        {loading && <FullScreenSpinner text="Loading..." />}
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {user?.name || 'User'}! 👋
        </Text>

        <Text style={styles.subGreeting}>
          {today} • {totalGroups} active group
          {totalGroups !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Groups</Text>
            <Text style={styles.statValue}>{totalGroups}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Members</Text>
            <Text style={styles.statValue}>{totalMembers}</Text>
          </View>
        </View>

        {/* Groups Section */}
        <View style={styles.groupsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Groups</Text>

            {groups.length > 0 && (
              <TouchableOpacity onPress={handleViewAllGroups}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            )}
          </View>

          {groups.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyText}>No groups yet</Text>
              <Text style={styles.emptySubtext}>
                Create a group to start splitting expenses
              </Text>

              <Button onPress={handleCreateGroup}>
                Create Group
              </Button>
            </View>
          ) : (
            <FlatList
              data={groups.slice(0, 3)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <GroupCard
                  group={item}
                  onClick={() => handleGroupPress(item.id)}
                />
              )}
              scrollEnabled={false}
            />
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateGroup}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },

  subGreeting: {
    fontSize: 14,
    color: '#777',
  },

  content: {
    flex: 1,
    padding: 16,
  },

  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    elevation: 2,
  },

  statLabel: {
    fontSize: 12,
    color: '#999',
  },

  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },

  groupsSection: {
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  viewAll: {
    color: '#2563eb',
    fontWeight: '600',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  },

  emptySubtext: {
    fontSize: 13,
    color: '#777',
    marginBottom: 16,
    textAlign: 'center',
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  fabText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
  },
});