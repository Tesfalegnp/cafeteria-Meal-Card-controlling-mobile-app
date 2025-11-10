// app/(tabs)/settings.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabaseClient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SettingsTabGate() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    (async () => {
      const sid = await AsyncStorage.getItem('studentId');
      if (!sid) {
        setShowLogin(true);
        setLoading(false);
      } else {
        // already logged in -> go to settings dashboard
        router.replace('/settings');
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2f95dc" />;
  if (showLogin) return <LoginScreen />;

  return null;
}

/* ------------ LoginScreen (embedded) ------------ */
function LoginScreen() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!id.trim()) return Alert.alert('Enter your student ID');
    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('student_id', id.trim())
        .single();

      if (error || !data) {
        Alert.alert('User not found');
        setSubmitting(false);
        return;
      }

      // If password is null => first-time set a password
      if (!data.password) {
        if (!password) {
          Alert.alert('Set a new password in the password field');
          setSubmitting(false);
          return;
        }
        // NOTE: This stores password in cleartext. For production, hash on server.
        const { error: updErr } = await supabase
          .from('students')
          .update({ password })
          .eq('student_id', id.trim());
        if (updErr) throw updErr;

        await AsyncStorage.setItem('studentId', id.trim());
        router.replace('/settings');
        return;
      }

      // Normal login
      if (data.password === password) {
        await AsyncStorage.setItem('studentId', id.trim());
        router.replace('/settings');
      } else {
        Alert.alert('Invalid password');
      }
    } catch (err: any) {
      console.warn('Login error', err);
      Alert.alert('Login error', err?.message ?? String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Settings</Text>
      <View style={{ width: '85%' }}>
        <Text style={{ marginTop: 8 }}>Student ID</Text>
        <TextInput
          style={styles.input}
          value={id}
          onChangeText={setId}
          placeholder="e.g. MTU12345"
          autoCapitalize="none"
        />
        <Text>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password (or set new)"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={submitting}>
          <Text style={styles.buttonText}>{submitting ? 'Working...' : 'Login'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 12, alignSelf: 'center' }}
          onPress={() => Alert.alert('Help', 'If you don\\"')}
        >
          <Text style={{ color: '#2f95dc' }}>Need help?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ------------ Styles (shared) ------------ */
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 40, backgroundColor: '#f7f8fb' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2f95dc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
