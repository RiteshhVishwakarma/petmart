import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, Image,
  TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orderService';
import { Order } from '../types';
import { formatINR } from '../utils/format';
import { OrderCardSkeleton } from '../components/SkeletonLoader';
import ErrorView from '../components/ErrorView';

const STATUS_COLORS: Record<string, string> = {
  placed: '#f59e0b',
  confirmed: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

const STATUS_ICONS: Record<string, string> = {
  placed: 'time-outline',
  confirmed: 'checkmark-circle-outline',
  shipped: 'car-outline',
  delivered: 'bag-check-outline',
  cancelled: 'close-circle-outline',
};

export default function OrderHistoryScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      const data = await getUserOrders(user.uid);
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  // Show error state
  if (error && !refreshing && orders.length === 0) {
    return <ErrorView message={error} onRetry={fetchOrders} />;
  }

  // Show loading skeletons
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
        {[1, 2, 3].map((i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, gap: 12 }}>
        <Ionicons name="bag-outline" size={80} color={colors.border} />
        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>No orders yet</Text>
        <Text style={{ fontSize: 14, color: colors.subtext }}>Your order history will appear here</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      renderItem={({ item }) => {
        const statusColor = STATUS_COLORS[item.status] ?? colors.primary;
        const statusIcon = STATUS_ICONS[item.status] ?? 'time-outline';
        const date = item.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric',
        }) ?? 'Recently';

        return (
          <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
            {/* Order Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <View>
                <Text style={{ fontSize: 12, color: colors.subtext }}>Order ID</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
                  #{item.id.slice(-6).toUpperCase()}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: statusColor + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Ionicons name={statusIcon as any} size={13} color={statusColor} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: statusColor, textTransform: 'capitalize' }}>
                    {item.status}
                  </Text>
                </View>
                <Text style={{ fontSize: 11, color: colors.subtext, marginTop: 4 }}>{date}</Text>
              </View>
            </View>

            {/* Order Items */}
            {item.items.map((p) => (
              <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <Image source={{ uri: p.image }} style={{ width: 56, height: 56, borderRadius: 8, resizeMode: 'cover' }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }} numberOfLines={1}>{p.name}</Text>
                  <Text style={{ fontSize: 12, color: colors.subtext, marginTop: 2 }}>Qty: {p.quantity}</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>{formatINR(p.price * p.quantity)}</Text>
              </View>
            ))}

            {/* Order Footer */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 }}>
              <View>
                <Text style={{ fontSize: 12, color: colors.subtext }}>Deliver to</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                  {item.address?.name}, {item.address?.city}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12, color: colors.subtext }}>Total</Text>
                <Text style={{ fontSize: 15, fontWeight: '800', color: colors.primary }}>{formatINR(item.totalPrice)}</Text>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
}
