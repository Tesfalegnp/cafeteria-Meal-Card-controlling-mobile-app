import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: false,
    announcements: true,
    reminders: true,
    updates: false,
  });

  const toggleSwitch = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Channels</Text>
        
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingDescription}>Receive push notifications on your device</Text>
          </View>
          <Switch
            value={notifications.push}
            onValueChange={() => toggleSwitch('push')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notifications.push ? '#2f95dc' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>Email Notifications</Text>
            <Text style={styles.settingDescription}>Receive notifications via email</Text>
          </View>
          <Switch
            value={notifications.email}
            onValueChange={() => toggleSwitch('email')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notifications.email ? '#2f95dc' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>SMS Notifications</Text>
            <Text style={styles.settingDescription}>Receive notifications via SMS</Text>
          </View>
          <Switch
            value={notifications.sms}
            onValueChange={() => toggleSwitch('sms')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notifications.sms ? '#2f95dc' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Types</Text>
        
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>Announcements</Text>
            <Text style={styles.settingDescription}>Important announcements from the institution</Text>
          </View>
          <Switch
            value={notifications.announcements}
            onValueChange={() => toggleSwitch('announcements')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notifications.announcements ? '#2f95dc' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>Reminders</Text>
            <Text style={styles.settingDescription}>Class reminders and deadlines</Text>
          </View>
          <Switch
            value={notifications.reminders}
            onValueChange={() => toggleSwitch('reminders')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notifications.reminders ? '#2f95dc' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>Updates</Text>
            <Text style={styles.settingDescription}>App updates and new features</Text>
          </View>
          <Switch
            value={notifications.updates}
            onValueChange={() => toggleSwitch('updates')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notifications.updates ? '#2f95dc' : '#f4f3f4'}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f8fb' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 30, textAlign: 'center' },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#333' },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#333' },
  settingDescription: { fontSize: 14, color: '#666' },
});