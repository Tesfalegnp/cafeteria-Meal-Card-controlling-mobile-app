// app/(tabs)/settings.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabaseClient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SettingsTab() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const studentId = await AsyncStorage.getItem('studentId');
    if (!studentId) {
      setShowLogin(true);
      setLoading(false);
    } else {
      // fetch student data
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('student_id', studentId)
        .single();
      if (error || !data) {
        setShowLogin(true);
      } else {
        setStudent(data);
      }
      setLoading(false);
    }
  };

  const handleLogin = async (id: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', id)
      .eq('password', password)
      .single();

    if (data) {
      await AsyncStorage.setItem('studentId', id);
      setStudent(data);
      setShowLogin(false);
    } else {
      alert('Invalid ID or password');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('studentId');
    setStudent(null);
    setShowLogin(true);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2f95dc" />;

  if (showLogin) return <LoginScreen onLogin={handleLogin} />;

  return <SettingsDashboard student={student} onLogout={handleLogout} />;
}

// --- Login Screen ---
function LoginScreen({ onLogin }: { onLogin: (id: string, password: string) => void }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Settings</Text>
      <View style={{ width: '80%' }}>
        <Text>ID</Text>
        <TextInput
          style={styles.input}
          value={id}
          onChangeText={setId}
          placeholder="Enter student ID"
        />
        <Text>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={() => onLogin(id, password)}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Settings Dashboard ---
function SettingsDashboard({ student, onLogout }: { student: any; onLogout: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Hello, {student.first_name}</Text>

      <TouchableOpacity style={styles.item}>
        <Icon name="person-outline" size={24} />
        <Text style={styles.itemText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Icon name="color-palette-outline" size={24} />
        <Text style={styles.itemText}>Customize App</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Icon name="language-outline" size={24} />
        <Text style={styles.itemText}>Language</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={onLogout}>
        <Icon name="log-out-outline" size={24} />
        <Text style={styles.itemText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Styles ---
import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2f95dc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: { fontSize: 16, marginLeft: 12 },
});
