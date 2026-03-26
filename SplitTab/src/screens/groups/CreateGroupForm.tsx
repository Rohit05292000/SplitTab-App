import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addGroup } from '../../Redux/groupsSlice';
import { RootState, AppDispatch } from '../../Redux/Store';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { MOCK_CONTACTS, GROUP_ICONS } from '../../utils/mockData';
import { FullScreenSpinner } from '../../components/common/FullScreenSpinner';

interface CreateGroupFormProps {
  onSuccess: () => void;
}

export const CreateGroupForm = ({ onSuccess }: CreateGroupFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
  return <FullScreenSpinner text="Loading..." />;
}

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏠');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  

  const handleSubmit = async () => {
  if (!name.trim() || !user) {
    Alert.alert('Error', 'Please enter a valid group name');
    return;
  }

  setLoading(true);

  try {
    dispatch(
      addGroup({
        name: name.trim(),
        icon,
        description,
        memberIds: Array.from(new Set([user.id, ...selectedMembers])),
        archived: false,
      })
    );

    setName('');
    setDescription('');
    setSelectedMembers([]);
    setIcon('🏠');

    onSuccess();
  } finally {
    setLoading(false);
  }
};

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const isValid = name.trim().length > 0;

  // ✅ MEMOIZED HEADER (STABLE — NO RE-RENDER BUG)
  const header = useMemo(() => (
    <View style={styles.container}>
      {/* Group Name */}
      <View style={styles.section}>
        <Text style={styles.label}>Group Name *</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="e.g., Trip"
          returnKeyType="done"
          blurOnSubmit={false}
        />
      </View>

      {/* Icon Grid */}
      <View style={styles.section}>
        <Text style={styles.label}>Icon</Text>

        <View style={{ height: 190 }}>
          <FlatList
            data={GROUP_ICONS}
            keyExtractor={(_, index) => index.toString()}
            numColumns={5}
            scrollEnabled={false}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item: emoji }) => (
              <TouchableOpacity
                onPress={() => setIcon(emoji)}
                style={[
                  styles.iconButton,
                  icon === emoji && styles.iconSelected,
                ]}
              >
                <Text style={styles.iconText}>{emoji}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 80 }]}
          multiline
        />
      </View>

      <Text style={styles.label}>
        Add Members ({selectedMembers.length} selected)
      </Text>
    </View>
  ), [name, description, icon, selectedMembers]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
      style={{ flex: 1 }}
    >
      <FlatList
        data={MOCK_CONTACTS}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}

        ListHeaderComponent={header}

        ListFooterComponent={
          <View style={{ padding: 16 }}>
            <Text style={styles.note}>
              You are automatically added to the group
            </Text>

            <View style={{ marginTop: 16 }}>
              <Button
                fullWidth
                onPress={handleSubmit}
                disabled={!isValid}
              >
                Create Group
              </Button>
            </View>
          </View>
        }

        renderItem={({ item }) => {
          const isSelected = selectedMembers.includes(item.id);

          return (
            <TouchableOpacity
              onPress={() => toggleMember(item.id)}
              style={[
                styles.memberItem,
                isSelected && styles.memberSelected,
              ]}
            >
              <View style={styles.avatarSpacing}>
                <Avatar
                  name={item.name}
                  color={item.avatarColor}
                  size="sm"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.memberName}>
                  {item.name}
                </Text>
                <Text style={styles.memberEmail}>
                  {item.email}
                </Text>
              </View>

              {isSelected && (
                <Text style={styles.check}>✓</Text>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },

  section: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#374151',
  },

  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginTop: 4,
  },

  iconButton: {
    padding: 8,
    margin: 4,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    alignItems: 'center',
  },

  iconSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },

  iconText: {
    fontSize: 20,
  },

  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },

  avatarSpacing: {
    marginRight: 12,
  },

  memberSelected: {
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#2563eb',
  },

  memberName: {
    fontWeight: '500',
  },

  memberEmail: {
    fontSize: 12,
    color: '#6b7280',
  },

  check: {
    color: '#2563eb',
    fontSize: 16,
  },

  note: {
    fontSize: 12,
    color: '#6b7280',
  },
});