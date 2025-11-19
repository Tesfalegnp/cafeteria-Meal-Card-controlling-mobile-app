import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function About() {
  const appInfo = {
    version: '1.0.0',
    build: '1',
    lastUpdated: '2024-01-15',
    contact: 'tech@mizanteppi.edu.et',
  };

  const developers = [
    {
      name: 'Tesfalegn Petros',
      role: 'Full-Stack Developer& AI Engineer',
      photo: require('../../assets/images/tesfalegn.jpg'),
      phone: '+251916225842',
      email: 'peterhope@gmail.com',
      description: 'Software Engineering Student at Mizan Tepi University, 2014 Batch. Passionate about creating innovative solutions for campus challenges.',
      contributions: ['Backend Development', 'Database Design', 'System Architecture', 'API Integration', 'RFID Integration',]
    },
    {
      name: 'Birhanu Kassa',
      role: 'Full-Stack Developer',
      photo: require('../../assets/images/bre_kassa.jpg'),
      phone: '+251984030503',
      email: 'birekassa@gmail.com',
      description: 'Software Engineering Student at Mizan Tepi University, 2014 Batch. Dedicated to enhancing student experience through technology.',
      contributions: ['Frontend Development', 'Mobile App Development', 'UI/UX Design', 'Project Management', 'Ardinuo Coding']
    }
  ];

  const openPhone = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const openEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>About Digital Cafeteria</Text>
        <Text style={styles.subtitle}>Mizan Tepi University - Tepi Campus</Text>
      </View>

      {/* App Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.appIcon}>
          <Ionicons name="cafe" size={40} color="#FF6B35" />
        </View>
        <Text style={styles.appName}>Digital Cafeteria System</Text>
        <Text style={styles.version}>Version {appInfo.version} (Build {appInfo.build})</Text>
        <Text style={styles.lastUpdated}>Last updated: {appInfo.lastUpdated}</Text>
      </View>

      {/* Mission Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.description}>
          We are Software Engineering students at Mizan Tepi University, 2014 Batch. 
          We developed this application specifically for Tepi Campus students to provide 
          easy access to cafeteria services and enhance the overall campus experience.
        </Text>
        <Text style={styles.description}>
          Our goal is to solve real-world problems through technology and demonstrate 
          how software engineering can improve daily campus life. We encourage all 
          software engineering and related field students to identify and solve problems 
          they encounter in their environment.
        </Text>
      </View>

      {/* Developers Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meet the Developers</Text>
        <Text style={styles.sectionSubtitle}>
          Both developers contributed equally to frontend and backend development
        </Text>
        
        {developers.map((developer, index) => (
          <View key={index} style={styles.developerCard}>
            <View style={styles.developerHeader}>
              <Image 
                source={developer.photo} 
                style={styles.developerPhoto}
                defaultSource={require('../../assets/images/tesfalegn.jpg')}
              />
              <View style={styles.developerInfo}>
                <Text style={styles.developerName}>{developer.name}</Text>
                <Text style={styles.developerRole}>{developer.role}</Text>
                <Text style={styles.developerBatch}>MTU Software Engineering, 2014 Batch</Text>
              </View>
            </View>
            
            <Text style={styles.developerDescription}>{developer.description}</Text>
            
            <View style={styles.contacts}>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => openPhone(developer.phone)}
              >
                <Ionicons name="call" size={16} color="#fff" />
                <Text style={styles.contactButtonText}>{developer.phone}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.contactButton, styles.emailButton]}
                onPress={() => openEmail(developer.email)}
              >
                <Ionicons name="mail" size={16} color="#fff" />
                <Text style={styles.contactButtonText}>{developer.email}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contributions}>
              <Text style={styles.contributionsTitle}>Key Contributions:</Text>
              {developer.contributions.map((contribution, idx) => (
                <View key={idx} style={styles.contributionItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.contributionText}>{contribution}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Features</Text>
        <View style={styles.featuresGrid}>
          <View style={styles.featureItem}>
            <Ionicons name="qr-code" size={24} color="#FF6B35" />
            <Text style={styles.featureText}>QR Code Meal Access</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="restaurant" size={24} color="#FF6B35" />
            <Text style={styles.featureText}>Weekly Menu Planning</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="time" size={24} color="#FF6B35" />
            <Text style={styles.featureText}>Meal History Tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="card" size={24} color="#FF6B35" />
            <Text style={styles.featureText}>Digital Meal Cards</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="notifications" size={24} color="#FF6B35" />
            <Text style={styles.featureText}>Real-time Notifications</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="stats-chart" size={24} color="#FF6B35" />
            <Text style={styles.featureText}>Consumption Analytics</Text>
          </View>
        </View>
      </View>

      {/* Call to Action */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Join the Innovation</Text>
        <Text style={styles.ctaText}>
          Are you a software engineering student? We encourage you to identify problems 
          around campus and develop solutions. Together, we can make MTU a better place 
          through technology!
        </Text>
        <TouchableOpacity 
          style={styles.contactUsButton}
          onPress={() => openEmail(appInfo.contact)}
        >
          <Ionicons name="chatbubbles" size={20} color="#fff" />
          <Text style={styles.contactUsText}>Get in Touch for Collaboration</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 Mizan Tepi University - Tepi Campus
        </Text>
        <Text style={styles.footerSubtext}>
          Developed with ❤️ by Software Engineering Students
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff5f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  appName: { 
    fontSize: 22, 
    fontWeight: '700', 
    marginBottom: 8, 
    color: '#2c3e50',
    textAlign: 'center',
  },
  version: { 
    fontSize: 16, 
    color: '#666', 
    marginBottom: 4,
    fontWeight: '500',
  },
  lastUpdated: { 
    fontSize: 14, 
    color: '#999',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginBottom: 12, 
    color: '#2c3e50',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  description: { 
    fontSize: 15, 
    color: '#666', 
    lineHeight: 22,
    marginBottom: 12,
  },
  developerCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  developerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  developerPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 3,
    borderColor: '#FF6B35',
  },
  developerInfo: {
    flex: 1,
  },
  developerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  developerRole: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 2,
  },
  developerBatch: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  developerDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  contacts: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  emailButton: {
    backgroundColor: '#2196F3',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  contributions: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  contributionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  contributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contributionText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
  },
  featureText: {
    fontSize: 13,
    color: '#2c3e50',
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  ctaSection: {
    backgroundColor: '#2c3e50',
    padding: 25,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  contactUsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactUsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#95a5a6',
    marginBottom: 8,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#bdc3c7',
    textAlign: 'center',
  },
});