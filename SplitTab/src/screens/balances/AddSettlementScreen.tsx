import React from 'react';
import { AddSettlementForm } from './AddSettlementForm';
import { AddSettlementScreenProps } from '../../navigation/screenTypes';

export const AddSettlementScreen = ({
  route,
  navigation,
}: AddSettlementScreenProps) => {
  return (
    <AddSettlementForm
      groupId={route.params.groupId}
      onSuccess={() => navigation.goBack()}
    />
  );
};