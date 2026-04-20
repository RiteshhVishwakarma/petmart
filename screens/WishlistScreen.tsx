import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { formatINR } from '../utils/format';
import { RootStackParamList } from '../types';
import { showSuccessToast } from '../utils/toast';

type Props = {
  navigation?: NativeStackNavigationProp<RootStackParamList, 'Wishlist'>;
};

export default function WishlistScreen({ navigation }: Props) {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { colors } = useTheme();

  if (wishlist.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, gap: 12 }}>
        <Ionicons name="heart-outline" size={80} color={colors.border} />
        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>Your wishlist is empty</Text>
        <Text style={{ fontSize: 14, color: colors.subtext }}>Save items you love here</Text>
        <TouchableOpacity
          style={{ marginTop: 8, backgroundColor: colors.primary, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 8 }}
          onPress={() => navigation?.navigate('ProductList')}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, gap: 10 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation?.navigate('ProductDetail', { product: item })}
            style={{
              flexDirection: 'row', backgroundColor: colors.card,
              borderRadius: 12, overflow: 'hidden',
              borderWidth: 1, borderColor: colors.border,
            }}
          >
            <Image source={{ uri: item.image }} style={{ width: 110, height: 110, resizeMode: 'cover' }} />
            <View style={{ flex: 1, padding: 12, justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, lineHeight: 18, marginBottom: 4 }} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '800', color: colors.primary }}>
                  {formatINR(item.price)}
                </Text>
                <Text style={{ fontSize: 11, color: colors.success, fontWeight: '500', marginTop: 2 }}>Free delivery</Text>
              </View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  gap: 6, backgroundColor: colors.primary,
                  paddingVertical: 8, borderRadius: 7, marginTop: 8,
                }}
                onPress={() => {
                  addToCart(item);
                  showSuccessToast(`${item.name} added to cart`);
                }}
              >
                <Ionicons name="cart-outline" size={15} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Add to Cart</Text>
              </TouchableOpacity>
            </View>

            {/* Remove from wishlist */}
            <TouchableOpacity
              style={{ padding: 10, alignSelf: 'flex-start' }}
              onPress={() => toggleWishlist(item)}
            >
              <Ionicons name="heart" size={20} color={colors.accent} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
