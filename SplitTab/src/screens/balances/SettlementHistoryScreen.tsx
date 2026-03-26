import React from 'react';
import { SettlementHistory } from '../balances/SettlementHistory'
import { SettlementHistoryScreenProps } from '../../navigation/screenTypes';

export const SettlementHistoryScreen = ({
  route,
}: SettlementHistoryScreenProps) => {
  const { groupId } = route.params;

  return <SettlementHistory groupId={groupId} />;
};