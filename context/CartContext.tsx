import React, {
  createContext, useContext, useState,
  useMemo, useEffect, useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { loadCart, saveCart } from '../services/cartService';
import { Product } from '../types';

export type CartItem = Product & { quantity: number };

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  cartLoading: boolean;
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  increaseQty: () => {},
  decreaseQty: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
  cartLoading: false,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load cart from Firestore when user logs in
  useEffect(() => {
    if (user) {
      setCartLoading(true);
      loadCart(user.uid)
        .then((items) => {
          setCartItems(items);
          setInitialized(true);
        })
        .finally(() => setCartLoading(false));
    } else {
      // User logged out — clear local cart
      setCartItems([]);
      setInitialized(false);
    }
  }, [user]);

  // Save to Firestore whenever cart changes (after initial load)
  useEffect(() => {
    if (user && initialized) {
      saveCart(user.uid, cartItems);
    }
  }, [cartItems, user, initialized]);

  const addToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing)
        return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id)), []);

  const increaseQty = useCallback((id: string) =>
    setCartItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)
    ), []);

  const decreaseQty = useCallback((id: string) =>
    setCartItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
          .filter((i) => i.quantity > 0)
    ), []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const totalItems = useMemo(() =>
    cartItems.reduce((sum, i) => sum + i.quantity, 0), [cartItems]);

  const totalPrice = useMemo(() =>
    cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0), [cartItems]);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart,
      increaseQty, decreaseQty, clearCart,
      totalItems, totalPrice, cartLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
