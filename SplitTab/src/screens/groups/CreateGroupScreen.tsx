import React from 'react';
import { CreateGroupForm } from './CreateGroupForm';
import { CreateGroupScreenProps } from '../../navigation/screenTypes';

export const CreateGroupScreen = ({ navigation }: CreateGroupScreenProps) => {
  return (
    <CreateGroupForm
      onSuccess={() => navigation.goBack()}
    />
  );
};