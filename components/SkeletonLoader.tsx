import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Shimmer effect for loading states
export const ShimmerView = ({ width, height, borderRadius = 8, style }: any) => {
  const { colors } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton = () => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: 10,
        marginBottom: 12,
        marginHorizontal: 5,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <ShimmerView width="100%" height={150} borderRadius={0} />
      <View style={{ padding: 10 }}>
        <ShimmerView width="90%" height={14} style={{ marginBottom: 8 }} />
        <ShimmerView width="60%" height={12} style={{ marginBottom: 8 }} />
        <ShimmerView width="40%" height={16} />
      </View>
    </View>
  );
};

// Horizontal Product Skeleton
export const HorizontalProductSkeleton = () => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: 160,
        backgroundColor: colors.card,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <ShimmerView width="100%" height={140} borderRadius={0} />
      <View style={{ padding: 10 }}>
        <ShimmerView width="90%" height={12} style={{ marginBottom: 6 }} />
        <ShimmerView width="50%" height={10} style={{ marginBottom: 6 }} />
        <ShimmerView width="60%" height={14} />
      </View>
    </View>
  );
};

// Cart Item Skeleton
export const CartItemSkeleton = () => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.card,
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 12,
        marginBottom: 10,
      }}
    >
      <ShimmerView width={90} height={90} />
      <View style={{ flex: 1 }}>
        <ShimmerView width="80%" height={14} style={{ marginBottom: 6 }} />
        <ShimmerView width="40%" height={16} style={{ marginBottom: 6 }} />
        <ShimmerView width="60%" height={12} />
      </View>
    </View>
  );
};

// Order Card Skeleton
export const OrderCardSkeleton = () => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        marginBottom: 12,
      }}
    >
      <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <ShimmerView width="40%" height={12} style={{ marginBottom: 6 }} />
        <ShimmerView width="30%" height={10} />
      </View>
      <View style={{ padding: 12 }}>
        <ShimmerView width="60%" height={14} style={{ marginBottom: 6 }} />
        <ShimmerView width="80%" height={12} />
      </View>
    </View>
  );
};

// Category Skeleton
export const CategorySkeleton = () => {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', width: 85 }}>
      <ShimmerView width={72} height={72} borderRadius={20} style={{ marginBottom: 10 }} />
      <ShimmerView width={60} height={12} />
    </View>
  );
};
