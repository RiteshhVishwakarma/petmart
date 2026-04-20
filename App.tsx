import React from 'react';
import { TouchableOpacity, View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from './types';
import HomeScreen from './screens/HomeScreen';
import ProductList from './screens/ProductList';
import ProductDetail from './screens/ProductDetail';
import CartScreen from './screens/CartScreen';
import WishlistScreen from './screens/WishlistScreen';
import ProfileScreen from './screens/ProfileScreen';
import AddressScreen from './screens/AddressScreen';
import OrderSuccessScreen from './screens/OrderSuccessScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import AdminScreen from './screens/AdminScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import TermsScreen from './screens/TermsScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import AboutDeveloperScreen from './screens/AboutDeveloperScreen';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<any>();

// ─── Header left logo ─────────────────────────────────────────────────────────
function HeaderLogo() {
  return (
    <Image 
      source={require('./assets/logo.png')} 
      style={{ width: 65, height: 35, marginLeft: -8 }}
      resizeMode="contain"
    />
  );
}

// ─── Header right toggle ──────────────────────────────────────────────────────
function HeaderRight() {
  const { toggleTheme, colors } = useTheme();
  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.iconBtn}>
      <Ionicons name="moon-outline" size={22} color={colors.headerText} />
    </TouchableOpacity>
  );
}

// ─── Tab wrappers (strip typed route props for tab usage) ─────────────────────
const ProductListTab = () => <ProductList />;
const CartTab = () => <CartScreen />;
const WishlistTab = () => <WishlistScreen />;

// ─── Bottom Tabs ──────────────────────────────────────────────────────────────
function TabNavigator() {
  const { colors } = useTheme();
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.headerText,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 60, paddingBottom: 8 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerLeft: () => <HeaderLogo />,
        headerRight: () => <HeaderRight />,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'PetMart', tabBarLabel: 'Home', tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} /> }} />
      <Tab.Screen name="ProductListTab" component={ProductListTab} options={{ title: 'Products', tabBarLabel: 'Products', tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'grid' : 'grid-outline'} size={size} color={color} /> }} />
      <Tab.Screen
        name="WishlistTab"
        component={WishlistTab}
        options={{
          title: 'Wishlist', tabBarLabel: 'Wishlist',
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <Ionicons name={focused ? 'heart' : 'heart-outline'} size={size} color={color} />
              {totalWishlist > 0 && <View style={[styles.tabBadge, { backgroundColor: '#ff6161' }]} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartTab}
        options={{
          title: 'My Cart', tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <Ionicons name={focused ? 'cart' : 'cart-outline'} size={size} color={color} />
              {totalItems > 0 && <View style={[styles.tabBadge, { backgroundColor: '#ff6161' }]} />}
            </View>
          ),
        }}
      />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile', tabBarLabel: 'Profile', tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}

// ─── Main App (guest mode enabled) ───────────────────────────────────────────
function AppNavigator() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.headerText,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="ProductList" component={ProductList} options={{ title: 'Products' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ title: 'Product Details' }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'My Cart' }} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ title: 'My Wishlist' }} />
      <Stack.Screen name="Address" component={AddressScreen} options={{ title: 'Delivery Address' }} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin Panel' }} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: 'My Orders' }} />
      <Stack.Screen name="Terms" component={TermsScreen} options={{ title: 'Terms & Conditions' }} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacy Policy' }} />
      <Stack.Screen name="AboutDeveloper" component={AboutDeveloperScreen} options={{ title: 'About Developer' }} />
      
      {/* Auth screens as modal */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ 
          headerShown: false,
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen} 
        options={{ 
          headerShown: false,
          presentation: 'modal'
        }} 
      />
    </Stack.Navigator>
  );
}

// ─── Root — Always show app, login is optional ────────────────────────────────
function RootNavigator() {
  const { loading } = useAuth();
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Always show app - guest mode enabled
  return <AppNavigator />;
}

// ─── App Entry ────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <NavigationContainer>
              <StatusBar style="light" />
              <RootNavigator />
            </NavigationContainer>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  iconBtn: { padding: 4, marginRight: 8 },
  tabBadge: { position: 'absolute', top: -2, right: -4, width: 8, height: 8, borderRadius: 4 },
});
