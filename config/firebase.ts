import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCmvlRf0gqbGyB201a44sYWcXu48DJIkT0',
  authDomain: 'petmart-6340a.firebaseapp.com',
  projectId: 'petmart-6340a',
  storageBucket: 'petmart-6340a.firebasestorage.app',
  messagingSenderId: '963530337544',
  appId: '1:963530337544:web:14fe4e9ff18782c93e50bd',
};

const app = initializeApp(firebaseConfig);

// Auth with AsyncStorage — login survives app restart
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore
export const db = getFirestore(app);

export default app;
