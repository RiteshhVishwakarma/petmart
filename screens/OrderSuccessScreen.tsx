import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import SuccessAnimation from '../components/SuccessAnimation';
import { FadeIn, SlideInBottom } from '../components/AnimatedComponents';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderSuccess'>;

export default function OrderSuccessScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { clearCart } = useCart();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    clearCart();
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 6 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const orderId = `PM${Date.now().toString().slice(-6)}`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Success Icon */}
      <FadeIn duration={400}>
        <SuccessAnimation size={100} color={colors.success} />
      </FadeIn>

      <SlideInBottom delay={400}>
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 8 }}>Order Placed!</Text>
          <Text style={{ fontSize: 14, color: colors.subtext, textAlign: 'center', lineHeight: 22, marginBottom: 24 }}>
            Your order has been placed successfully.{'\n'}You'll receive it by tomorrow.
          </Text>

        {/* Order ID */}
        <View style={{ backgroundColor: colors.surface, borderRadius: 10, padding: 16, borderWidth: 1, borderColor: colors.border, width: '100%', marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 13, color: colors.subtext }}>Order ID</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>#{orderId}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 13, color: colors.subtext }}>Status</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success }} />
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.success }}>Confirmed</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 13, color: colors.subtext }}>Delivery</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>Tomorrow by 9 PM</Text>
          </View>
        </View>

        <TouchableOpacity
          style={{ backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 40, borderRadius: 10, marginBottom: 12, width: '100%', alignItems: 'center' }}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Continue Shopping</Text>
        </TouchableOpacity>
        </View>
      </SlideInBottom>
    </View>
  );
}
