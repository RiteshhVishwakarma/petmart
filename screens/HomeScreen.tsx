import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Image, FlatList, TextInput, Keyboard, RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// MIC: Uncomment when building APK
// import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';

import { RootStackParamList, Product } from '../types';
import { categories } from '../data/products';
import { getProducts, searchProducts } from '../services/productService';
import { useTheme } from '../context/ThemeContext';
import { formatINR } from '../utils/format';
import { HorizontalProductSkeleton, CategorySkeleton } from '../components/SkeletonLoader';
import ErrorView, { InlineError } from '../components/ErrorView';
import { FadeIn, SlideInBottom, ScaleIn, StaggeredItem } from '../components/AnimatedComponents';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const RECENT_KEY = '@petmart_recent_searches';
const MAX_RECENT = 5;

const catIcons: Record<string, { lib: string; name: string }> = {
  all:  { lib: 'mc',  name: 'paw' },
  dog:  { lib: 'fa5', name: 'dog' },
  cat:  { lib: 'fa5', name: 'cat' },
  bird: { lib: 'mc',  name: 'bird' },
  fish: { lib: 'mc',  name: 'fish' },
};

function CatIcon({ id, color }: { id: string; color: string }) {
  const ic = catIcons[id] ?? catIcons['all'];
  if (ic.lib === 'fa5')
    return <FontAwesome5 name={ic.name as any} size={26} color={color} />;
  return <MaterialCommunityIcons name={ic.name as any} size={28} color={color} />;
}

