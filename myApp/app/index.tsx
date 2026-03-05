import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL, setGlobalUser } from '../constants/Config';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Added for visual effect
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return alert("Please fill in all fields"); // Looks real!
    
    setLoading(true);
    try {
      // Still using your simple endpoint to ensure it works
      const res = await axios.post(`${API_BASE_URL}/login-simple`, { 
        email: email.toLowerCase(), 
        name: "Shubham Mohite" 
      });
      
      if (res.data.success) {
        setGlobalUser(res.data.user._id, res.data.user.name);
        router.replace('/(tabs)'); 
      }
    } catch (err) {
      alert("Network Error. Check your IP/Server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LedgerLens</Text>
      
      <View style={styles.inputGroup}>
        <TextInput 
          style={styles.input} 
          placeholder="Email Address" 
          value={email} 
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          value={password} 
          onChangeText={setPassword}
          secureTextEntry // Hides the password dots
        />
        
        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Login</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#fff' },
  logo: { fontSize: 36, fontWeight: '900', textAlign: 'center', marginBottom: 50, color: '#111' },
  inputGroup: { gap: 15 },
  input: { backgroundColor: '#F8F9FA', padding: 18, borderRadius: 12, borderWidth: 1, borderColor: '#EEE' },
  btn: { backgroundColor: '#16C784', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});