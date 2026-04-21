import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Linking, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { logOut, deleteAccount } from '../services/authService';
import { getUserOrders } from '../services/orderService';

// Support contact details
const SUPPORT_PHONE = '+917565025005';
const SUPPORT_EMAIL = 'riteshsunstone@gmail.com';

export default function ProfileScreen({ navigation }: { navigation?: any }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();
  const { user, profile } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      getUserOrders(user.uid).then((orders) => setOrderCount(orders.length));
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive',
        onPress: async () => {
          try {
            setLoggingOut(true);
            await logOut();
            // Force navigation to home after logout
            if (navigation) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            }
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      Alert.alert('Error', 'Please enter your password to confirm');
      return;
    }

    setDeleting(true);
    try {
      await deleteAccount(deletePassword);
      Alert.alert(
        'Account Deleted',
        'Your account has been permanently deleted. We\'re sad to see you go!',
        [{ text: 'OK' }]
      );
      setShowDeleteModal(false);
      // User will be automatically logged out
    } catch (error: any) {
      console.error('Delete account error:', error);
      const msg =
        error.code === 'auth/wrong-password' ? 'Incorrect password. Please try again.' :
        error.code === 'auth/too-many-requests' ? 'Too many attempts. Please try again later.' :
        error.code === 'auth/requires-recent-login' ? 'Please logout and login again before deleting your account.' :
        'Failed to delete account. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setDeleting(false);
      setDeletePassword('');
    }
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      '⚠️ Delete Account',
      'This action is permanent and cannot be undone. All your data including orders, wishlist, and cart will be deleted.\n\nAre you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: () => setShowDeleteModal(true),
        },
      ]
    );
  };

  const handleHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'How would you like to contact us?',
      [
        {
          text: 'WhatsApp',
          onPress: () => {
            const whatsappUrl = `whatsapp://send?phone=${SUPPORT_PHONE}&text=Hi, I need help with PetMart app`;
            Linking.canOpenURL(whatsappUrl)
              .then((supported) => {
                if (supported) {
                  Linking.openURL(whatsappUrl);
                } else {
                  Alert.alert('Error', 'WhatsApp is not installed on your device');
                }
              })
              .catch(() => Alert.alert('Error', 'Failed to open WhatsApp'));
          },
        },
        {
          text: 'Email',
          onPress: () => {
            const emailUrl = `mailto:${SUPPORT_EMAIL}?subject=PetMart Support Request&body=Hi, I need help with...`;
            Linking.canOpenURL(emailUrl)
              .then((supported) => {
                if (supported) {
                  Linking.openURL(emailUrl);
                } else {
                  Alert.alert('Error', 'No email app found');
                }
              })
              .catch(() => Alert.alert('Error', 'Failed to open email app'));
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const row = (icon: string, label: string, value?: string, onPress?: () => void) => (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary + '18', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon as any} size={18} color={colors.primary} />
      </View>
      <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.text }}>{label}</Text>
      {value && <Text style={{ fontSize: 13, color: colors.subtext }}>{value}</Text>}
      <Ionicons name="chevron-forward" size={16} color={colors.border} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} showsVerticalScrollIndicator={false}>
      {/* Avatar */}
      <View style={{ backgroundColor: colors.primary, paddingTop: 32, paddingBottom: 40, alignItems: 'center' }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        
        {user ? (
          <>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
              {profile?.name ?? user?.displayName ?? 'User'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 }}>
              {user?.email ?? ''}
            </Text>
            {profile?.role === 'admin' && (
              <View style={{ marginTop: 8, backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>ADMIN</Text>
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Guest User</Text>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 }}>
              Sign in to access all features
            </Text>
            <TouchableOpacity
              onPress={() => navigation?.navigate('Login')}
              style={{ marginTop: 16, backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 }}
            >
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '700' }}>Sign In</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Stats */}
      <View style={{ flexDirection: 'row', backgroundColor: colors.surface, marginHorizontal: 16, marginTop: -20, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 20 }}>
        {[
          { icon: 'cart-outline', label: 'Cart', value: totalItems },
          { icon: 'heart-outline', label: 'Wishlist', value: totalWishlist },
          { icon: 'bag-outline', label: 'Orders', value: orderCount },
        ].map((s) => (
          <View key={s.label} style={{ flex: 1, alignItems: 'center' }}>
            <Ionicons name={s.icon as any} size={22} color={colors.primary} />
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 4 }}>{s.value}</Text>
            <Text style={{ fontSize: 11, color: colors.subtext, marginTop: 2 }}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Orders Section - Only for logged in users */}
      {user && (
        <View style={{ backgroundColor: colors.surface, marginHorizontal: 16, borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.subtext, paddingTop: 14, paddingBottom: 4, letterSpacing: 0.5 }}>ORDERS</Text>
          {row('bag-outline', 'My Orders', undefined, () => navigation?.navigate('OrderHistory'))}
        </View>
      )}

      {/* Preferences */}
      <View style={{ backgroundColor: colors.surface, marginHorizontal: 16, borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: colors.subtext, paddingTop: 14, paddingBottom: 4, letterSpacing: 0.5 }}>PREFERENCES</Text>
        {row('moon-outline', 'Dark Mode', isDark ? 'On' : 'Off', toggleTheme)}
        {row('notifications-outline', 'Notifications', 'Enabled')}
        {row('language-outline', 'Language', 'English')}
      </View>

      {/* Support */}
      <View style={{ backgroundColor: colors.surface, marginHorizontal: 16, borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: colors.subtext, paddingTop: 14, paddingBottom: 4, letterSpacing: 0.5 }}>SUPPORT</Text>
        {row('help-circle-outline', 'Help & Support', undefined, handleHelpSupport)}
        
        {/* Quick Contact Buttons */}
        <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <TouchableOpacity
            onPress={() => {
              const whatsappUrl = `whatsapp://send?phone=${SUPPORT_PHONE}&text=Hi, I need help with PetMart app`;
              Linking.openURL(whatsappUrl).catch(() => Alert.alert('Error', 'WhatsApp not installed'));
            }}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#25D366', paddingVertical: 10, borderRadius: 8 }}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>WhatsApp</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              const emailUrl = `mailto:${SUPPORT_EMAIL}?subject=PetMart Support Request`;
              Linking.openURL(emailUrl).catch(() => Alert.alert('Error', 'No email app found'));
            }}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.primary, paddingVertical: 10, borderRadius: 8 }}
          >
            <Ionicons name="mail-outline" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Email</Text>
          </TouchableOpacity>
        </View>
        
        {row('document-text-outline', 'Terms & Conditions', undefined, () => navigation?.navigate('Terms'))}
        {row('shield-checkmark-outline', 'Privacy Policy', undefined, () => navigation?.navigate('Privacy'))}
        {row('information-circle-outline', 'About Developer', undefined, () => navigation?.navigate('AboutDeveloper'))}
      </View>

      {/* Admin Panel — only visible to admin */}
      {profile?.role === 'admin' && (
        <TouchableOpacity
          onPress={() => navigation?.navigate('Admin')}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginBottom: 12, padding: 15, borderRadius: 12, backgroundColor: '#f59e0b' }}
        >
          <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>Admin Panel</Text>
        </TouchableOpacity>
      )}

      {/* Logout - Only for logged in users */}
      {user && (
        <>
          <TouchableOpacity
            onPress={handleLogout}
            disabled={loggingOut}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginBottom: 12, padding: 15, borderRadius: 12, borderWidth: 1.5, borderColor: colors.accent }}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.accent} />
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.accent }}>
              {loggingOut ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>

          {/* Delete Account */}
          <TouchableOpacity
            onPress={showDeleteConfirmation}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginBottom: 40, padding: 15, borderRadius: 12, borderWidth: 1.5, borderColor: '#ef4444', backgroundColor: '#ef444410' }}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#ef4444' }}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 }}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ef444420', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Ionicons name="warning" size={32} color="#ef4444" />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 8 }}>
                Delete Account?
              </Text>
              <Text style={{ fontSize: 14, color: colors.subtext, textAlign: 'center', lineHeight: 20 }}>
                Enter your password to permanently delete your account. This action cannot be undone.
              </Text>
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.subtext, marginBottom: 8 }}>
                CONFIRM PASSWORD
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14 }}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.subtext} style={{ marginRight: 10 }} />
                <TextInput
                  style={{ flex: 1, paddingVertical: 13, fontSize: 14, color: colors.text }}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.subtext}
                  value={deletePassword}
                  onChangeText={setDeletePassword}
                  secureTextEntry
                  autoFocus
                />
              </View>
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
                disabled={deleting}
                style={{ flex: 1, paddingVertical: 14, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center' }}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeleteAccount}
                disabled={deleting || !deletePassword.trim()}
                style={{ flex: 1, paddingVertical: 14, borderRadius: 10, backgroundColor: deleting || !deletePassword.trim() ? colors.border : '#ef4444', alignItems: 'center' }}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
