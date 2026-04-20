import {
  collection, addDoc, getDocs,
  query, where, serverTimestamp, doc, updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order, OrderItem } from '../types';
import { CartItem } from '../context/CartContext';

const ORDERS_COL = 'orders';

// Place a new order
export const placeOrder = async (
  uid: string,
  items: CartItem[],
  totalPrice: number,
  address: Order['address']
): Promise<string> => {
  const orderItems: OrderItem[] = items.map((i) => ({
    id: i.id,
    name: i.name,
    price: i.price,
    image: i.image,
    quantity: i.quantity,
  }));

  const ref = await addDoc(collection(db, ORDERS_COL), {
    uid,
    items: orderItems,
    totalPrice,
    address,
    status: 'placed',
    createdAt: serverTimestamp(),
  });

  return ref.id;
};

// Get all orders for a user
export const getUserOrders = async (uid: string): Promise<Order[]> => {
  const q = query(
    collection(db, ORDERS_COL),
    where('uid', '==', uid)
  );
  const snap = await getDocs(q);
  const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
  // Sort by createdAt descending on client side
  return orders.sort((a, b) => {
    const aTime = a.createdAt?.seconds ?? 0;
    const bTime = b.createdAt?.seconds ?? 0;
    return bTime - aTime;
  });
};

// Admin: get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  const snap = await getDocs(collection(db, ORDERS_COL));
  const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
  return orders.sort((a, b) => {
    const aTime = a.createdAt?.seconds ?? 0;
    const bTime = b.createdAt?.seconds ?? 0;
    return bTime - aTime;
  });
};

// Admin: update order status
export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<void> => {
  await updateDoc(doc(db, ORDERS_COL, orderId), { status });
};
