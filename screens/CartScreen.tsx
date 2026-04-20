import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { formatINR } from '../utils/format';
import { RootStackParamList } from '../types';
import { FadeIn, SlideInBottom } from '../components/AnimatedComponents';

type Props = { navigation?: NativeStackNavigationProp<RootStackParamList, 'Cart'> };

export default function CartScreen({ navigation }: Props) {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const { colors } = useTheme();
  
  // Animation for checkout button
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleCheckout = () => {
    if (!user) {
      // Not logged in - redirect to login with return path
      navigation?.navigate('Login', { returnTo: 'Address' });
    } else {
      // Logged in - proceed to address
      navigation?.navigate('Address');
    }
  };

  const animateCheckoutButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (cartItems.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, gap: 10 }}>
        <Ionicons name="cart-outline" size={80} color={colors.border} />
        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>Your cart is empty</Text>
        <Text style={{ fontSize: 14, color: colors.subtext }}>Add items to get started</Text>
      </View>
    );
  }

  const savings = cartItems.reduce((sum, i) => sum + Math.round(i.price * 0.1) * i.quantity, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 120, gap: 10 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 8,
            padding: 10, borderRadius: 8, borderWidth: 1, marginBottom: 4,
            backgroundColor: colors.success + '18', borderColor: colors.success + '40',
          }}>
            <Ionicons name="pricetag-outline" size={16} color={colors.success} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.success }}>
              You're saving {formatINR(savings)} on this order
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{
            flexDirection: 'row', backgroundColor: colors.card,
            borderRadius: 10, padding: 12,
            borderWidth: 1, borderColor: colors.border, gap: 12,
          }}>
            <Image source={{ uri: item.image }} style={{ width: 90, height: 90, borderRadius: 8, resizeMode: 'cover' }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 4, lineHeight: 18 }} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: '800', color: colors.primary, marginBottom: 2 }}>
                {formatINR(item.price)}
              </Text>
              <Text style={{ fontSize: 11, fontWeight: '500', color: colors.success, marginBottom: 8 }}>Free delivery</Text>

              {/* Qty Controls */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TouchableOpacity
                  style={{ width: 30, height: 30, borderRadius: 6, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface }}
                  onPress={() => decreaseQty(item.id)}
                >
                  <Ionicons name="remove" size={16} color={colors.text} />
                </TouchableOpacity>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, minWidth: 20, textAlign: 'center' }}>
                  {item.quantity}
                </Text>
                <TouchableOpacity
                  style={{ width: 30, height: 30, borderRadius: 6, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface }}
                  onPress={() => increaseQty(item.id)}
                >
                  <Ionicons name="add" size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={{ padding: 4, alignSelf: 'flex-start' }} onPress={() => removeFromCart(item.id)}>
              <Ionicons name="trash-outline" size={18} color={colors.accent} />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <View style={{ borderRadius: 10, padding: 16, borderWidth: 1, borderColor: colors.border, marginTop: 10, backgroundColor: colors.surface, gap: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 }}>Price Details</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13, color: colors.subtext }}>Price ({totalItems} items)</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{formatINR(Math.round(totalPrice * 1.1))}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13, color: colors.subtext }}>Discount</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.success }}>− {formatINR(savings)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13, color: colors.subtext }}>Delivery Charges</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.success }}>FREE</Text>
            </View>
            <View style={{ height: 1, backgroundColor: colors.border }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>Total Amount</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: colors.primary }}>{formatINR(totalPrice)}</Text>
            </View>
          </View>
        }
      />

      {/* Checkout Bar */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 14, paddingBottom: 22,
        borderTopWidth: 1, borderTopColor: colors.border,
        elevation: 10, shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 6,
      }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.primary }}>{formatINR(totalPrice)}</Text>
          <Text style={{ fontSize: 12, fontWeight: '500', marginTop: 2, color: colors.success }}>Save {formatINR(savings)}</Text>
        </View>
        <TouchableOpacity style={{
          flexDirection: 'row', alignItems: 'center', gap: 6,
          backgroundColor: colors.primary,
          paddingHorizontal: 24, paddingVertical: 13, borderRadius: 8,
        }} onPress={() => {
          animateCheckoutButton();
          handleCheckout();
        }}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Place Order</Text>
          </Animated.View>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
