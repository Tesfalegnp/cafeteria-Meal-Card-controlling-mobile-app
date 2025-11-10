// terms.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Terms() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms of Service</Text>
      <Text style={styles.lastUpdated}>Last updated: January 15, 2024</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.content}>
          By accessing and using this application, you accept and agree to be bound by the terms 
          and provision of this agreement.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Use License</Text>
        <Text style={styles.content}>
          Permission is granted to temporarily use this application for personal, 
          non-commercial transitory viewing only. This is the grant of a license, 
          not a transfer of title.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. User Account</Text>
        <Text style={styles.content}>
          You are responsible for maintaining the confidentiality of your account and password 
          and for restricting access to your device. You agree to accept responsibility for all 
          activities that occur under your account.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Prohibited Uses</Text>
        <Text style={styles.content}>
          You may not use this application in any manner that could damage, disable, overburden, 
          or impair the app or interfere with any other party's use of the application.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f8fb' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  lastUpdated: { fontSize: 14, color: '#666', marginBottom: 30, textAlign: 'center' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#333' },
  content: { fontSize: 14, color: '#666', lineHeight: 20 },
});