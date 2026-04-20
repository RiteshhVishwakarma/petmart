import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, UserAddress } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/orderService';
import { getUserAddresses, addAddress, updateAddress, deleteAddress } from '../services/addressService';
import { formatINR } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Address'>;

export default function AddressScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '', phone: '', pincode: '',
    address: '', city: '', state: '',
  });

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    if (!user) return;
    setInitialLoading(true);
    try {
      const data = await getUserAddresses(user.uid);
      setAddresses(data);
      if (data.length > 0) {
        setSelectedAddressId(data[0].id);
        setShowForm(false);
      } else {
        setShowForm(true);
      }
    } catch (e) {
      console.log('Error loading addresses', e);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleAddNewAddress = () => {
    setForm({ name: '', phone: '', pincode: '', address: '', city: '', state: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditAddress = (addr: UserAddress) => {
    setForm({
      name: addr.name, phone: addr.phone, pincode: addr.pincode,
      address: addr.address, city: addr.city, state: addr.state,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await deleteAddress(user.uid, id);
            const filtered = addresses.filter(a => a.id !== id);
            setAddresses(filtered);
            if (selectedAddressId === id) {
              setSelectedAddressId(filtered.length > 0 ? filtered[0].id : null);
            }
            if (filtered.length === 0) setShowForm(true);
          } catch (e) {
            Alert.alert('Error', 'Failed to delete address.');
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  const handleSaveAddress = async () => {
    const { name, phone, pincode, address, city, state } = form;
    if (!name || !phone || !pincode || !address || !city || !state) {
      Alert.alert('Missing Details', 'Please fill all fields to continue.');
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      if (editingId) {
        await updateAddress(user.uid, editingId, form);
      } else {
        await addAddress(user.uid, form);
      }
      await loadAddresses();
      setShowForm(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to save address.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) return;
    if (showForm) {
      Alert.alert('Action Required', 'Please save your address first or select an existing one.');
      return;
    }

    if (!selectedAddressId) {
      Alert.alert('Missing Address', 'Please select an address for delivery.');
      return;
    }

    const selectedAddr = addresses.find(a => a.id === selectedAddressId);
    if (!selectedAddr) return;

    setLoading(true);
    try {
      await placeOrder(user.uid, cartItems, totalPrice, {
        name: selectedAddr.name,
        phone: selectedAddr.phone,
        pincode: selectedAddr.pincode,
        address: selectedAddr.address,
        city: selectedAddr.city,
        state: selectedAddr.state
      });
      clearCart();
      navigation.replace('OrderSuccess');
    } catch (e) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (
    label: string, key: keyof typeof form,
    placeholder: string, keyboardType: any = 'default'
  ) => (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.subtext, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Text>
      <TextInput
        value={form[key]}
        onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))}
        placeholder={placeholder}
        placeholderTextColor={colors.subtext}
        keyboardType={keyboardType}
        style={{
          backgroundColor: colors.inputBg, borderRadius: 8,
          paddingHorizontal: 14, paddingVertical: 12,
          fontSize: 14, color: colors.text,
          borderWidth: 1, borderColor: colors.border,
        }}
      />
    </View>
  );

  if (initialLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {!showForm ? (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="location-outline" size={20} color={colors.primary} />
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>Select Delivery Address</Text>
              </View>
              <TouchableOpacity onPress={handleAddNewAddress}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary }}>+ Add New</Text>
              </TouchableOpacity>
            </View>

            {addresses.map((addr) => (
              <TouchableOpacity 
                key={addr.id}
                onPress={() => setSelectedAddressId(addr.id)}
                style={{ 
                  backgroundColor: colors.surface, 
                  borderRadius: 12, 
                  padding: 16, 
                  borderWidth: 2, 
                  borderColor: selectedAddressId === addr.id ? colors.primary : colors.border, 
                  marginBottom: 16 
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 }}>{addr.name}</Text>
                    <Text style={{ fontSize: 13, color: colors.subtext, marginBottom: 4 }}>{addr.phone}</Text>
                    <Text style={{ fontSize: 14, color: colors.text, lineHeight: 20 }}>
                      {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity onPress={() => handleEditAddress(addr)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Ionicons name="pencil" size={18} color={colors.subtext} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteAddress(addr.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Ionicons name="trash" size={18} color="#ff6161" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="location-outline" size={20} color={colors.primary} />
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                  {editingId ? 'Edit Address' : 'New Address'}
                </Text>
              </View>
              {addresses.length > 0 && (
                <TouchableOpacity onPress={() => setShowForm(false)}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.subtext }}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {field('Full Name', 'name', 'Enter your full name')}
            {field('Phone Number', 'phone', '10-digit mobile number', 'phone-pad')}
            {field('Pincode', 'pincode', '6-digit pincode', 'numeric')}
            {field('Address', 'address', 'House no, Street, Area')}
            {field('City', 'city', 'City')}
            {field('State', 'state', 'State')}

            <TouchableOpacity
              style={{ backgroundColor: loading ? colors.border : colors.primary, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 }}
              onPress={handleSaveAddress}
              disabled={loading}
            >
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>
                {loading ? 'Saving...' : 'Save Address'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Order Summary */}
        <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 100 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10 }}>
            Order Summary ({cartItems.length} items)
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 13, color: colors.subtext }}>Total Amount</Text>
            <Text style={{ fontSize: 14, fontWeight: '800', color: colors.primary }}>{formatINR(totalPrice)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <Text style={{ fontSize: 13, color: colors.subtext }}>Delivery</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.success }}>FREE</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 24, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}>
        <TouchableOpacity
          style={{ 
            backgroundColor: loading || showForm || (!selectedAddressId && addresses.length > 0) ? colors.border : colors.primary, 
            paddingVertical: 15, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 
          }}
          onPress={handlePlaceOrder}
          disabled={loading || showForm || (!selectedAddressId && addresses.length > 0)}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>
            {loading ? 'Processing...' : `Place Order · ${formatINR(totalPrice)}`}
          </Text>
          {!loading && <Ionicons name="arrow-forward" size={16} color="#fff" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}
