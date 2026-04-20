import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Signup — creates Auth user + Firestore user document
export const signUp = async (name: string, email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Set display name in Auth
  await updateProfile(user, { displayName: name });

  // Create user document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name,
    email,
    role: 'user', // 'admin' for admin users
    createdAt: serverTimestamp(),
  });

  return user;
};

// Login
export const logIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Logout
export const logOut = async () => {
  await signOut(auth);
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string) => {
  const snap = await getDoc(doc(db, 'users', uid));
  if (snap.exists()) return snap.data();
  return null;
};

// Delete account - requires recent authentication
export const deleteAccount = async (password: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error('No user logged in');
  }

  // Re-authenticate user before deletion (Firebase security requirement)
  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);

  // Delete user document from Firestore
  await deleteDoc(doc(db, 'users', user.uid));

  // Delete user from Firebase Auth
  await deleteUser(user);
};
