import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

type Props = {
  message?: string;
  onRetry?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function ErrorView({ 
  message = 'Something went wrong', 
  onRetry,
  icon = 'alert-circle-outline'
}: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
        padding: 20,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.accent + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <Ionicons name={icon} size={40} color={colors.accent} />
      </View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: colors.text,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        Oops!
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: colors.subtext,
          textAlign: 'center',
          marginBottom: 24,
          lineHeight: 20,
        }}
      >
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Ionicons name="refresh" size={18} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>
            Try Again
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Inline error component for smaller sections
export function InlineError({ message, onRetry }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.accent + '15',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.accent + '30',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <Ionicons name="alert-circle-outline" size={32} color={colors.accent} />
      <Text
        style={{
          fontSize: 13,
          color: colors.text,
          textAlign: 'center',
          lineHeight: 18,
        }}
      >
        {message || 'Failed to load data'}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 6,
          }}
        >
          <Ionicons name="refresh" size={14} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
            Retry
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
