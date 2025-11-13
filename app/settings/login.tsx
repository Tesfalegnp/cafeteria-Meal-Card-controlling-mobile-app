import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!id.trim()) {
      Alert.alert('Error', 'Please enter your student ID');
      return;
    }

    setSubmitting(true);
    const success = await login(id, password);
    
    if (!success) {
      Alert.alert('Login Failed', 'Invalid student ID or password');
    }
    
    setSubmitting(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40, marginBottom: 20 }}>
          {/* Replaced Ionicon with smaller logo image */}
        <Image
          source={require('../../assets/images/logo-placeholder.png')}
          style={{ width: 100, height: 100, borderRadius: 30, marginBottom: 8 }}
        />
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1e3c72' }}>MTU</Text>
        <Text style={{ fontSize: 15, color: '#555' }}>Digital Meal System</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Student ID</Text>
        <TextInput
          style={styles.input}
          value={id}
          onChangeText={setId}
          placeholder="Enter your student ID"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TouchableOpacity 
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View style={styles.helpSection}>
          <Text style={styles.helpText}>
            New user or having trouble signing in? Reach out to the administrator for assistance.          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e3c72',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1e3c72',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helpSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  helpText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
});