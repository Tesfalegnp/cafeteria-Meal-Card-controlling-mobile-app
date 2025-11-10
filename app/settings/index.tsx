// app/settings/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { supabase } from '../../lib/supabaseClient';

export default function SettingsDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const sid = await AsyncStorage.getItem('studentId');
      if (!sid) {
        router.replace('/(tabs)/settings');
        return;
      }
      try {
        const { data, error } = await supabase.from('students').select('*').eq('student_id', sid).single();
        if (error) {
          console.warn(error);
          setStudent(null);
        } else {
          setStudent(data);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('studentId');
    router.replace('/(tabs)/settings');
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2f95dc" />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Hello, {student?.first_name ?? 'Student'}</Text>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/profile')}>
          <Icon name="person-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Profile</Text>
          <Icon name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/change-password')}>
          <Icon name="lock-closed-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Change Password</Text>
          <Icon name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>
      </View>

      {/* App Customization Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Customization</Text>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/customize')}>
          <Icon name="color-palette-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Theme & Appearance</Text>
          <Icon name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/language')}>
          <Icon name="language-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Language</Text>
          <Icon name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/notifications')}>
          <Icon name="notifications-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Notifications</Text>
          <Icon name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/complaint')}>
          <Icon name="chatbubble-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Complaint & Feedback</Text>
          <Icon name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/help')}>
          <Icon name="help-circle-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Help & Support</Text>
          <Icon name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/faq')}>
          <Icon name="list-circle-outline" size={20} color="#333" />
          <Text style={styles.itemText}>FAQ</Text>
          <Icon name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/about')}>
          <Icon name="information-circle-outline" size={20} color="#333" />
          <Text style={styles.itemText}>About App</Text>
          <Icon name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/privacy')}>
          <Icon name="shield-checkmark-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Privacy Policy</Text>
          <Icon name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/terms')}>
          <Icon name="document-text-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Terms of Service</Text>
          <Icon name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color="#ff3b30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 28, paddingHorizontal: 18, backgroundColor: '#f7f8fb' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#666', marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#333', marginLeft: 4 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: { fontSize: 16, marginLeft: 12, flex: 1, color: '#333' },
  arrow: { marginLeft: 'auto' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 32,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ff3b30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#ff3b30', marginLeft: 8 },
});