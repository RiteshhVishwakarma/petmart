import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

type Props = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({ message = 'Something went wrong.', onRetry }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, gap: 12, padding: 24 }}>
      <Ionicons name="alert-circle-outline" size={64} color={colors.accent} />
      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, textAlign: 'center' }}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={{ backgroundColor: colors.primary, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 8, marginTop: 4 }}
          onPress={onRetry}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
