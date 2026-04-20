import { db } from '../config/firebase';
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { UserAddress } from '../types';

export const getUserAddresses = async (uid: string): Promise<UserAddress[]> => {
  const ref = collection(db, 'users', uid, 'addresses');
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as UserAddress));
};

export const addAddress = async (uid: string, address: Omit<UserAddress, 'id'>) => {
  const ref = collection(db, 'users', uid, 'addresses');
  const docRef = await addDoc(ref, address);
  return docRef.id;
};

export const updateAddress = async (uid: string, id: string, address: Omit<UserAddress, 'id'>) => {
  const docRef = doc(db, 'users', uid, 'addresses', id);
  await updateDoc(docRef, address);
};

export const deleteAddress = async (uid: string, id: string) => {
  const docRef = doc(db, 'users', uid, 'addresses', id);
  await deleteDoc(docRef);
};
