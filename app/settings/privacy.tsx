// privacy.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Privacy() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.lastUpdated}>Last updated: January 15, 2024</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.content}>
          We collect information you provide directly to us, including your name, email address, 
          student ID, and academic information necessary for providing our services.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.content}>
          We use the information we collect to:{'\n'}
          • Provide and maintain our services{'\n'}
          • Personalize your experience{'\n'}
          • Communicate with you about updates{'\n'}
          • Ensure security and prevent fraud
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Data Security</Text>
        <Text style={styles.content}>
          We implement appropriate security measures to protect your personal information 
          against unauthorized access, alteration, disclosure, or destruction.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Your Rights</Text>
        <Text style={styles.content}>
          You have the right to access, correct, or delete your personal information. 
          You can manage your privacy settings within the app or contact us directly.
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