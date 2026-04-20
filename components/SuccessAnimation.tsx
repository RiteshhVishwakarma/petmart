import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  size?: number;
  color?: string;
};

export default function SuccessAnimation({ size = 80, color = '#22c55e' }: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const circleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Circle appears
      Animated.spring(circleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      // Check mark appears
      Animated.spring(checkAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      // Pulse effect
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: Animated.multiply(circleAnim, scaleAnim) }],
        },
      ]}
    >
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color + '20',
            borderWidth: 3,
            borderColor: color,
          },
        ]}
      >
        <Animated.View
          style={{
            opacity: checkAnim,
            transform: [{ scale: checkAnim }],
          }}
        >
          <Ionicons name="checkmark" size={size * 0.6} color={color} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
