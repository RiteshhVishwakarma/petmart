import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function LoadingState({ message = 'Loading...' }: { message?: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, gap: 12 }}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ fontSize: 14, color: colors.subtext }}>{message}</Text>
    </View>
  );
}
