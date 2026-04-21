import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orderService';
import { Order } from '../types';
import { formatINR } from '../utils/format';
import { OrderCardSkeleton } from '../components/SkeletonLoader';
import ErrorView from '../components/ErrorView';

const STATUS_COLORS: Record<string, string> = { placed: '#f59e0b', confirmed: '#3b82f6', shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444' };
const STATUS_ICONS: Record<string, string> = { placed: 'time-outline', confirmed: 'checkmark-circle-outline', shipped: 'car-outline', delivered: 'bag-check-outline', cancelled: 'close-circle-outline' };
const STATUS_FLOW: Order['status'][] = ['placed', 'confirmed', 'shipped', 'delivered'];

export default function OrderHistoryScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      const data = await getUserOrders(user.uid);
      setOrders(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  if (error && !refreshing && orders.length === 0) return <ErrorView message={error} onRetry={fetchOrders} />;
  if (loading) return <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>{[1,2,3].map(i => <OrderCardSkeleton key={i} />)}</View>;
  if (orders.length === 0) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, gap: 12 }}><Ionicons name="bag-outline" size={80} color={colors.border} /><Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>No orders yet</Text></View>;

  return (
    <FlatList data={orders} keyExtractor={item => item.id} style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: 16, gap: 12 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
      renderItem={({ item }) => {
        const statusColor = STATUS_COLORS[item.status] ?? colors.primary;
        const statusIcon = STATUS_ICONS[item.status] ?? 'time-outline';
        const isExpanded = expandedOrderId === item.id;
        const date = item.createdAt?.toDate?.()?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) ?? 'Recently';
        return (
          <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setExpandedOrderId(isExpanded ? null : item.id)} style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <View><Text style={{ fontSize: 12, color: colors.subtext }}>Order ID</Text><Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>#{item.id.slice(-6).toUpperCase()}</Text></View>
                <View style={{ alignItems: 'flex-end' }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: statusColor + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}><Ionicons name={statusIcon as any} size={13} color={statusColor} /><Text style={{ fontSize: 12, fontWeight: '700', color: statusColor, textTransform: 'capitalize' }}>{item.status}</Text></View><Text style={{ fontSize: 11, color: colors.subtext, marginTop: 4 }}>{date}</Text></View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, color: colors.text, fontWeight: '600' }}>{item.items.length} items</Text>
                <View style={{ alignItems: 'flex-end' }}><Text style={{ fontSize: 12, color: colors.subtext }}>Total</Text><Text style={{ fontSize: 16, fontWeight: '800', color: colors.primary }}>{formatINR(item.totalPrice)}</Text></View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border }}><Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary, marginRight: 4 }}>{isExpanded ? 'Hide' : 'View'} Details</Text><Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={14} color={colors.primary} /></View>
            </TouchableOpacity>
            {isExpanded && <View>
              {item.status !== 'cancelled' && <View style={{ paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.background }}><Text style={{ fontSize: 11, fontWeight: '700', color: colors.subtext, marginBottom: 10 }}>ORDER TRACKING</Text><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>{STATUS_FLOW.map((s, i) => { const ci = STATUS_FLOW.indexOf(item.status); const done = i <= ci; const sc = STATUS_COLORS[s]; return <View key={s} style={{ flex: 1, alignItems: 'center' }}><View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>{i > 0 && <View style={{ flex: 1, height: 2, backgroundColor: done ? sc : colors.border }} />}<View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: done ? sc : colors.surface, borderWidth: 2, borderColor: done ? sc : colors.border, alignItems: 'center', justifyContent: 'center', marginHorizontal: i === 0 || i === 3 ? 0 : -14 }}>{done ? <Ionicons name="checkmark" size={16} color="#fff" /> : <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border }} />}</View>{i < 3 && <View style={{ flex: 1, height: 2, backgroundColor: done && i < ci ? sc : colors.border }} />}</View><Text style={{ fontSize: 9, fontWeight: done ? '700' : '500', color: done ? sc : colors.subtext, marginTop: 4, textTransform: 'capitalize' }}>{s}</Text></View>; })}</View></View>}
              <View style={{ paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border }}><Text style={{ fontSize: 11, fontWeight: '700', color: colors.subtext, marginBottom: 10 }}>ITEMS ({item.items.length})</Text>{item.items.map((p, idx) => <View key={`${p.id}-${idx}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: idx < item.items.length - 1 ? 1 : 0, borderBottomColor: colors.border }}><Image source={{ uri: p.image }} style={{ width: 50, height: 50, borderRadius: 8 }} /><View style={{ flex: 1 }}><Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }} numberOfLines={2}>{p.name}</Text><Text style={{ fontSize: 11, color: colors.subtext, marginTop: 3 }}>Qty: {p.quantity} × {formatINR(p.price)}</Text></View><Text style={{ fontSize: 13, fontWeight: '800', color: colors.primary }}>{formatINR(p.price * p.quantity)}</Text></View>)}</View>
              <View style={{ paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border }}><Text style={{ fontSize: 11, fontWeight: '700', color: colors.subtext, marginBottom: 8 }}>DELIVERY ADDRESS</Text><View style={{ flexDirection: 'row', gap: 8 }}><View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center' }}><Ionicons name="location" size={16} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 3 }}>{item.address?.name}</Text><Text style={{ fontSize: 12, color: colors.text, lineHeight: 17 }}>{item.address?.address}</Text><Text style={{ fontSize: 12, color: colors.text, marginTop: 2 }}>{item.address?.city}, {item.address?.state} - {item.address?.pincode}</Text><Text style={{ fontSize: 12, color: colors.subtext, marginTop: 4 }}>📞 {item.address?.phone}</Text></View></View></View>
            </View>}
          </View>
        );
      }}
    />
  );
}