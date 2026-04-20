import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { signUp } from '../services/authService';
import { useTheme } from '../context/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function SignupScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password);
      // Navigation handled automatically by AuthContext
    } catch (e: any) {
      const msg =
        e.code === 'auth/email-already-in-use' ? 'This email is already registered.' :
        e.code === 'auth/invalid-email' ? 'Invalid email address.' :
        e.code === 'auth/weak-password' ? 'Password is too weak.' :
        'Signup failed. Please try again.';
      Alert.alert('Signup Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const inputRow = (
    icon: string, placeholder: string,
    value: string, onChange: (v: string) => void,
    options: any = {}
  ) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, marginBottom: 16 }}>
      <Ionicons name={icon as any} size={18} color={colors.subtext} style={{ marginRight: 10 }} />
      <TextInput
        style={{ flex: 1, paddingVertical: 13, fontSize: 14, color: colors.text }}
        placeholder={placeholder}
        placeholderTextColor={colors.subtext}
        value={value}
        onChangeText={onChange}
        {...options}
      />
    </View>
  );

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
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 }}>Create your account</Text>
        </View>

        {/* Form */}
        <View style={{ padding: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.subtext, marginBottom: 6 }}>FULL NAME</Text>
          {inputRow('person-outline', 'Enter your name', name, setName, { autoCapitalize: 'words' })}

          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.subtext, marginBottom: 6 }}>EMAIL</Text>
          {inputRow('mail-outline', 'Enter your email', email, setEmail, { keyboardType: 'email-address', autoCapitalize: 'none' })}

          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.subtext, marginBottom: 6 }}>PASSWORD</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, marginBottom: 16 }}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.subtext} style={{ marginRight: 10 }} />
            <TextInput
              style={{ flex: 1, paddingVertical: 13, fontSize: 14, color: colors.text }}
              placeholder="Min. 6 characters"
              placeholderTextColor={colors.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.subtext} />
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.subtext, marginBottom: 6 }}>CONFIRM PASSWORD</Text>
          {inputRow('lock-closed-outline', 'Re-enter password', confirmPassword, setConfirmPassword, { secureTextEntry: true })}

          {/* Signup Button */}
          <TouchableOpacity
            style={{ backgroundColor: loading ? colors.border : colors.primary, paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 16, marginTop: 8 }}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
            <Text style={{ fontSize: 14, color: colors.subtext }}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '700' }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
