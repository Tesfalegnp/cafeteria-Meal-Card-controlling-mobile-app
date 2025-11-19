// /home/hope/Project_package/Meal_card/Mobile_app/TCSS-3/app/settings/meal_history.jsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Animated,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  SectionList
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const { width } = Dimensions.get('window');

export default function MealHistory() {
  const router = useRouter();
  const { student } = useAuth();
  const [mealHistory, setMealHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalMeals: 0,
    thisWeek: 0,
    thisMonth: 0,
    today: 0
  });
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    fetchMealHistory();
    
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

  const fetchMealHistory = async () => {
    try {
      setLoading(true);
      
      if (!student?.student_id) {
        console.error('No student ID found');
        return;
      }

      // Fetch meal records for the student
      const { data: mealData, error } = await supabase
        .from('meal_records')
        .select('*')
        .eq('student_id', student.student_id)
        .order('meal_date', { ascending: false })
        .order('consumed_at', { ascending: false });

      if (error) {
        console.error('Error fetching meal history:', error);
        return;
      }

      // Organize data by date
      const organizedData = organizeDataByDate(mealData || []);
      setMealHistory(organizedData);

      // Calculate statistics
      calculateStatistics(mealData || []);

    } catch (error) {
      console.error('Error in fetchMealHistory:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const organizeDataByDate = (data) => {
    const grouped = {};
    
    data.forEach(record => {
      const date = new Date(record.meal_date).toDateString();
      if (!grouped[date]) {
        grouped[date] = {
          title: date,
          data: []
        };
      }
      grouped[date].data.push(record);
    });

    return Object.values(grouped);
  };

  const calculateStatistics = (data) => {
    const today = new Date().toDateString();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const stats = {
      totalMeals: data.length,
      thisWeek: data.filter(record => new Date(record.meal_date) >= oneWeekAgo).length,
      thisMonth: data.filter(record => new Date(record.meal_date) >= oneMonthAgo).length,
      today: data.filter(record => new Date(record.meal_date).toDateString() === today).length
    };

    setStats(stats);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMealHistory();
  };

  const getMealIcon = (mealType) => {
    switch(mealType) {
      case 'breakfast': return '☀️';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      default: return '🍽️';
    }
  };

  const getMealColor = (mealType) => {
    switch(mealType) {
      case 'breakfast': return '#FFD700';
      case 'lunch': return '#FF6B35';
      case 'dinner': return '#4A90E2';
      default: return '#666';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMealItem = ({ item }) => (
    <View style={styles.mealItem}>
      <View style={styles.mealIconContainer}>
        <Text style={styles.mealIcon}>{getMealIcon(item.meal_type)}</Text>
      </View>
      <View style={styles.mealInfo}>
        <Text style={styles.mealType}>
          {item.meal_type.charAt(0).toUpperCase() + item.meal_type.slice(1)}
        </Text>
        <Text style={styles.mealTime}>
          {formatTime(item.consumed_at)}
        </Text>
      </View>
      <View style={[styles.mealStatus, { backgroundColor: getMealColor(item.meal_type) }]}>
        <Text style={styles.mealStatusText}>Consumed</Text>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{formatDate(title)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading Meal History...</Text>
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
          <TouchableOpacity 
            
          >
            <Ionicons name="today" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meal History</Text>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>📊</Text>
          </View>
        </View>
      </Animated.View>

      {/* Statistics Cards */}
      <Animated.View 
        style={[
          styles.statsSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.statsTitle}>Your Meal Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FF6B35' }]}>
              <Ionicons name="today" size={20} color="#fff" />
            </View>
            <Text style={styles.statNumber}>{stats.today}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#4ECDC4' }]}>
              <Ionicons name="calendar" size={20} color="#fff" />
            </View>
            <Text style={styles.statNumber}>{stats.thisWeek}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#45B7D1' }]}>
              <Ionicons name="stats-chart" size={20} color="#fff" />
            </View>
            <Text style={styles.statNumber}>{stats.thisMonth}</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#96CEB4' }]}>
              <Ionicons name="fast-food" size={20} color="#fff" />
            </View>
            <Text style={styles.statNumber}>{stats.totalMeals}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </Animated.View>

      {/* Meal History List */}
      <Animated.View 
        style={[
          styles.historySection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.sectionTitle}>Meal Consumption History</Text>
        
        {mealHistory.length > 0 ? (
          <SectionList
            sections={mealHistory}
            keyExtractor={(item, index) => item.id + index}
            renderItem={renderMealItem}
            renderSectionHeader={renderSectionHeader}
            scrollEnabled={false}
            contentContainerStyle={styles.sectionList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>No Meal History</Text>
            <Text style={styles.emptyText}>
              You haven't consumed any meals yet. Start using your meal card to see your history here.
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Insights Section */}
      {mealHistory.length > 0 && (
        <Animated.View 
          style={[
            styles.insightsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>📈 Meal Insights</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightItem}>
              <Ionicons name="trending-up" size={20} color="#4CAF50" />
              <Text style={styles.insightText}>
                Most frequent meal: {getMostFrequentMeal(mealHistory)}
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="time" size={20} color="#2196F3" />
              <Text style={styles.insightText}>
                Average meals per day: {(stats.totalMeals / Math.max(mealHistory.length, 1)).toFixed(1)}
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="calendar" size={20} color="#FF9800" />
              <Text style={styles.insightText}>
                Last meal: {getLastMealTime(mealHistory)}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Footer */}
      <Animated.View 
        style={[
          styles.footer,
          {
            opacity: fadeAnim
          }
        ]}
      >
        <Text style={styles.footerText}>
          🕒 All times are recorded automatically when you use your meal card
        </Text>
        <Text style={styles.footerNote}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

// Helper functions
const getMostFrequentMeal = (mealHistory) => {
  const mealCount = { breakfast: 0, lunch: 0, dinner: 0 };
  mealHistory.forEach(section => {
    section.data.forEach(meal => {
      mealCount[meal.meal_type]++;
    });
  });
  
  const maxMeal = Object.keys(mealCount).reduce((a, b) => 
    mealCount[a] > mealCount[b] ? a : b
  );
  
  return maxMeal.charAt(0).toUpperCase() + maxMeal.slice(1);
};

const getLastMealTime = (mealHistory) => {
  if (mealHistory.length === 0) return 'No meals yet';
  
  const latestSection = mealHistory[0];
  if (latestSection.data.length === 0) return 'No meals today';
  
  const latestMeal = latestSection.data[0];
  const time = new Date(latestMeal.consumed_at);
  return time.toLocaleTimeString('en-US', { 
    hour: '2-digit',
    minute: '2-digit'
  });
};

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
  statsSection: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  historySection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  sectionList: {
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mealIcon: {
    fontSize: 16,
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 14,
    color: '#666',
  },
  mealStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mealStatusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  insightsSection: {
    padding: 20,
    paddingTop: 0,
  },
  insightCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
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