export type RootStackParamList = {
  Tabs: undefined;

  GroupDetail: { groupId: string };
  CreateGroup: undefined;

  AddExpense: { groupId: string };
  ExpenseDetail: { expenseId: string };

  AddSettlement: { groupId: string };
  SettlementHistory: { groupId: string };

  EditProfile: undefined;

  Login: undefined;
  Onboarding: undefined;
};