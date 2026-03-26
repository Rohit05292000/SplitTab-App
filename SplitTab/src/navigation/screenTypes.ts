import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

export type CreateGroupScreenProps =
  NativeStackScreenProps<RootStackParamList, 'CreateGroup'>;

export type AddExpenseScreenProps =
  NativeStackScreenProps<RootStackParamList, 'AddExpense'>;

export type ExpenseDetailScreenProps =
  NativeStackScreenProps<RootStackParamList, 'ExpenseDetail'>;

export type AddSettlementScreenProps =
  NativeStackScreenProps<RootStackParamList, 'AddSettlement'>;

export type SettlementHistoryScreenProps =
  NativeStackScreenProps<RootStackParamList, 'SettlementHistory'>;

export type GroupDetailScreenProps =
  NativeStackScreenProps<RootStackParamList, 'GroupDetail'>;

export type EditProfileScreenProps =
  NativeStackScreenProps<RootStackParamList, 'EditProfile'>;