// Mobile_app/TCSS-3/app/settings/index.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { student, councilMember, logout } = useAuth();
  const router = useRouter();

  const handleCouncilFeature = () => {
    if (!councilMember) {
      Alert.alert(
        'Access Denied',
        'Sorry, you are not authorized for this service. This feature is only available for council members.'
      );
      return;
    }

    // Navigate based on council member type
    if (councilMember.working_type === 'president' || councilMember.working_type === 'vice_president') {
      router.push('/council/president-vice');
    } else if (councilMember.working_type === 'cafeteria') {
      router.push('/council/cafeteria-committee');
    } else {
      Alert.alert(
        'Access Limited',
        'Your council position does not have access to special features yet.'
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const menuItems = [
    {
      title: 'Profile',
      icon: '👤',
      route: '/settings/profile',
    },
    {
      title: 'Change Password',
      icon: '🔒',
      route: '/settings/change-password',
    },
    {
      title: 'Notifications',
      icon: '🔔',
      route: '/settings/notifications',
    },
    {
      title: 'Customize',
      icon: '🎨',
      route: '/settings/customize',
    },
    {
      title: 'Language',
      icon: '🌐',
      route: '/settings/language',
    },
    {
      title: 'More Feature',
      icon: '⭐',
      onPress: handleCouncilFeature,
      isSpecial: true,
    },
    {
      title: 'Help & Support',
      icon: '❓',
      route: '/settings/help',
    },
    {
      title: 'FAQ',
      icon: '📚',
      route: '/settings/faq',
    },
    {
      title: 'Complaint',
      icon: '📝',
      route: '/settings/complaint',
    },
    {
      title: 'About',
      icon: 'ℹ️',
      route: '/settings/about',
    },
    {
      title: 'Privacy Policy',
      icon: '🛡️',
      route: '/settings/privacy',
    },
    {
      title: 'Terms & Conditions',
      icon: '📄',
      route: '/settings/terms',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Welcome, {student?.first_name} {student?.last_name}
        </Text>
        {councilMember && (
          <View style={styles.councilBadge}>
            <Text style={styles.councilText}>
              {councilMember.position} • {councilMember.working_type}
            </Text>
          </View>
        )}
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              item.isSpecial && styles.specialMenuItem,
            ]}
            onPress={item.onPress || (() => item.route && router.push(item.route))}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[
                styles.menuText,
                item.isSpecial && styles.specialMenuText,
              ]}>
                {item.title}
              </Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#1e3c72',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  councilBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  councilText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  menuContainer: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  specialMenuItem: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  specialMenuText: {
    color: '#856404',
    fontWeight: '600',
  },
  menuArrow: {
    fontSize: 20,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});