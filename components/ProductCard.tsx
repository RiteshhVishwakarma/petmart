import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import { formatINR } from '../utils/format';
import { calculateOffer, getOfferBadgeText } from '../utils/offerCalculations';

// Create animated version of TouchableOpacity
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type Props = {
  product: Product;
  onPress: () => void;
  variant?: 'grid' | 'horizontal'; // Add variant prop
};

const ProductCard = ({ product, onPress, variant = 'grid' }: Props) => {
  const { colors } = useTheme();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  
  // Animation for press effect
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  // Calculate offer details
  const offer = product.mrp ? calculateOffer(product.mrp, product.price) : null;
  const offerBadge = product.mrp ? getOfferBadgeText(product.mrp, product.price) : null;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Horizontal variant for similar products carousel
  if (variant === 'horizontal') {
    return (
      <AnimatedTouchable
        style={{
          width: 160,
          backgroundColor: colors.card,
          borderRadius: 10,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border,
          transform: [{ scale: scaleAnim }],
        }}
        activeOpacity={0.85}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: product.image }} style={{ width: '100%', height: 140, resizeMode: 'cover' }} />
          
          {/* Offer Badge */}
          {offerBadge && (
            <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: colors.accent, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 }}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{offerBadge}</Text>
            </View>
          )}
          
          <TouchableOpacity
            style={{
              position: 'absolute', top: 8, right: 8,
              backgroundColor: colors.surface, borderRadius: 16, padding: 5,
              elevation: 2, shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
            }}
            onPress={() => toggleWishlist(product)}
          >
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={16}
              color={wishlisted ? colors.accent : colors.subtext}
            />
          </TouchableOpacity>
        </View>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text, marginBottom: 4, lineHeight: 16 }} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 }}>
            <Ionicons name="star" size={10} color="#f5a623" />
            <Text style={{ fontSize: 10, color: colors.subtext }}>4.5</Text>
          </View>
          
          {/* Price with MRP */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: colors.primary }}>
              {formatINR(product.price)}
            </Text>
            {offer?.hasOffer && (
              <Text style={{ fontSize: 11, color: colors.subtext, textDecorationLine: 'line-through' }}>
                {formatINR(product.mrp!)}
              </Text>
            )}
          </View>
        </View>
      </AnimatedTouchable>
    );
  }

  // Default grid variant
  return (
    <AnimatedTouchable
      style={{
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: 10, 
        marginBottom: 12,
        marginHorizontal: 5,
        overflow: 'hidden',
        borderWidth: 1, 
        borderColor: colors.border,
        transform: [{ scale: scaleAnim }],
      }}
      activeOpacity={0.85}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: product.image }} style={{ width: '100%', height: 150, resizeMode: 'cover' }} />
        
        {/* Offer Badge */}
        {offerBadge && (
          <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{offerBadge}</Text>
          </View>
        )}
        
        <TouchableOpacity
          style={{
            position: 'absolute', top: 8, right: 8,
            backgroundColor: colors.surface, borderRadius: 16, padding: 5,
            elevation: 2, shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
          }}
          onPress={() => toggleWishlist(product)}
        >
          <Ionicons
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={18}
            color={wishlisted ? colors.accent : colors.subtext}
          />
        </TouchableOpacity>
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 13, fontWeight: '500', color: colors.text, marginBottom: 4, lineHeight: 18 }} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 5 }}>
          <Ionicons name="star" size={11} color="#f5a623" />
          <Text style={{ fontSize: 11, color: colors.subtext }}>
            {product.rating || 4.5} · {product.reviewCount || 120}
          </Text>
        </View>
        
        {/* Price with MRP */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: colors.primary }}>
            {formatINR(product.price)}
          </Text>
          {offer?.hasOffer && (
            <Text style={{ fontSize: 12, color: colors.subtext, textDecorationLine: 'line-through' }}>
              {formatINR(product.mrp!)}
            </Text>
          )}
        </View>
        
        <Text style={{ fontSize: 11, color: colors.success, fontWeight: '500' }}>Free delivery</Text>
      </View>
    </AnimatedTouchable>
  );
};

export default memo(ProductCard);
