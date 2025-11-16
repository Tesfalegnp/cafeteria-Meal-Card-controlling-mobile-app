import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Animated 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { student } = useAuth();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Header with Gradient Background --- */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#1e3c72', '#2a5298', '#1e3c72']}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              {/* Animated Logo */}
              <Text style={styles.universityName}>Mizan Tepi University</Text>
              <Text style={styles.appTitle}>Digital Cafeteria System</Text>
              
              {/* Welcome Badge with Student Info */}
              <Animated.View 
                style={[
                  styles.welcomeBadge,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideUpAnim }]
                  }
                ]}
              >
                <Ionicons name="cafe-outline" size={20} color="#fff" />
                <Text style={styles.welcomeText}>
                  Welcome, {student?.first_name || 'Student'}
                </Text>
              </Animated.View>

              {/* Student Quick Info */}
              <Animated.View 
                style={[
                  styles.studentInfo,
                  {
                    opacity: fadeAnim
                  }
                ]}
              >
              </Animated.View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* --- Quick Actions Section --- */}
          <Text style={styles.sectionTitle}></Text>
          

        {/* --- Today's Special Highlight --- */}
        <Animated.View 
          style={[
            styles.todaySpecial,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.todaySpecialGradient}
          >
            <View style={styles.specialContent}>
              <View style={styles.specialBadge}>
                <Ionicons name="flash" size={16} color="#fff" />
                <Text style={styles.specialBadgeText}>Today's Special</Text>
              </View>
              <Text style={styles.specialTime}>🍽️ Available until 8:00 PM</Text>
              <TouchableOpacity 
                style={styles.viewMenuButton}
                onPress={() => router.push('../settings/weeklyMenuView')}
              >
                <Text style={styles.viewMenuText}>View Full Menu</Text>
                <Ionicons name="arrow-forward" size={16} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
            <View style={styles.specialImage}>
              <Text style={styles.foodEmoji}>🍗🥗</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* --- Main Features Grid --- */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Cafeteria Services</Text>
          <View style={styles.featuresGrid}>
            <FeatureCard
              title="Scan QR Code"
              icon="qr-code"
              description="Quick meal purchase"
              color="#45B7D1"
              onPress={() => router.push('/(tabs)/qrcode')}
              animation={fadeAnim}
            />
            <FeatureCard
              title="Meal History"
              icon="time"
              description="View past transactions"
              color="#96CEB4"
              onPress={() => router.push('/(tabs)')}
              animation={fadeAnim}
            />
            <FeatureCard
              title="Top Up"
              icon="add-circle"
              description="Add funds to card"
              color="#FECA57"
              onPress={() => router.push('/(tabs)')}
              animation={fadeAnim}
            />
            <FeatureCard
              title="Weekly Menu"
              icon="restaurant"
              description="View meal schedule"
              color="#FF6B8B"
              onPress={() => router.push('./settings/weeklyMenuView')}
              animation={fadeAnim}
            />
          </View>
        </View>

        {/* --- Additional Features Row --- */}
        <Animated.View 
          style={[
            styles.additionalFeatures,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <TouchableOpacity style={styles.additionalFeature} onPress={() => router.push('/settings/about')}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.additionalFeatureGradient}
            >
              <Ionicons name="settings" size={24} color="#fff" />
              <Text style={styles.additionalFeatureText}>About Us</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.additionalFeature} onPress={() => router.push('/(tabs)/rule_regulation')}>
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              style={styles.additionalFeatureGradient}
            >
              <Ionicons name="help-circle" size={24} color="#fff" />
              <Text style={styles.additionalFeatureText}>Help & Support</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* --- Campus Info Card --- */}
        <Animated.View 
          style={[
            styles.campusCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.campusCardGradient}
          >
            <View style={styles.campusInfo}>
              <Ionicons name="school-outline" size={32} color="#fff" />
              <View style={styles.campusText}>
                <Text style={styles.campusName}>MTU Tepi Campus</Text>
                <Text style={styles.campusHours}>Cafeteria Hours: 7:00 AM - 8:00 PM</Text>
              </View>
            </View>
            <View style={styles.stats}>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* --- Quick Stats --- */}
        <Animated.View 
          style={[
            styles.quickStats,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.statCard}>
            <Ionicons name="fast-food" size={24} color="#FF6B6B" />
            <Text style={styles.statCardNumber}>3</Text>
            <Text style={styles.statCardLabel}>Meals Today</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={24} color="#4ECDC4" />
            <Text style={styles.statCardNumber}>900</Text>
            <Text style={styles.statCardLabel}>This Month</Text>
          </View>
        </Animated.View>
        {/* --- Nutrition Tips --- */}
        <Animated.View 
          style={[
            styles.nutritionTips,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>🍎 Nutrition Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <Ionicons name="water" size={20} color="#45B7D1" />
              <Text style={styles.tipText}>Stay hydrated with 8 glasses of water daily</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="leaf" size={20} color="#96CEB4" />
              <Text style={styles.tipText}>Include fruits and vegetables in every meal</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="barbell" size={20} color="#FF6B6B" />
              <Text style={styles.tipText}>Balance your protein, carbs, and fats</Text>
            </View>
          </View>
        </Animated.View>

        {/* --- Emergency Contact --- */}
        <Animated.View 
          style={[
            styles.contactCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.contactHeader}>
            <Ionicons name="call-outline" size={20} color="#e74c3c" />
            <Text style={styles.contactTitle}>Need Help?</Text>
          </View>
          <Text style={styles.contactText}>
            Cafeteria Manager: +251-912-002-813{"\n"}
            Support: andualem@gmail.edu.et
          </Text>
          <TouchableOpacity style={styles.emergencyButton}>
            <Ionicons name="alert-circle" size={16} color="#fff" />
            <Text style={styles.emergencyButtonText}>Emergency Contact</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* --- Footer --- */}
        <Animated.View 
          style={[
            styles.footer,
            {
              opacity: fadeAnim
            }
          ]}
        >
          <Text style={styles.footerText}>© 2025 Mizan Tepi University</Text>
          <Text style={styles.footerSubtext}>
            By Tesfalegn Petros and Birhanu Kassa from software department at 2014 batch
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Quick Action Card Component
function QuickActionCard({ title, icon, color, subtitle, value, onPress, animation }: any) {
  return (
    <Animated.View style={{ opacity: animation }}>
      <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
        <LinearGradient
          colors={[color, `${color}DD`]}
          style={styles.quickActionGradient}
        >
          <View style={styles.quickActionHeader}>
            <Ionicons name={icon} size={24} color="#fff" />
            <Text style={styles.quickActionTitle}>{title}</Text>
          </View>
          <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
          <Text style={styles.quickActionValue}>{value}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Feature Card Component
function FeatureCard({ title, icon, description, color, onPress, animation }: any) {
  return (
    <Animated.View 
      style={[
        styles.featureCard,
        { opacity: animation }
      ]}
    >
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.featureIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={28} color="#fff" />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// --- Enhanced Styles ---
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerGradient: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  universityName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  appTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15,
  },
  welcomeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  welcomeText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 12,
  },
  studentInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  infoText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 4,
    fontWeight: '500',
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  quickActionGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  quickActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionTitle: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  quickActionSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 5,
  },
  quickActionValue: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginTop: 5,
  },
  todaySpecial: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  todaySpecialGradient: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specialContent: {
    flex: 1,
  },
  specialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  specialBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  specialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  specialTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
  },
  viewMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewMenuText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  specialImage: {
    marginLeft: 10,
  },
  foodEmoji: {
    fontSize: 40,
  },
  featuresSection: {
    padding: 20,
    paddingTop: 0,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  additionalFeatures: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  additionalFeature: {
    flex: 1,
    marginHorizontal: 5,
    height: 70,
    borderRadius: 15,
    overflow: 'hidden',
  },
  additionalFeatureGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  additionalFeatureText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  campusCard: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  campusCardGradient: {
    padding: 20,
  },
  campusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  campusText: {
    marginLeft: 15,
  },
  campusName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  campusHours: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statCardNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginTop: 5,
  },
  statCardLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    marginTop: 2,
  },
  nutritionTips: {
    padding: 20,
    paddingTop: 0,
  },
  tipsContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  contactCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 8,
  },
  contactText: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 18,
    marginBottom: 15,
  },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 10,
    color: '#bdc3c7',
    textAlign: 'center',
  },
});