export default function HomeScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch products from Firestore on mount
  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      const data = await getProducts();
      setAllProducts(data);
      setFeatured(data.slice(0, 4));
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  // Load recent searches
  useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY).then((val) => {
      if (val) setRecentSearches(JSON.parse(val));
    });
  }, []);

  // Debounce search query — 300ms
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedQuery(query), 300);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [query]);

  const suggestions = searchProducts(debouncedQuery, allProducts);
  const showDropdown = isFocused && query.trim().length > 0;
  const showRecent = isFocused && query.trim().length === 0 && recentSearches.length > 0;

  const saveRecent = useCallback(async (term: string) => {
    const updated = [term, ...recentSearches.filter((r) => r !== term)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  }, [recentSearches]);

  const clearRecent = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(RECENT_KEY);
  };

  const handleSelect = useCallback((product: Product) => {
    saveRecent(product.name);
    setQuery('');
    setIsFocused(false);
    Keyboard.dismiss();
    navigation.navigate('ProductDetail', { product });
  }, [saveRecent, navigation]);

  const handleRecentTap = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  // Show error state
  if (error && !refreshing && allProducts.length === 0) {
    return <ErrorView message={error} onRetry={fetchProducts} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, backgroundColor: colors.background, zIndex: 100 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
          borderWidth: 1.5,
          borderColor: isFocused ? colors.primary : colors.border,
        }}>
          <Ionicons name="search-outline" size={18} color={isFocused ? colors.primary : colors.subtext} style={{ marginRight: 8 }} />
          <TextInput
            ref={inputRef}
            placeholder="Search for pet products..."
            placeholderTextColor={colors.subtext}
            style={{ flex: 1, fontSize: 14, color: colors.text, padding: 0 }}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            onSubmitEditing={() => suggestions.length > 0 && handleSelect(suggestions[0])}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); inputRef.current?.focus(); }}>
              <Ionicons name="close-circle" size={20} color={colors.subtext} />
            </TouchableOpacity>
          )}
          {/* MIC: Uncomment when building APK
          {query.length === 0 && (
            <TouchableOpacity onPress={startVoiceSearch}>
              <Ionicons name="mic-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          */}
        </View>

        {/* Recent Searches */}
        {showRecent && (
          <View style={{
            position: 'absolute', top: 68, left: 16, right: 16,
            backgroundColor: colors.surface, borderRadius: 10,
            borderWidth: 1, borderColor: colors.border,
            zIndex: 999, elevation: 10,
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12, shadowRadius: 8,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.subtext, letterSpacing: 0.5 }}>RECENT SEARCHES</Text>
              <TouchableOpacity onPress={clearRecent}>
                <Text style={{ fontSize: 12, color: colors.accent, fontWeight: '600' }}>Clear</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.map((term) => (
              <TouchableOpacity
                key={term}
                onPress={() => handleRecentTap(term)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}
              >
                <Ionicons name="time-outline" size={16} color={colors.subtext} />
                <Text style={{ fontSize: 13, color: colors.text, flex: 1 }}>{term}</Text>
                <Ionicons name="arrow-back-outline" size={14} color={colors.subtext} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Suggestions Dropdown */}
        {showDropdown && (
          <View style={{
            position: 'absolute', top: 68, left: 16, right: 16,
            backgroundColor: colors.surface, borderRadius: 10,
            borderWidth: 1, borderColor: colors.border,
            zIndex: 999, elevation: 10,
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15, shadowRadius: 8,
            maxHeight: 320, overflow: 'hidden',
          }}>
            {suggestions.length === 0 ? (
              <View style={{ padding: 16, alignItems: 'center', gap: 6 }}>
                <Ionicons name="search-outline" size={28} color={colors.border} />
                <Text style={{ fontSize: 14, color: colors.subtext }}>No results for "{debouncedQuery}"</Text>
              </View>
            ) : (
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 12,
                      paddingHorizontal: 14, paddingVertical: 10,
                      borderBottomWidth: index < suggestions.length - 1 ? 1 : 0,
                      borderBottomColor: colors.border,
                    }}
                  >
                    <Image source={{ uri: item.image }} style={{ width: 44, height: 44, borderRadius: 8, resizeMode: 'cover' }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }} numberOfLines={1}>{item.name}</Text>
                      <Text style={{ fontSize: 12, color: colors.primary, fontWeight: '700', marginTop: 2 }}>{formatINR(item.price)}</Text>
                    </View>
                    <Ionicons name="arrow-forward-outline" size={16} color={colors.subtext} />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
      </View>

      {/* Main Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="handled" 
        onScrollBeginDrag={Keyboard.dismiss}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >

        {/* Hero Banner - Modern Gradient Design */}
        <FadeIn duration={600}>
          <View style={{ marginHorizontal: 16, marginTop: 8, marginBottom: 20 }}>
            <View style={{ 
              backgroundColor: colors.primary, 
              borderRadius: 20, 
              overflow: 'hidden',
              elevation: 4,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}>
            <View style={{ flexDirection: 'row', minHeight: 180 }}>
              {/* Left Content */}
              <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
                <View style={{ 
                  backgroundColor: 'rgba(255,255,255,0.3)', 
                  alignSelf: 'flex-start', 
                  paddingHorizontal: 10, 
                  paddingVertical: 4, 
                  borderRadius: 6, 
                  marginBottom: 12 
                }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }}>
                    SPECIAL OFFER
                  </Text>
                </View>
                <Text style={{ 
                  color: '#fff', 
                  fontSize: 26, 
                  fontWeight: '900', 
                  lineHeight: 34, 
                  marginBottom: 8,
                  letterSpacing: -0.5
                }}>
                  50% OFF{'\n'}First Order
                </Text>
                <Text style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  fontSize: 13, 
                  marginBottom: 18,
                  lineHeight: 18
                }}>
                  Premium pet products at{'\n'}unbeatable prices
                </Text>
                <TouchableOpacity
                  style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    gap: 8, 
                    backgroundColor: '#fff', 
                    alignSelf: 'flex-start', 
                    paddingHorizontal: 20, 
                    paddingVertical: 12, 
                    borderRadius: 12,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  }}
                  onPress={() => navigation.navigate('ProductList')}
                >
                  <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 14 }}>
                    Shop Now
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
              
              {/* Right Image */}
              <View style={{ 
                width: 140, 
                justifyContent: 'flex-end',
                position: 'relative'
              }}>
                <View style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                }} />
                <Image 
                  source={{ uri: 'https://placedog.net/250/250?id=10' }} 
                  style={{ 
                    width: 140, 
                    height: 140, 
                    resizeMode: 'cover',
                    borderBottomRightRadius: 20
                  }} 
                />
              </View>
            </View>
          </View>
          </View>
        </FadeIn>

        {/* Quick Stats Cards */}
        <SlideInBottom delay={200}>
          <View style={{ 
            flexDirection: 'row', 
            paddingHorizontal: 16, 
            gap: 12, 
            marginBottom: 24 
          }}>
          {[
            { icon: 'cube-outline', label: 'Free Delivery', color: '#10b981' },
            { icon: 'shield-checkmark-outline', label: 'Secure Payment', color: '#3b82f6' },
            { icon: 'refresh-outline', label: 'Easy Returns', color: '#f59e0b' },
          ].map((item, idx) => (
            <View 
              key={idx}
              style={{ 
                flex: 1, 
                backgroundColor: colors.card, 
                padding: 14, 
                borderRadius: 12, 
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
                gap: 6
              }}
            >
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: item.color + '20',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={{ 
                fontSize: 10, 
                fontWeight: '700', 
                color: colors.text,
                textAlign: 'center',
                lineHeight: 13
              }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
        </SlideInBottom>

        {/* Categories - Enhanced Design */}
        <ScaleIn delay={300}>
          <View style={{ marginBottom: 28 }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingHorizontal: 16, 
            marginBottom: 16 
          }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, letterSpacing: -0.5 }}>
                Shop by Pet
              </Text>
              <Text style={{ fontSize: 13, color: colors.subtext, marginTop: 2 }}>
                Find products for your furry friends
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => navigation.navigate('ProductList')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: colors.primary + '15'
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>
                View All
              </Text>
              <Ionicons name="arrow-forward" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories.filter(c => c.id !== 'all')}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={{ alignItems: 'center', width: 85 }} 
                onPress={() => navigation.navigate('ProductList', { category: item.id })} 
                activeOpacity={0.7}
              >
                <View style={{ 
                  width: 72, 
                  height: 72, 
                  borderRadius: 20, 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: 10, 
                  backgroundColor: colors.card,
                  borderWidth: 2,
                  borderColor: colors.primary + '30',
                  elevation: 2,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                }}>
                  <CatIcon id={item.id} color={colors.primary} />
                </View>
                <Text style={{ 
                  fontSize: 12, 
                  fontWeight: '700', 
                  color: colors.text, 
                  textAlign: 'center' 
                }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              loading ? (
                <View style={{ flexDirection: 'row', gap: 14 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <CategorySkeleton key={i} />
                  ))}
                </View>
              ) : null
            }
          />
        </View>
        </ScaleIn>

        {/* Featured Products - Enhanced */}
        <SlideInBottom delay={400}>
          <View style={{ marginBottom: 28 }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingHorizontal: 16, 
            marginBottom: 16 
          }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, letterSpacing: -0.5 }}>
                Trending Now
              </Text>
              <Text style={{ fontSize: 13, color: colors.subtext, marginTop: 2 }}>
                Most popular products this week
              </Text>
            </View>
          </View>
          <FlatList
            data={featured}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ 
                  width: 170, 
                  backgroundColor: colors.card, 
                  borderRadius: 16, 
                  overflow: 'hidden', 
                  borderWidth: 1, 
                  borderColor: colors.border,
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                }}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                activeOpacity={0.85}
              >
                <View style={{ position: 'relative' }}>
                  <Image 
                    source={{ uri: item.image }} 
                    style={{ width: '100%', height: 140, resizeMode: 'cover' }} 
                  />
                  <View style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: colors.accent,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6
                  }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>
                      HOT
                    </Text>
                  </View>
                </View>
                <View style={{ padding: 12 }}>
                  <Text style={{ 
                    fontSize: 13, 
                    fontWeight: '700', 
                    color: colors.text, 
                    marginBottom: 6, 
                    lineHeight: 18,
                    height: 36
                  }} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: 8
                  }}>
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: '900', 
                      color: colors.primary 
                    }}>
                      {formatINR(item.price)}
                    </Text>
                    <View style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      gap: 3,
                      backgroundColor: '#fef3c7',
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                      borderRadius: 4
                    }}>
                      <Ionicons name="star" size={11} color="#f59e0b" />
                      <Text style={{ 
                        fontSize: 11, 
                        color: '#92400e', 
                        fontWeight: '700' 
                      }}>
                        {item.rating || 4.5}
                      </Text>
                    </View>
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                    <Text style={{ 
                      fontSize: 10, 
                      color: colors.success, 
                      fontWeight: '600' 
                    }}>
                      In Stock
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              loading ? (
                <View style={{ flexDirection: 'row', gap: 14 }}>
                  {[1, 2, 3].map((i) => (
                    <HorizontalProductSkeleton key={i} />
                  ))}
                </View>
              ) : error ? (
                <InlineError message="Failed to load products" onRetry={fetchProducts} />
              ) : null
            }
          />
        </View>
        </SlideInBottom>

        {/* Promotional Banner */}
        <View style={{ marginHorizontal: 16, marginBottom: 28 }}>
          <View style={{
            backgroundColor: colors.success + '15',
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.success + '30',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16
          }}>
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.success,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 2,
              shadowColor: colors.success,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}>
              <Ionicons name="gift" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '800', 
                color: colors.text,
                marginBottom: 4
              }}>
                Free Delivery
              </Text>
              <Text style={{ 
                fontSize: 13, 
                color: colors.subtext,
                lineHeight: 18
              }}>
                On all orders above ₹999{'\n'}Limited time offer!
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.success} />
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
