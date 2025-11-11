import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function SettingsDashboard() {
  const router = useRouter();
  const { student, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          {student?.photo_url ? (
            <Image source={{ uri: student.photo_url }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={40} color="#666" />
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>
            {student?.first_name} {student?.last_name}
          </Text>
          <Text style={styles.studentId}>{student?.student_id}</Text>
          <Text style={styles.department}>{student?.department}</Text>
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/profile')}>
          <Ionicons name="person-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Profile</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/change-password')}>
          <Ionicons name="lock-closed-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>
      </View>

      {/* App Customization Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Customization</Text>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/customize')}>
          <Ionicons name="color-palette-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Theme & Appearance</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/language')}>
          <Ionicons name="language-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Language</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/notifications')}>
          <Ionicons name="notifications-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/complaint')}>
          <Ionicons name="chatbubble-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Complaint & Feedback</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/help')}>
          <Ionicons name="help-circle-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/faq')}>
          <Ionicons name="list-circle-outline" size={20} color="#333" />
          <Text style={styles.itemText}>FAQ</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/about')}>
          <Ionicons name="information-circle-outline" size={20} color="#333" />
          <Text style={styles.itemText}>About App</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/privacy')}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/settings/terms')}>
          <Ionicons name="document-text-outline" size={20} color="#333" />
          <Text style={styles.itemText}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" style={styles.arrow} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  department: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  section: { 
    marginTop: 20,
    paddingHorizontal: 18,
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 12, 
    color: '#333', 
    marginLeft: 4 
  },
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
  itemText: { 
    fontSize: 16, 
    marginLeft: 12, 
    flex: 1, 
    color: '#333' 
  },
  arrow: { 
    marginLeft: 'auto' 
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    margin: 18,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#ff3b30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#ff3b30', 
    marginLeft: 8 
  },
});