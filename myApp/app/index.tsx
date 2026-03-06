import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Dummy bypass: If fields aren't empty, go to the app
    if (email && password) {
      router.replace('/(tabs)'); 
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.inner}>
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="receipt" size={50} color="#fff" />
          </View>
          <Text style={styles.brandName}>LedgerLens</Text>
          <Text style={styles.tagline}>Smart OCR Expense Manager</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email ID"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Login</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  iconCircle: { width: 90, height: 90, borderRadius: 25, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', elevation: 10 },
  brandName: { fontSize: 32, fontWeight: '900', color: '#111', marginTop: 15 },
  tagline: { fontSize: 14, color: '#666', fontWeight: '500' },
  inputContainer: { width: '100%' },
  input: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    fontSize: 16,
    color: '#333'
  },
  loginBtn: {
    backgroundColor: '#16C784',
    padding: 20,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
    elevation: 5
  },
  loginBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  footer: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
  footerText: { color: '#AAA', fontWeight: '700', fontSize: 13 },
  footerSubText: { color: '#CCC', fontSize: 11, marginTop: 4 }
});