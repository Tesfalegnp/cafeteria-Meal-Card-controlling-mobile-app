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
  Dimensions 
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

// Mock data for weekly menu
const WEEKLY_MENU_DATA = {
  Monday: {
    breakfast: 'Ful, Bread, Tea',
    lunch: 'Rice, Shiro, Vegetables, Injera',
    dinner: 'Pasta, Salad, Fruit Juice',
    special: 'Special: Fresh Fruit Salad'
  },
  Tuesday: {
    breakfast: 'Scrambled Eggs, Bread, Milk',
    lunch: 'Rice, Meat Sauce, Lentils, Injera',
    dinner: 'Rice, Chicken Curry, Vegetables',
    special: 'Special: Chicken BBQ'
  },
  Wednesday: {
    breakfast: 'Pancakes, Honey, Coffee',
    lunch: 'Rice, Beans, Potatoes, Injera',
    dinner: 'Sandwich, Soup, Juice',
    special: 'Special: Pizza Day'
  },
  Thursday: {
    breakfast: 'Oats, Fruits, Tea',
    lunch: 'Rice, Cabbage, Carrots, Injera',
    dinner: 'Spaghetti, Meatballs, Salad',
    special: 'Special: Ice Cream'
  },
  Friday: {
    breakfast: 'French Toast, Jam, Milk',
    lunch: 'Rice, Fish, Vegetables, Injera',
    dinner: 'Burger, Fries, Soft Drink',
    special: 'Special: Fish Fry'
  },
  Saturday: {
    breakfast: 'Cereal, Fruits, Yogurt',
    lunch: 'Rice, Doro Wat, Injera',
    dinner: 'Rice, Vegetables, Lentils',
    special: 'Special: Traditional Coffee'
  },
  Sunday: {
    breakfast: 'Bacon, Eggs, Toast, Coffee',
    lunch: 'Rice, Tibs, Salad, Injera',
    dinner: 'Rice, Mixed Vegetables, Juice',
    special: 'Special: Family Lunch'
  }
};

export default function WeeklyMenuView() {
  const router = useRouter();
  const { student } = useAuth();
  const [currentDay, setCurrentDay] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Get current day
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    setCurrentDay(days[today]);

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
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
            {WEEKLY_MENU_DATA[currentDay]?.special || 'Check back later!'}
          </Text>
        </View>
      </Animated.View>

      {/* Weekly Menu Grid */}
      <View style={styles.menuContainer}>
        {Object.entries(WEEKLY_MENU_DATA).map(([day, meals], index) => (
          <Animated.View 
            key={day}
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
                backgroundColor: day === currentDay ? '#FF6B35' : '#f8f9fa',
                borderLeftWidth: day === currentDay ? 4 : 0,
                borderLeftColor: day === currentDay ? '#FF4081' : 'transparent'
              }
            ]}>
              <Text style={[
                styles.dayText,
                { color: day === currentDay ? '#fff' : '#333' }
              ]}>
                {day}
              </Text>
              {day === currentDay && (
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>Live</Text>
                </View>
              )}
            </View>

            {/* Meals List */}
            <View style={styles.mealsList}>
              {Object.entries(meals).map(([mealType, meal]) => (
                <View key={mealType} style={styles.mealItem}>
                  <View style={styles.mealHeader}>
                    <Text style={styles.mealIcon}>
                      {getMealIcon(mealType)}
                    </Text>
                    <Text style={[
                      styles.mealType,
                      { color: getMealColor(mealType) }
                    ]}>
                      {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </Text>
                  </View>
                  <Text style={styles.mealDescription}>{meal}</Text>
                  
                  {mealType === 'special' && (
                    <View style={styles.specialTag}>
                      <Text style={styles.specialTagText}>Special Offer</Text>
                    </View>
                  )}
                </View>
              ))}
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
          🕒 Serving Times: Breakfast 7-9AM • Lunch 12-2PM • Dinner 6-8PM
        </Text>
        <Text style={styles.footerNote}>
          Menu subject to change based on availability
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
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  mealType: {
    fontSize: 14,
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