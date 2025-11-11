import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

export default function RulesAndRegulationsScreen() {
  const router = useRouter();

  // Weekly menu data
  const weeklyMenu = {
    breakfast: {
      time: '7:00 AM - 9:30 AM',
      items: [
        'Injera with Firfir',
        'Bread with Egg',
        'Porridge',
        'Tea/Coffee',
        'Fruit Juice'
      ]
    },
    lunch: {
      time: '12:00 PM - 2:30 PM',
      items: [
        'Injera with Key Wot',
        'Injera with Alicha',
        'Rice with Chicken',
        'Vegetable Salad',
        'Fresh Fruit'
      ]
    },
    dinner: {
      time: '6:00 PM - 8:00 PM',
      items: [
        'Injera with Shiro',
        'Pasta with Meat Sauce',
        'Rice with Vegetables',
        'Bread with Soup',
        'Tea/Coffee'
      ]
    }
  };

  const openPhone = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const openEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rules & Regulations</Text>
        <Text style={styles.headerSubtitle}>MTU Cafeteria Guidelines</Text>
      </LinearGradient>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Operating Hours Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={24} color="#1e3c72" />
            <Text style={styles.sectionTitle}>Operating Hours</Text>
          </View>
          <View style={styles.hoursGrid}>
            <View style={styles.hourCard}>
              <Text style={styles.mealType}>Breakfast</Text>
              <Text style={styles.mealTime}>7:00 AM - 9:30 AM</Text>
            </View>
            <View style={styles.hourCard}>
              <Text style={styles.mealType}>Lunch</Text>
              <Text style={styles.mealTime}>12:00 PM - 2:30 PM</Text>
            </View>
            <View style={styles.hourCard}>
              <Text style={styles.mealType}>Dinner</Text>
              <Text style={styles.mealTime}>6:00 PM - 8:00 PM</Text>
            </View>
          </View>
        </View>

        {/* Weekly Menu Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="restaurant" size={24} color="#1e3c72" />
            <Text style={styles.sectionTitle}>Weekly Menu</Text>
          </View>
          
          {/* Breakfast Menu */}
          <View style={styles.menuCard}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Breakfast</Text>
              <Text style={styles.menuTime}>{weeklyMenu.breakfast.time}</Text>
            </View>
            <View style={styles.menuItems}>
              {weeklyMenu.breakfast.items.map((item, index) => (
                <View key={index} style={styles.menuItem}>
                  <Ionicons name="chevron-forward" size={16} color="#4ECDC4" />
                  <Text style={styles.menuItemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Lunch Menu */}
          <View style={styles.menuCard}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Lunch</Text>
              <Text style={styles.menuTime}>{weeklyMenu.lunch.time}</Text>
            </View>
            <View style={styles.menuItems}>
              {weeklyMenu.lunch.items.map((item, index) => (
                <View key={index} style={styles.menuItem}>
                  <Ionicons name="chevron-forward" size={16} color="#FF6B6B" />
                  <Text style={styles.menuItemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Dinner Menu */}
          <View style={styles.menuCard}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Dinner</Text>
              <Text style={styles.menuTime}>{weeklyMenu.dinner.time}</Text>
            </View>
            <View style={styles.menuItems}>
              {weeklyMenu.dinner.items.map((item, index) => (
                <View key={index} style={styles.menuItem}>
                  <Ionicons name="chevron-forward" size={16} color="#45B7D1" />
                  <Text style={styles.menuItemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Rules and Regulations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={24} color="#1e3c72" />
            <Text style={styles.sectionTitle}>Rules & Regulations</Text>
          </View>
          
          <View style={styles.rulesList}>
            <View style={styles.ruleItem}>
              <View style={styles.ruleIcon}>
                <Ionicons name="shirt" size={20} color="#fff" />
              </View>
              <View style={styles.ruleContent}>
                <Text style={styles.ruleTitle}>Proper Attire Required</Text>
                <Text style={styles.ruleDescription}>
                  Students must wear proper university attire. No slippers, shorts, or revealing clothing allowed in the cafeteria.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <View style={[styles.ruleIcon, { backgroundColor: '#FF6B6B' }]}>
                <Ionicons name="fast-food" size={20} color="#fff" />
              </View>
              <View style={styles.ruleContent}>
                <Text style={styles.ruleTitle}>Food Order Procedure</Text>
                <Text style={styles.ruleDescription}>
                  Students must queue orderly. Complete your meal before leaving. No taking food outside the cafeteria premises.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <View style={[styles.ruleIcon, { backgroundColor: '#4ECDC4' }]}>
                <Ionicons name="cafe" size={20} color="#fff" />
              </View>
              <View style={styles.ruleContent}>
                <Text style={styles.ruleTitle}>Plate Return Policy</Text>
                <Text style={styles.ruleDescription}>
                  All students must return used plates, utensils, and trays to the designated cleaning area after meals.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <View style={[styles.ruleIcon, { backgroundColor: '#FECA57' }]}>
                <Ionicons name="card" size={20} color="#fff" />
              </View>
              <View style={styles.ruleContent}>
                <Text style={styles.ruleTitle}>Meal Card Usage</Text>
                <Text style={styles.ruleDescription}>
                  Present your digital meal card for every transaction. Card is non-transferable and for personal use only.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <View style={[styles.ruleIcon, { backgroundColor: '#FF9FF3' }]}>
                <Ionicons name="time" size={20} color="#fff" />
              </View>
              <View style={styles.ruleContent}>
                <Text style={styles.ruleTitle}>Punctuality</Text>
                <Text style={styles.ruleDescription}>
                  Meals are served only during designated hours. Latecomers will not be served after closing time.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <View style={[styles.ruleIcon, { backgroundColor: '#54a0ff' }]}>
                <Ionicons name="people" size={20} color="#fff" />
              </View>
              <View style={styles.ruleContent}>
                <Text style={styles.ruleTitle}>Behavior & Conduct</Text>
                <Text style={styles.ruleDescription}>
                  Maintain decorum and respect staff. Any misconduct may result in suspension of cafeteria privileges.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call" size={24} color="#1e3c72" />
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>
          
          <View style={styles.contactCards}>
            <TouchableOpacity 
              style={styles.contactCard}
              onPress={() => openPhone('+251912002813')}
            >
              <Ionicons name="person" size={24} color="#1e3c72" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>Cafeteria Manager</Text>
                <Text style={styles.contactDetail}>+251-912-002-813</Text>
              </View>
              <Ionicons name="call" size={20} color="#1e3c72" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.contactCard}
              onPress={() => openEmail('andualem@gmail.edu.et')}
            >
              <Ionicons name="mail" size={24} color="#1e3c72" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>Support Email</Text>
                <Text style={styles.contactDetail}>andualem@gmail.edu.et</Text>
              </View>
              <Ionicons name="mail-open" size={20} color="#1e3c72" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Important Notice */}
        <View style={styles.noticeCard}>
          <Ionicons name="warning" size={30} color="#e74c3c" />
          <Text style={styles.noticeTitle}>Important Notice</Text>
          <Text style={styles.noticeText}>
            Violation of cafeteria rules may lead to disciplinary action. Repeated offenses can result in temporary or permanent suspension of meal privileges.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 5,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 10,
  },
  hoursGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hourCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mealType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  mealTime: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  menuCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  menuTime: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  menuItems: {
    marginLeft: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 14,
    color: '#34495e',
    marginLeft: 8,
  },
  rulesList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  ruleItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  ruleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e3c72',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  ruleContent: {
    flex: 1,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  ruleDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  contactCards: {
    gap: 10,
  },
  contactCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 15,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  contactDetail: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  noticeCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e74c3c',
    marginTop: 10,
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
});