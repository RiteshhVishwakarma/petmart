import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile } from '../services/authService';

type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state — fires on login, logout, and app restart
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const data = await getUserProfile(firebaseUser.uid);
        setProfile(data as UserProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe; // cleanup on unmount
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAdmin: profile?.role === 'admin',
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
