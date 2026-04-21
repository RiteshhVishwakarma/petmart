import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Alert, TextInput, Image, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  getProducts, addProduct, deleteProduct, seedProductsToFirestore,
} from '../services/productService';
import { getAllOrders, updateOrderStatus } from '../services/orderService';
import { uploadImageToCloudinary } from '../services/uploadService';
import { Product, Order } from '../types';
import { formatINR } from '../utils/format';
import SmartProductImage from '../components/SmartProductImage';

const STATUS_FLOW: Order['status'][] = ['placed', 'confirmed', 'shipped', 'delivered'];
const STATUS_COLORS: Record<string, string> = {
  placed: '#f59e0b',
  confirmed: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

export default function AdminScreen() {
  const { colors } = useTheme();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  if (!isAdmin) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <Ionicons name="lock-closed" size={60} color={colors.border} />
        <Text style={{ fontSize: 16, color: colors.subtext, marginTop: 12 }}>Access Denied</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Tabs */}
      <View style={{ flexDirection: 'row', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        {(['products', 'orders'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{
              flex: 1, paddingVertical: 14, alignItems: 'center',
              borderBottomWidth: 2,
              borderBottomColor: activeTab === tab ? colors.primary : 'transparent',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: activeTab === tab ? colors.primary : colors.subtext, textTransform: 'capitalize' }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'products' ? <ProductsTab /> : <OrdersTab />}
    </View>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────
function ProductsTab() {
  const { colors } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '', price: '', mrp: '', category: '', description: '', image: '',
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleSeed = () => {
    Alert.alert('Seed Products', 'Run only ONCE. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Seed', onPress: async () => {
          setSeeding(true);
          try {
            await seedProductsToFirestore();
            Alert.alert('Done', 'Products seeded!');
            fetchProducts();
          } catch { Alert.alert('Error', 'Seeding failed.'); }
          finally { setSeeding(false); }
        },
      },
    ]);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow gallery access to upload images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [4, 3], quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.price || !form.category || !form.description) {
      Alert.alert('Error', 'Fill all required fields (Name, Selling Price, Category, Description)');
      return;
    }
    
    const sellingPrice = parseFloat(form.price);
    const mrpValue = form.mrp ? parseFloat(form.mrp) : sellingPrice;
    
    // Validate: MRP should be >= Selling Price
    if (mrpValue < sellingPrice) {
      Alert.alert('Error', 'MRP cannot be less than Selling Price');
      return;
    }
    
    setUploading(true);
    try {
      let imageUrl = form.image;

      // Upload to Cloudinary if local image selected
      if (imageUri) {
        imageUrl = await uploadImageToCloudinary(imageUri);
      }

      // Fallback image if none provided
      if (!imageUrl) {
        imageUrl = `https://picsum.photos/seed/${form.category}/400/300`;
      }

      await addProduct({
        name: form.name,
        price: sellingPrice,
        mrp: mrpValue,
        category: form.category.toLowerCase().trim(),
        description: form.description,
        image: imageUrl,
      });

      setForm({ name: '', price: '', mrp: '', category: '', description: '', image: '' });
      setImageUri('');
      setShowForm(false);
      fetchProducts();
      Alert.alert('Success', 'Product added!');
    } catch (e) {
      console.error('❌ Product add error:', e);
      const errorMsg = e instanceof Error ? e.message : 'Unknown error';
      Alert.alert('Error', `Failed to add product.\n\n${errorMsg}\n\nCheck Cloudinary config in services/uploadService.ts`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => { await deleteProduct(id); fetchProducts(); },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Seed Button */}
      <TouchableOpacity
        onPress={handleSeed} disabled={seeding}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f59e0b', padding: 13, borderRadius: 10, marginBottom: 10 }}
      >
        <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>
          {seeding ? 'Seeding...' : 'Seed Static Products (Once)'}
        </Text>
      </TouchableOpacity>

      {/* Add Product Toggle */}
      <TouchableOpacity
        onPress={() => setShowForm(!showForm)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary, padding: 13, borderRadius: 10, marginBottom: 16 }}
      >
        <Ionicons name={showForm ? 'close' : 'add-circle-outline'} size={18} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>
          {showForm ? 'Cancel' : 'Add New Product'}
        </Text>
      </TouchableOpacity>

      {/* Add Product Form */}
      {showForm && (
        <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16 }}>
          {[
            { label: 'Product Name *', key: 'name', placeholder: 'Royal Canin Dog Food' },
            { label: 'MRP (Original Price) ₹', key: 'mrp', placeholder: '3299', keyboard: 'numeric', helper: 'Optional - If not provided, selling price will be used' },
            { label: 'Selling Price ₹ *', key: 'price', placeholder: '2999', keyboard: 'numeric', helper: 'Final price customer pays' },
            { label: 'Category *', key: 'category', placeholder: 'dog / cat / bird / fish' },
            { label: 'Description *', key: 'description', placeholder: 'Premium dry food for adult dogs...' },
            { label: 'Image URL (optional)', key: 'image', placeholder: 'https://...' },
          ].map((f) => (
            <View key={f.key} style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: colors.subtext, marginBottom: 4 }}>{f.label}</Text>
              <TextInput
                value={form[f.key as keyof typeof form]}
                onChangeText={(v) => setForm((p) => ({ ...p, [f.key]: v }))}
                placeholder={f.placeholder}
                placeholderTextColor={colors.subtext}
                keyboardType={(f.keyboard as any) ?? 'default'}
                style={{ backgroundColor: colors.inputBg, borderRadius: 8, padding: 10, fontSize: 14, color: colors.text, borderWidth: 1, borderColor: colors.border }}
              />
              {f.helper && (
                <Text style={{ fontSize: 11, color: colors.subtext, marginTop: 4, fontStyle: 'italic' }}>
                  {f.helper}
                </Text>
              )}
            </View>
          ))}
          
          {/* Offer Preview */}
          {form.price && form.mrp && parseFloat(form.mrp) > parseFloat(form.price) && (
            <View style={{ backgroundColor: colors.success + '15', padding: 12, borderRadius: 8, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: colors.success }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.success, marginBottom: 4 }}>
                Offer Preview:
              </Text>
              <Text style={{ fontSize: 11, color: colors.text }}>
                Discount: ₹{(parseFloat(form.mrp) - parseFloat(form.price)).toFixed(0)} ({Math.round(((parseFloat(form.mrp) - parseFloat(form.price)) / parseFloat(form.mrp)) * 100)}% OFF)
              </Text>
            </View>
          )}

          {/* Image Picker */}
          <TouchableOpacity
            onPress={pickImage}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1.5, borderColor: colors.primary, borderStyle: 'dashed', borderRadius: 10, padding: 12, marginBottom: 12 }}
          >
            <Ionicons name="image-outline" size={20} color={colors.primary} />
            <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 13 }}>
              {imageUri ? 'Image Selected ✓' : 'Pick Image from Gallery'}
            </Text>
          </TouchableOpacity>

          {/* Image Preview */}
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={{ width: '100%', height: 160, borderRadius: 10, marginBottom: 12, resizeMode: 'cover' }} />
          ) : null}

          <TouchableOpacity
            onPress={handleAdd} disabled={uploading}
            style={{ backgroundColor: uploading ? colors.border : colors.success, padding: 13, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
          >
            {uploading && <ActivityIndicator size="small" color="#fff" />}
            <Text style={{ color: '#fff', fontWeight: '700' }}>
              {uploading ? 'Uploading...' : 'Save Product'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Product List */}
      <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10 }}>
        All Products ({products.length})
      </Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        products.map((item) => (
          <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 10, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: colors.border, gap: 10 }}>
            <SmartProductImage uri={item.image} width={56} height={56} borderRadius={8} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }} numberOfLines={1}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: colors.primary, fontWeight: '700', marginTop: 2 }}>{formatINR(item.price)}</Text>
              <Text style={{ fontSize: 11, color: colors.subtext }}>{item.category}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} style={{ padding: 8 }}>
              <Ionicons name="trash-outline" size={20} color={colors.accent} />
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab() {
  const { colors } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');

  useEffect(() => {
    getAllOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (order: Order, newStatus: Order['status']) => {
    setUpdating(order.id);
    try {
      await updateOrderStatus(order.id, newStatus);
      setOrders((prev) =>
        prev.map((o) => o.id === order.id ? { ...o, status: newStatus } : o)
      );
    } catch {
      Alert.alert('Error', 'Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  const getNextStatus = (current: Order['status']): Order['status'] | null => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  };

  // Filter orders by status
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  // Count orders by status
  const statusCounts = {
    all: orders.length,
    placed: orders.filter(o => o.status === 'placed').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Ionicons name="bag-outline" size={60} color={colors.border} />
        <Text style={{ color: colors.subtext, fontSize: 15 }}>No orders yet</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Status Filter Tabs */}
      <View style={{ 
        backgroundColor: colors.surface, 
        borderBottomWidth: 1, 
        borderBottomColor: colors.border,
        paddingVertical: 12,
      }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingRight: 24 }}
        >
        {/* All Orders */}
        <TouchableOpacity
          onPress={() => setStatusFilter('all')}
          style={{
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: statusFilter === 'all' ? colors.primary : colors.border,
            backgroundColor: statusFilter === 'all' ? colors.primary : colors.surface,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Text style={{ 
            fontSize: 14, 
            fontWeight: '700', 
            color: statusFilter === 'all' ? '#fff' : colors.text 
          }}>
            All
          </Text>
          <View style={{
            backgroundColor: statusFilter === 'all' ? 'rgba(255,255,255,0.3)' : colors.border,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 12,
            minWidth: 24,
            alignItems: 'center',
          }}>
            <Text style={{ 
              fontSize: 12, 
              fontWeight: '800', 
              color: statusFilter === 'all' ? '#fff' : colors.subtext 
            }}>
              {statusCounts.all}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Status Filters */}
        {(['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const).map((status) => {
          const count = statusCounts[status];
          const statusColor = STATUS_COLORS[status];
          const isActive = statusFilter === status;
          
          return (
            <TouchableOpacity
              key={status}
              onPress={() => setStatusFilter(status)}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 10,
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: isActive ? statusColor : colors.border,
                backgroundColor: isActive ? statusColor : colors.surface,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '700', 
                color: isActive ? '#fff' : colors.text,
                textTransform: 'capitalize'
              }}>
                {status}
              </Text>
              {count > 0 && (
                <View style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : statusColor + '20',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 12,
                  minWidth: 24,
                  alignItems: 'center',
                }}>
                  <Text style={{ 
                    fontSize: 12, 
                    fontWeight: '800', 
                    color: isActive ? '#fff' : statusColor 
                  }}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
          {statusFilter === 'all' 
            ? `All Orders (${filteredOrders.length})` 
            : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Orders (${filteredOrders.length})`
          }
        </Text>
        
        {filteredOrders.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 60, gap: 12 }}>
            <Ionicons name="filter-outline" size={60} color={colors.border} />
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
              No {statusFilter === 'all' ? '' : statusFilter} orders
            </Text>
            <Text style={{ color: colors.subtext, fontSize: 13 }}>
              Try selecting a different filter
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
        const statusColor = STATUS_COLORS[order.status] ?? colors.primary;
        const nextStatus = getNextStatus(order.status);
        const date = order.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric',
        }) ?? 'Recently';

        return (
          <View key={order.id} style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
            {/* Order Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <View>
                <Text style={{ fontSize: 12, color: colors.subtext }}>#{order.id.slice(-6).toUpperCase()}</Text>
                <Text style={{ fontSize: 11, color: colors.subtext, marginTop: 2 }}>{date}</Text>
              </View>
              <View style={{ backgroundColor: statusColor + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: statusColor, textTransform: 'capitalize' }}>
                  {order.status}
                </Text>
              </View>
            </View>

            {/* Customer + Items */}
            <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                {order.address?.name}
              </Text>
              <Text style={{ fontSize: 12, color: colors.subtext, marginTop: 2 }}>
                {order.address?.city}, {order.address?.state} — {order.address?.phone}
              </Text>
              <Text style={{ fontSize: 12, color: colors.subtext, marginTop: 4 }}>
                {order.items.length} item(s) · {formatINR(order.totalPrice)}
              </Text>
            </View>

            {/* Status Update Button */}
            <View style={{ padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Status Steps */}
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {STATUS_FLOW.map((s, i) => {
                  const currentIdx = STATUS_FLOW.indexOf(order.status);
                  const done = i <= currentIdx;
                  return (
                    <View key={s} style={{ alignItems: 'center' }}>
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: done ? STATUS_COLORS[s] : colors.border }} />
                    </View>
                  );
                })}
              </View>

              {/* Next Status Button */}
              {nextStatus && order.status !== 'cancelled' ? (
                <TouchableOpacity
                  onPress={() => handleStatusUpdate(order, nextStatus)}
                  disabled={updating === order.id}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: STATUS_COLORS[nextStatus] + '20', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: STATUS_COLORS[nextStatus] }}
                >
                  {updating === order.id ? (
                    <ActivityIndicator size="small" color={STATUS_COLORS[nextStatus]} />
                  ) : (
                    <Ionicons name="arrow-forward-circle-outline" size={16} color={STATUS_COLORS[nextStatus]} />
                  )}
                  <Text style={{ fontSize: 12, fontWeight: '700', color: STATUS_COLORS[nextStatus], textTransform: 'capitalize' }}>
                    Mark {nextStatus}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ fontSize: 12, color: colors.subtext, fontStyle: 'italic' }}>
                  {order.status === 'delivered' ? 'Completed' : order.status}
                </Text>
              )}
            </View>
          </View>
        );
      })
        )}
      </ScrollView>
    </View>
  );
}
