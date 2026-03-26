import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView, // ✅ added
} from 'react-native';
import { SplitType } from '../../types';
import {
  calculateEqualSplit,
  calculatePercentageSplit,
  calculateSharesSplit,
  validateSplit,
} from '../../utils/balanceCalculator';

// ✅ CUSTOM COMPONENTS
import { Section } from '../../components/common/Section';
import { SelectableOption } from '../../components/common/SelectableOption';
import { InputField } from '../../components/common/InputField';
import { Card } from '../../components/common/Card';

interface SplitTypeSelectorProps {
  splitType: SplitType;
  onSplitTypeChange: (type: SplitType) => void;
  participants: { userId: string; amount: number }[];
  onParticipantsChange: (
    participants: { userId: string; amount: number }[]
  ) => void;
  totalAmount: number;
  groupMembers: string[];
}

export const SplitTypeSelector = ({
  splitType,
  onSplitTypeChange,
  participants,
  onParticipantsChange,
  totalAmount,
  groupMembers,
}: SplitTypeSelectorProps) => {
  useEffect(() => {
    if (splitType === 'equal' && totalAmount > 0 && groupMembers.length > 0) {
      const equalSplit = calculateEqualSplit(totalAmount, groupMembers);
      onParticipantsChange(equalSplit);
    }
  }, [splitType, totalAmount, groupMembers, onParticipantsChange]);

  const handleAmountChange = (userId: string, value: string) => {
    const numValue = value === '' ? 0 : Number(value);

    const updated = participants.map(p =>
      p.userId === userId
        ? { ...p, amount: isNaN(numValue) ? 0 : numValue }
        : p
    );

    onParticipantsChange(updated);
  };

  const applyCalculation = () => {
    if (splitType === 'percentage') {
      const calculated = calculatePercentageSplit(totalAmount, participants);
      onParticipantsChange(calculated);
    } else if (splitType === 'shares') {
      const calculated = calculateSharesSplit(totalAmount, participants);
      onParticipantsChange(calculated);
    }
  };

  const validation = validateSplit(splitType, totalAmount, participants);

  const perHead =
    groupMembers.length > 0
      ? (totalAmount / groupMembers.length).toFixed(2)
      : '0.00';

  return (
    <View style={styles.container}>

      {/* SPLIT TYPE */}
      <Section title="Split Type *">
        <View style={styles.typeRow}>
          {(['equal', 'exact', 'percentage', 'shares'] as SplitType[]).map(
            type => (
              <SelectableOption
                key={type}
                label={type}
                selected={splitType === type}
                onPress={() => onSplitTypeChange(type)}
              />
            )
          )}
        </View>
      </Section>

      {/* NON-EQUAL */}
      {splitType !== 'equal' && (
        <Section title="Split Details">

          {(splitType === 'percentage' || splitType === 'shares') && (
            <TouchableOpacity onPress={applyCalculation}>
              <Text style={styles.calculateText}>Calculate</Text>
            </TouchableOpacity>
          )}

          {/* ✅ FIXED: Scroll inside Card */}
          <Card padding={10}>
            <View style={{ maxHeight: 200 }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                {participants.map((participant, index) => (
                  <View key={participant.userId} style={styles.participantRow}>
                    <Text style={styles.memberText}>
                      Member {index + 1}
                    </Text>

                    <View style={{ width: 90 }}>
                      <InputField
                        value={String(participant.amount)}
                        onChangeText={(value) =>
                          handleAmountChange(participant.userId, value)
                        }
                        keyboardType="numeric"
                        placeholder={
                          splitType === 'exact'
                            ? '0.00'
                            : splitType === 'percentage'
                            ? '%'
                            : 'shares'
                        }
                      />
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </Card>

          {!validation.valid && (
            <Text style={styles.error}>{validation.error}</Text>
          )}

          <Text style={styles.helper}>
            {splitType === 'exact' &&
              'Enter exact amounts that sum to total'}
            {splitType === 'percentage' &&
              'Enter percentages that sum to 100%'}
            {splitType === 'shares' &&
              'Enter shares for proportional split'}
          </Text>
        </Section>
      )}

      {/* EQUAL */}
      {splitType === 'equal' && (
        <Card style={styles.equalCard}>
          <Text style={styles.equalText}>
            Split equally among {groupMembers.length} members:{' '}
            <Text style={{ fontWeight: '600' }}>
              {perHead} each
            </Text>
          </Text>
        </Card>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },

  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  calculateText: {
    fontSize: 12,
    color: '#2563eb',
    marginBottom: 6,
  },

  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },

  memberText: {
    flex: 1,
    fontSize: 12,
  },

  error: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 6,
  },

  helper: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 6,
  },

  equalCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },

  equalText: {
    fontSize: 12,
    color: '#1e3a8a',
  },
});