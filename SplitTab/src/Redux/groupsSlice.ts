import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Group } from '../types';

interface GroupsState {
  groups: Group[];
}

const initialState: GroupsState = {
  groups: [],
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    // ✅ ADD GROUP
    addGroup: (
      state,
      action: PayloadAction<
        Omit<Group, 'id' | 'createdAt' | 'lastActivity'>
      >
    ) => {
      const now = new Date().toISOString();

      const newGroup: Group = {
        id: `group-${Date.now()}`,
        ...action.payload,
        memberIds: Array.from(new Set(action.payload.memberIds)), // ✅ remove duplicates
        createdAt: now,
        lastActivity: now,
      };

      state.groups.push(newGroup);
    },

    // ✅ UPDATE GROUP (safe fields only)
    updateGroup: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Omit<Group, 'id' | 'createdAt'>>;
      }>
    ) => {
      const group = state.groups.find(
        g => g.id === action.payload.id
      );
      if (!group) return;

      Object.assign(group, action.payload.updates);

      // ✅ update activity
      group.lastActivity = new Date().toISOString();
    },

    // ✅ ARCHIVE
    archiveGroup: (state, action: PayloadAction<string>) => {
      const group = state.groups.find(
        g => g.id === action.payload
      );
      if (!group) return;

      group.archived = true;
      group.lastActivity = new Date().toISOString(); // ✅ important
    },

    // ✅ UNARCHIVE
    unarchiveGroup: (state, action: PayloadAction<string>) => {
      const group = state.groups.find(
        g => g.id === action.payload
      );
      if (!group) return;

      group.archived = false;
      group.lastActivity = new Date().toISOString(); // ✅ important
    },

    // ✅ UPDATE LAST ACTIVITY (used by expenses, etc.)
    updateLastActivity: (state, action: PayloadAction<string>) => {
      const group = state.groups.find(
        g => g.id === action.payload
      );
      if (!group) return;

      group.lastActivity = new Date().toISOString();
    },
    deleteGroup: (state, action: PayloadAction<string>) => {
  state.groups = state.groups.filter(
    g => g.id !== action.payload
  );
},
  },
});

export const {
  addGroup,
  updateGroup,
  archiveGroup,
  unarchiveGroup,
  updateLastActivity,
  deleteGroup
} = groupsSlice.actions;

export default groupsSlice.reducer;