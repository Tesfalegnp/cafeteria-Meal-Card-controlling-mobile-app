// /home/hope/Project_package/Meal_card/Mobile_app/TCSS-3/app/settings/weeklyMenuView.jsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
  Image, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Animated,
  Dimensions,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const { width } = Dimensions.get('window');

// Days mapping
const DAYS_OF_WEEK = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' }
];

export default function WeeklyMenuView() {
  const router = useRouter();
  const { student } = useAuth();
  const [currentDay, setCurrentDay] = useState('');
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [weeklyMenu, setWeeklyMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Get current day
    const today = new Date().getDay();
    setCurrentDayIndex(today);
    setCurrentDay(DAYS_OF_WEEK.find(day => day.id === today)?.name || 'Sunday');
    
    fetchWeeklyMenu();
    
    // Animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchWeeklyMenu = async () => {
    try {
      setLoading(true);
      
      // Fetch menu schedule from Supabase
      const { data: menuData, error } = await supabase
        .from('menu_schedule')
        .select('*')
        .eq('is_active', true)
        .order('day_of_week', { ascending: true })
        .order('meal_type', { ascending: true });

      if (error) {
        console.error('Error fetching menu:', error);
        return;
      }

      // Organize data by day and meal type
      const organizedData = {};
      
      // Initialize all days with empty structure
      DAYS_OF_WEEK.forEach(day => {
        organizedData[day.name] = {
          breakfast: { menu: 'Not scheduled', time: '' },
          lunch: { menu: 'Not scheduled', time: '' },
          dinner: { menu: 'Not scheduled', time: '' },
          special: { menu: '', time: '' }
        };
      });

      // Populate with actual data
      if (menuData) {
        menuData.forEach(item => {
          const dayName = DAYS_OF_WEEK.find(day => day.id === item.day_of_week)?.name;
          if (dayName && organizedData[dayName]) {
            const mealType = item.meal_type.toLowerCase();
            if (organizedData[dayName][mealType]) {
              organizedData[dayName][mealType] = {
                menu: item.menu_description,
                time: `${item.start_time} - ${item.end_time}`
              };
            }
          }
        });
      }

      setWeeklyMenu(organizedData);
    } catch (error) {
      console.error('Error in fetchWeeklyMenu:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeeklyMenu();
  };

  const getMealIcon = (mealType) => {
    switch(mealType) {
      case 'breakfast': return '☀️';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      case 'special': return '⭐';
      default: return '🍽️';
    }
  };

  const getMealColor = (mealType) => {
    switch(mealType) {
      case 'breakfast': return '#FFD700';
      case 'lunch': return '#FF6B35';
      case 'dinner': return '#4A90E2';
      case 'special': return '#FF4081';
      default: return '#666';
    }
  };

  const getCurrentMealStatus = (dayIndex, mealType) => {
    if (dayIndex !== currentDayIndex) return 'not-today';
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
    
    // Get meal time for today
    const mealData = weeklyMenu[DAYS_OF_WEEK[dayIndex].name]?.[mealType];
    if (!mealData?.time) return 'not-scheduled';
    
    // Parse time (assuming format like "07:00 - 09:00")
    const [startTime, endTime] = mealData.time.split(' - ');
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    if (currentTime >= startMinutes && currentTime <= endMinutes) {
      return 'active';
    } else if (currentTime < startMinutes) {
      return 'upcoming';
    } else {
      return 'closed';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'upcoming': return '#2196F3';
      case 'closed': return '#9E9E9E';
      case 'not-today': return '#E0E0E0';
      case 'not-scheduled': return '#FF9800';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Now Serving';
      case 'upcoming': return 'Coming Soon';
      case 'closed': return 'Service Closed';
      case 'not-today': return 'Not Today';
      case 'not-scheduled': return 'Not Scheduled';
      default: return '';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading Weekly Menu...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#FF6B35']}
          tintColor="#FF6B35"
        />
      }
    >
      {/* Header Section */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity  >
            <Ionicons name="gift" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Weekly Menu</Text>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🍽️</Text>
          </View>
        </View>
        
        {/* Today's Special Highlight */}
        <View style={styles.todaySpecial}>
          <View style={styles.todayBadge}>
            <Text style={styles.todayText}>TODAY</Text>
          </View>
          <Text style={styles.todayDay}>{currentDay}</Text>
          <Text style={styles.specialHighlight}>
            {weeklyMenu[currentDay]?.special?.menu || 'No special today'}
          </Text>
          {weeklyMenu[currentDay]?.special?.time && (
            <Text style={styles.specialTime}>
              {weeklyMenu[currentDay].special.time}
            </Text>
          )}
        </View>
      </Animated.View>

      {/* Current Meal Status */}
      <View style={styles.currentMealSection}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        <View style={styles.mealStatusGrid}>
          {['breakfast', 'lunch', 'dinner'].map(mealType => {
            const status = getCurrentMealStatus(currentDayIndex, mealType);
            const mealData = weeklyMenu[currentDay]?.[mealType];
            
            return (
              <View key={mealType} style={styles.mealStatusCard}>
                <View style={styles.mealStatusHeader}>
                  <Text style={styles.mealStatusIcon}>
                    {getMealIcon(mealType)}
                  </Text>
                  <View>
                    <Text style={styles.mealStatusType}>
                      {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </Text>
                    <Text style={styles.mealStatusTime}>
                      {mealData?.time || 'Not scheduled'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(status) }]}>
                  <Text style={styles.statusText}>{getStatusText(status)}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Weekly Menu Grid */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Full Week Menu</Text>
        {DAYS_OF_WEEK.map((day, index) => (
          <Animated.View 
            key={day.name}
            style={[
              styles.dayCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Day Header */}
            <View style={[
              styles.dayHeader,
              { 
                backgroundColor: day.id === currentDayIndex ? '#FF6B35' : '#f8f9fa',
                borderLeftWidth: day.id === currentDayIndex ? 4 : 0,
                borderLeftColor: day.id === currentDayIndex ? '#FF4081' : 'transparent'
              }
            ]}>
              <Text style={[
                styles.dayText,
                { color: day.id === currentDayIndex ? '#fff' : '#333' }
              ]}>
                {day.name}
              </Text>
              {day.id === currentDayIndex && (
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>Today</Text>
                </View>
              )}
            </View>

            {/* Meals List */}
            <View style={styles.mealsList}>
              {['breakfast', 'lunch', 'dinner'].map(mealType => {
                const mealData = weeklyMenu[day.name]?.[mealType];
                const status = getCurrentMealStatus(day.id, mealType);
                
                return (
                  <View key={mealType} style={styles.mealItem}>
                    <View style={styles.mealHeader}>
                      <Text style={styles.mealIcon}>
                        {getMealIcon(mealType)}
                      </Text>
                      <View style={styles.mealInfo}>
                        <Text style={[
                          styles.mealType,
                          { color: getMealColor(mealType) }
                        ]}>
                          {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                        </Text>
                        {mealData?.time && (
                          <Text style={styles.mealTime}>{mealData.time}</Text>
                        )}
                      </View>
                      <View style={[styles.mealStatus, { backgroundColor: getStatusColor(status) }]}>
                        <Text style={styles.mealStatusText}>
                          {getStatusText(status)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.mealDescription}>
                      {mealData?.menu || 'Menu not available'}
                    </Text>
                  </View>
                );
              })}
              
              {/* Special Meal */}
              {weeklyMenu[day.name]?.special?.menu && (
                <View style={[styles.mealItem, styles.specialMealItem]}>
                  <View style={styles.mealHeader}>
                    <Text style={styles.mealIcon}>
                      {getMealIcon('special')}
                    </Text>
                    <View style={styles.mealInfo}>
                      <Text style={[styles.mealType, { color: getMealColor('special') }]}>
                        Special
                      </Text>
                      {weeklyMenu[day.name].special.time && (
                        <Text style={styles.mealTime}>{weeklyMenu[day.name].special.time}</Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.mealDescription}>
                    {weeklyMenu[day.name].special.menu}
                  </Text>
                  <View style={styles.specialTag}>
                    <Text style={styles.specialTagText}>Special Offer</Text>
                  </View>
                </View>
              )}
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Nutrition Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>🍎 Nutrition Tips</Text>
        <View style={styles.tipItem}>
          <Ionicons name="heart-outline" size={16} color="#FF4081" />
          <Text style={styles.tipText}>Stay hydrated with 8 glasses of water daily</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="leaf-outline" size={16} color="#4CAF50" />
          <Text style={styles.tipText}>Include fruits and vegetables in every meal</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="barbell-outline" size={16} color="#2196F3" />
          <Text style={styles.tipText}>Balance your protein, carbs, and fats</Text>
        </View>
      </View>

      {/* Footer Note */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🕒 Menu times may vary. Check with cafeteria for updates.
        </Text>
        <Text style={styles.footerNote}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconText: {
    fontSize: 18,
  },
  todaySpecial: {
    backgroundColor: '#667eea',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  todayBadge: {
    backgroundColor: '#FF4081',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  todayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  todayDay: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  specialHighlight: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  specialTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  currentMealSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  mealStatusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealStatusCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
  },
  mealStatusHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  mealStatusIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  mealStatusType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  mealStatusTime: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  menuContainer: {
    padding: 16,
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  dayText: {
    fontSize: 18,
    fontWeight: '700',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF4081',
    marginRight: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  mealsList: {
    padding: 16,
  },
  mealItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B35',
  },
  specialMealItem: {
    backgroundColor: '#fff8e1',
    borderLeftColor: '#FFD700',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: 14,
    fontWeight: '700',
  },
  mealTime: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  mealStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  mealStatusText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  mealDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  specialTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF4081',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  specialTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  tipsSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    marginTop: 20,
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '600',
  },
  footerNote: {
    color: '#bdc3c7',
    fontSize: 12,
    textAlign: 'center',
  },
});