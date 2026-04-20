import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CartItem } from '../context/CartContext';

const cartRef = (uid: string) => doc(db, 'carts', uid);

// Load cart from Firestore
export const loadCart = async (uid: string): Promise<CartItem[]> => {
  const snap = await getDoc(cartRef(uid));
  if (!snap.exists()) return [];
  return snap.data().items ?? [];
};

// Save entire cart to Firestore
export const saveCart = async (uid: string, items: CartItem[]): Promise<void> => {
  await setDoc(cartRef(uid), {
    items,
    updatedAt: serverTimestamp(),
  });
};
