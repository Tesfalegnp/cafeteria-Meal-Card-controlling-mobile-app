import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';

export default function About() {
  const appInfo = {
    version: '1.0.0',
    build: '1',
    lastUpdated: '2024-01-15',
    developer: 'University Tech Team',
    contact: 'tech@university.edu',
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About App</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.appName}>University App</Text>
        <Text style={styles.version}>Version {appInfo.version} (Build {appInfo.build})</Text>
        <Text style={styles.lastUpdated}>Last updated: {appInfo.lastUpdated}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>
          The University App is designed to provide students with easy access to academic resources, 
          campus information, and essential tools for their educational journey. Our mission is to 
          enhance the student experience through technology.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Developer Information</Text>
        <Text style={styles.infoItem}>
          <Text style={styles.infoLabel}>Developed by: </Text>
          {appInfo.developer}
        </Text>
        <Text style={styles.infoItem}>
          <Text style={styles.infoLabel}>Contact: </Text>
          <Text 
            style={styles.link} 
            onPress={() => Linking.openURL(`mailto:${appInfo.contact}`)}
          >
            {appInfo.contact}
          </Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <Text style={styles.featureItem}>• Academic calendar and schedules</Text>
        <Text style={styles.featureItem}>• Course materials and resources</Text>
        <Text style={styles.featureItem}>• Campus news and announcements</Text>
        <Text style={styles.featureItem}>• Student profile management</Text>
        <Text style={styles.featureItem}>• QR code functionality</Text>
        <Text style={styles.featureItem}>• Customizable settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <Text 
          style={styles.link} 
          onPress={() => Linking.openURL('https://university.edu/privacy')}
        >
          Privacy Policy
        </Text>
        <Text 
          style={[styles.link, { marginTop: 8 }]} 
          onPress={() => Linking.openURL('https://university.edu/terms')}
        >
          Terms of Service
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f8fb' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 30, textAlign: 'center' },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  appName: { fontSize: 20, fontWeight: '700', marginBottom: 8, color: '#333' },
  version: { fontSize: 16, color: '#666', marginBottom: 4 },
  lastUpdated: { fontSize: 14, color: '#999' },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#333' },
  description: { fontSize: 14, color: '#666', lineHeight: 20 },
  infoItem: { fontSize: 14, color: '#666', marginBottom: 8 },
  infoLabel: { fontWeight: '600', color: '#333' },
  link: { color: '#2f95dc', textDecorationLine: 'underline' },
  featureItem: { fontSize: 14, color: '#666', marginBottom: 6, lineHeight: 20 },
});