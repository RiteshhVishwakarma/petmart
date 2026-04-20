import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';

const wishlistRef = (uid: string) => doc(db, 'wishlists', uid);

// Load wishlist from Firestore
export const loadWishlist = async (uid: string): Promise<Product[]> => {
  const snap = await getDoc(wishlistRef(uid));
  if (!snap.exists()) return [];
  return snap.data().items ?? [];
};

// Save entire wishlist to Firestore
export const saveWishlist = async (uid: string, items: Product[]): Promise<void> => {
  await setDoc(wishlistRef(uid), {
    items,
    updatedAt: serverTimestamp(),
  });
};
