import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabaseClient';

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    loadStudent();
  }, []);

  const loadStudent = async () => {
    const studentId = await AsyncStorage.getItem('studentId');
    if (!studentId) {
      router.replace('/settings/login');
      return;
    }

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error || !data) {
      router.replace('/settings/login');
    } else {
      setStudent(data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('studentId');
    router.replace('/settings/login');
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2f95dc" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Name: {student.first_name} {student.middle_name} {student.last_name}</Text>
      <Text style={styles.label}>Email: {student.email}</Text>
      <Text style={styles.label}>Department: {student.department}</Text>
      <Text style={styles.label}>Year: {student.year?.slice(0,4)}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  button: { marginTop: 30, backgroundColor: '#2f95dc', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
