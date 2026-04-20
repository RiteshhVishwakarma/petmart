import React, { useState, useEffect, useCallback } from 'react';
import { 
  FlatList, Text, TouchableOpacity, View, Modal, 
  ScrollView, RefreshControl 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Product } from '../types';
import { getProductsByCategory, getCategories } from '../services/productService';
import { useTheme } from '../context/ThemeContext';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import ErrorView from '../components/ErrorView';
import { 
  filterAndSortProducts, 
  SortOption, 
  PriceRange, 
  SORT_OPTIONS, 
  PRICE_RANGES 
} from '../utils/filterSort';

type Props = {
  navigation?: NativeStackNavigationProp<RootStackParamList, 'ProductList'>;
  route?: RouteProp<RootStackParamList, 'ProductList'>;
};

export default function ProductList({ navigation, route }: Props) {
  const { colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState(route?.params?.category ?? 'all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter & Sort states
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const categories = getCategories();

  const fetchProducts = useCallback(async (category: string) => {
    try {
      setError(null);
      const data = await getProductsByCategory(category);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts(activeCategory);
  }, [activeCategory, fetchProducts]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts(activeCategory);
    setRefreshing(false);
  }, [activeCategory, fetchProducts]);

  // Apply filters and sorting
  const filteredProducts = filterAndSortProducts(products, priceRange, sortBy);

  // Show error state
  if (error && !refreshing && products.length === 0) {
    return <ErrorView message={error} onRetry={() => fetchProducts(activeCategory)} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Category Filter Tabs */}
      <View style={{ backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 8 }}
          renderItem={({ item }) => {
            const active = activeCategory === item.id;
            return (
              <TouchableOpacity
                style={{
                  paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
                  borderWidth: 1,
                  borderColor: active ? colors.primary : colors.border,
                  backgroundColor: active ? colors.primary : colors.surface,
                }}
                onPress={() => setActiveCategory(item.id)}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: active ? '#fff' : colors.subtext }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Filter & Sort Bar */}
      <View style={{ 
        flexDirection: 'row', 
        backgroundColor: colors.surface, 
        paddingHorizontal: 12, 
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        gap: 10
      }}>
        <TouchableOpacity
          onPress={() => setShowSortModal(true)}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
          }}
        >
          <Ionicons name="swap-vertical" size={16} color={colors.text} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
            Sort
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowFilterModal(true)}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: priceRange !== 'all' ? colors.primary : colors.border,
            backgroundColor: priceRange !== 'all' ? colors.primary + '15' : colors.card,
          }}
        >
          <Ionicons 
            name="filter" 
            size={16} 
            color={priceRange !== 'all' ? colors.primary : colors.text} 
          />
          <Text style={{ 
            fontSize: 13, 
            fontWeight: '600', 
            color: priceRange !== 'all' ? colors.primary : colors.text 
          }}>
            Filter
          </Text>
          {priceRange !== 'all' && (
            <View style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.primary,
            }} />
          )}
        </TouchableOpacity>
      </View>

      {/* Results count */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <Text style={{ fontSize: 13, color: colors.subtext }}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
        </Text>
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ 
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          loading ? (
            <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
              <View style={{ flex: 1, marginHorizontal: 5 }}>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </View>
              <View style={{ flex: 1, marginHorizontal: 5 }}>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </View>
            </View>
          ) : (
            <View style={{ alignItems: 'center', marginTop: 60, gap: 12 }}>
              <Ionicons name="search-outline" size={60} color={colors.border} />
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
                No products found
              </Text>
              <Text style={{ color: colors.subtext, fontSize: 13 }}>
                Try adjusting your filters
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation?.navigate('ProductDetail', { product: item })}
          />
        )}
      />

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={{ 
            backgroundColor: colors.surface, 
            borderTopLeftRadius: 20, 
            borderTopRightRadius: 20,
            paddingBottom: 30
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border
            }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                Sort By
              </Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    setSortBy(option.value);
                    setShowSortModal(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <Text style={{ 
                    fontSize: 14, 
                    color: sortBy === option.value ? colors.primary : colors.text,
                    fontWeight: sortBy === option.value ? '600' : '400'
                  }}>
                    {option.label}
                  </Text>
                  {sortBy === option.value && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View style={{ 
            backgroundColor: colors.surface, 
            borderTopLeftRadius: 20, 
            borderTopRightRadius: 20,
            paddingBottom: 30
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border
            }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                Filter by Price
              </Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              {PRICE_RANGES.map((range) => (
                <TouchableOpacity
                  key={range.value}
                  onPress={() => {
                    setPriceRange(range.value);
                    setShowFilterModal(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <Text style={{ 
                    fontSize: 14, 
                    color: priceRange === range.value ? colors.primary : colors.text,
                    fontWeight: priceRange === range.value ? '600' : '400'
                  }}>
                    {range.label}
                  </Text>
                  {priceRange === range.value && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Clear Filter Button */}
            {priceRange !== 'all' && (
              <TouchableOpacity
                onPress={() => {
                  setPriceRange('all');
                  setShowFilterModal(false);
                }}
                style={{
                  marginHorizontal: 16,
                  marginTop: 16,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: colors.accent + '20',
                  borderWidth: 1,
                  borderColor: colors.accent,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.accent }}>
                  Clear Filter
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
