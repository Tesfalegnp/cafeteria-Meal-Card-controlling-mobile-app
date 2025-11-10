import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Help() {
  const router = useRouter();

  const contactMethods = [
    {
      icon: 'call-outline',
      title: 'Call Support',
      description: 'Speak directly with our support team',
      action: () => Linking.openURL('tel:+1234567890'),
    },
    {
      icon: 'mail-outline',
      title: 'Email Support',
      description: 'Send us an email with your questions',
      action: () => Linking.openURL('mailto:support@university.edu'),
    },
    {
      icon: 'chatbubble-outline',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: () => router.push('/settings/live-chat'),
    },
    {
      icon: 'time-outline',
      title: 'Support Hours',
      description: 'Mon-Fri: 9AM-6PM\nSat: 10AM-2PM',
      action: null,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Get Help</Text>
        {contactMethods.map((method, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactItem}
            onPress={method.action}
            disabled={!method.action}
          >
            <Icon name={method.icon as any} size={24} color="#2f95dc" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>{method.title}</Text>
              <Text style={styles.contactDescription}>{method.description}</Text>
            </View>
            {method.action && <Icon name="chevron-forward" size={16} color="#999" />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Links</Text>
        <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/settings/faq')}>
          <Text style={styles.linkText}>Frequently Asked Questions</Text>
          <Icon name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/settings/complaint')}>
          <Text style={styles.linkText}>Submit Feedback</Text>
          <Icon name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f8fb' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 30, textAlign: 'center' },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#333' },
  contactItem: {
    flexDirection: 'row',
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
  contactInfo: { flex: 1, marginLeft: 12 },
  contactTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#333' },
  contactDescription: { fontSize: 14, color: '#666' },
  linkItem: {
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
  linkText: { fontSize: 16, color: '#333' },
});