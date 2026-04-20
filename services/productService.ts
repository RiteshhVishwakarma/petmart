import {
  collection, getDocs, doc, getDoc,
  query, where, addDoc, updateDoc,
  deleteDoc, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product, Category } from '../types';
import { products as staticProducts, categories as staticCategories } from '../data/products';

const PRODUCTS_COL = 'products';

// ─── Fetch all products from Firestore ───────────────────────────────────────
export const getProducts = async (): Promise<Product[]> => {
  const snap = await getDocs(collection(db, PRODUCTS_COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
};

// ─── Fetch by category ───────────────────────────────────────────────────────
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  if (category === 'all') return getProducts();
  const q = query(collection(db, PRODUCTS_COL), where('category', '==', category));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
};

// ─── Fetch single product ────────────────────────────────────────────────────
export const getProductById = async (id: string): Promise<Product | undefined> => {
  const snap = await getDoc(doc(db, PRODUCTS_COL, id));
  if (!snap.exists()) return undefined;
  return { id: snap.id, ...snap.data() } as Product;
};

// ─── Similar products (same category) ───────────────────────────────────────
export const getSimilarProducts = async (product: Product): Promise<Product[]> => {
  const q = query(collection(db, PRODUCTS_COL), where('category', '==', product.category));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Product))
    .filter((p) => p.id !== product.id);
};

// ─── Search (client-side filter) ─────────────────────────────────────────────
export const searchProducts = (searchQuery: string, allProducts: Product[]): Product[] => {
  const q = searchQuery.toLowerCase().trim();
  if (!q) return [];
  return allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
};

// ─── Categories (still static — no need for Firestore) ───────────────────────
export const getCategories = (): Category[] => staticCategories;

// ─── Admin: Add product ───────────────────────────────────────────────────────
export const addProduct = async (product: Omit<Product, 'id'>) => {
  return addDoc(collection(db, PRODUCTS_COL), {
    ...product,
    createdAt: serverTimestamp(),
  });
};

// ─── Admin: Update product ────────────────────────────────────────────────────
export const updateProduct = async (id: string, data: Partial<Product>) => {
  return updateDoc(doc(db, PRODUCTS_COL, id), data);
};

// ─── Admin: Delete product ────────────────────────────────────────────────────
export const deleteProduct = async (id: string) => {
  return deleteDoc(doc(db, PRODUCTS_COL, id));
};

// ─── One-time seed: push static products to Firestore ────────────────────────
export const seedProductsToFirestore = async (): Promise<void> => {
  const batch = writeBatch(db);
  staticProducts.forEach((product) => {
    const ref = doc(collection(db, PRODUCTS_COL));
    const { id, ...data } = product as any;
    batch.set(ref, { ...data, createdAt: serverTimestamp() });
  });
  await batch.commit();
};
