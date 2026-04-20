import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { logIn } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const returnTo = route.params?.returnTo;

  // Redirect after successful login
  useEffect(() => {
    if (user && returnTo) {
      // User logged in and we have a return path
      navigation.replace(returnTo as any);
    } else if (user) {
      // User logged in but no return path - go to home
      navigation.goBack();
    }
  }, [user, returnTo]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await logIn(email.trim(), password);
      // Redirect handled by useEffect above
    } catch (e: any) {
      const msg =
        e.code === 'auth/user-not-found' ? 'No account found with this email.' :
        e.code === 'auth/wrong-password' ? 'Incorrect password.' :
        e.code === 'auth/invalid-email' ? 'Invalid email address.' :
        e.code === 'auth/invalid-credential' ? 'Invalid email or password.' :
        'Login failed. Please try again.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ backgroundColor: colors.primary, paddingTop: 80, paddingBottom: 40, alignItems: 'center' }}>
          <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Ionicons name="paw" size={36} color="#fff" />
          </View>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800' }}>PetMart</Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 }}>Sign in to your account</Text>
        </View>

        {/* Form */}
        <View style={{ padding: 24 }}>
          {/* Email */}
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.subtext, marginBottom: 6 }}>EMAIL</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, marginBottom: 16 }}>
            <Ionicons name="mail-outline" size={18} color={colors.subtext} style={{ marginRight: 10 }} />
            <TextInput
              style={{ flex: 1, paddingVertical: 13, fontSize: 14, color: colors.text }}
              placeholder="Enter your email"
              placeholderTextColor={colors.subtext}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.subtext, marginBottom: 6 }}>PASSWORD</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, marginBottom: 28 }}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.subtext} style={{ marginRight: 10 }} />
            <TextInput
              style={{ flex: 1, paddingVertical: 13, fontSize: 14, color: colors.text }}
              placeholder="Enter your password"
              placeholderTextColor={colors.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.subtext} />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={{ backgroundColor: loading ? colors.border : colors.primary, paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 16 }}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Signup Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
            <Text style={{ fontSize: 14, color: colors.subtext }}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '700' }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
