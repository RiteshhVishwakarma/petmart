import React, {
  createContext, useContext, useState,
  useMemo, useEffect, useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { loadWishlist, saveWishlist } from '../services/wishlistService';
import { Product } from '../types';

type WishlistContextType = {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  totalWishlist: number;
  wishlistLoading: boolean;
};

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  toggleWishlist: () => {},
  isWishlisted: () => false,
  totalWishlist: 0,
  wishlistLoading: false,
});

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load wishlist from Firestore when user logs in
  useEffect(() => {
    if (user) {
      setWishlistLoading(true);
      loadWishlist(user.uid)
        .then((items) => {
          setWishlist(items);
          setInitialized(true);
        })
        .finally(() => setWishlistLoading(false));
    } else {
      setWishlist([]);
      setInitialized(false);
    }
  }, [user]);

  // Save to Firestore whenever wishlist changes (after initial load)
  useEffect(() => {
    if (user && initialized) {
      saveWishlist(user.uid, wishlist);
    }
  }, [wishlist, user, initialized]);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  }, []);

  const isWishlisted = useCallback(
    (id: string) => wishlist.some((p) => p.id === id),
    [wishlist]
  );

  const totalWishlist = useMemo(() => wishlist.length, [wishlist]);

  return (
    <WishlistContext.Provider value={{
      wishlist, toggleWishlist, isWishlisted,
      totalWishlist, wishlistLoading,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
