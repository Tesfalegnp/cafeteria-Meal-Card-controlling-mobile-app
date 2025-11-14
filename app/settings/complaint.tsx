// app/settings/complaint.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Complaint type options based on your requirements
const COMPLAINT_TYPES = [
  { id: 'staff_behavior', label: 'Staff Behavior', icon: 'people-outline', color: '#e74c3c' },
  { id: 'food_quality', label: 'Food Quality', icon: 'fast-food-outline', color: '#e67e22' },
  { id: 'technical', label: 'Technical Issue', icon: 'hardware-chip-outline', color: '#3498db' },
  { id: 'general', label: 'General Complaint', icon: 'document-text-outline', color: '#9b59b6' },
  { id: 'suggestion', label: 'Suggestion', icon: 'bulb-outline', color: '#27ae60' },
];

export default function Complaint() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [compliantType, setCompliantType] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [submitScale] = useState(new Animated.Value(1));
  const [successAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadStudentId();
  }, []);

  const loadStudentId = async () => {
    try {
      const sid = await AsyncStorage.getItem('studentId');
      if (!sid) {
        Alert.alert('Authentication Required', 'Please login to submit feedback');
        router.replace('/settings/login');
        return;
      }
      setStudentId(sid);
    } catch (error) {
      console.error('Error loading student ID:', error);
    }
  };

  const handleSubmitComplaint = async () => {
    if (!message.trim() || !compliantType) {
      Alert.alert('Error', 'Please fill in all fields and select a complaint type');
      return;
    }

    if (!studentId) {
      Alert.alert('Error', 'Student ID not found. Please login again.');
      return;
    }

    // Button press animation
    Animated.sequence([
      Animated.timing(submitScale, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(submitScale, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('complaints')
        .insert([
          {
            student_id: studentId,
            message: message.trim(),
            status: 'pending',
            response: null,
            created_at: new Date().toISOString(),
            resolved_at: null,
            compliant_type: compliantType,
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        Alert.alert('Error', error.message);
      } else {
        // Success animation
        Animated.timing(successAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();

        setTimeout(() => {
          Alert.alert(
            '🎉 Success!', 
            'Your feedback has been submitted! We appreciate your input and will review it soon.',
            [
              {
                text: 'Great!',
                onPress: () => {
                  setMessage('');
                  setCompliantType('');
                  setCharCount(0);
                  successAnim.setValue(0);
                }
              }
            ]
          );
        }, 600);
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageChange = (text: string) => {
    setMessage(text);
    setCharCount(text.length);
  };

  const getSelectedType = () => {
    return COMPLAINT_TYPES.find(type => type.id === compliantType);
  };

  // Show loading if student ID is not loaded yet
  if (!studentId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2a5298" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Animated Success Overlay */}
      <Animated.View 
        style={[
          styles.successOverlay,
          {
            opacity: successAnim,
            transform: [{
              scale: successAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            }],
          },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={['#27ae60', '#2ecc71']}
          style={styles.successGradient}
        >
          <Ionicons name="checkmark-circle" size={80} color="#fff" />
          <Text style={styles.successText}>Submitted!</Text>
        </LinearGradient>
      </Animated.View>

      {/* Header with Gradient */}
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Ionicons name="megaphone-outline" size={32} color="#fff" />
          <Text style={styles.headerTitle}>Share Your Feedback</Text>
          <Text style={styles.headerSubtitle}>
            Your voice matters! Help us improve your experience
          </Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={24} color="#3498db" />
            <Text style={styles.statNumber}>24-48h</Text>
            <Text style={styles.statLabel}>Response Time</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#27ae60" />
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Confidential</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trending-up-outline" size={24} color="#e67e22" />
            <Text style={styles.statNumber}>95%</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>

        {/* Feedback Type Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pricetags-outline" size={20} color="#2c3e50" />
            <Text style={styles.sectionTitle}>What would you like to share?</Text>
          </View>
          <View style={styles.typeGrid}>
            {COMPLAINT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  compliantType === type.id && [
                    styles.typeButtonActive,
                    { borderColor: type.color }
                  ]
                ]}
                onPress={() => setCompliantType(type.id)}
              >
                <LinearGradient
                  colors={compliantType === type.id ? [type.color, type.color] : ['#fff', '#fff']}
                  style={styles.typeButtonGradient}
                >
                  <Ionicons 
                    name={type.icon as any} 
                    size={28} 
                    color={compliantType === type.id ? '#fff' : type.color} 
                  />
                  <Text style={[
                    styles.typeButtonText,
                    compliantType === type.id && styles.typeButtonTextActive
                  ]}>
                    {type.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Message Input */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="create-outline" size={20} color="#2c3e50" />
            <Text style={styles.sectionTitle}>
              Tell us more {compliantType && `about ${getSelectedType()?.label.toLowerCase()}`}
            </Text>
          </View>
          
          <View style={[
            styles.inputContainer,
            compliantType && { borderLeftColor: getSelectedType()?.color, borderLeftWidth: 4 }
          ]}>
            <TextInput
              style={styles.textArea}
              value={message}
              onChangeText={handleMessageChange}
              placeholder="Be specific and constructive. Your detailed feedback helps us take appropriate action and make meaningful improvements."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={1000}
              placeholderTextColor="#95a5a6"
            />
            
            {/* Character counter with progress */}
            <View style={styles.charCounter}>
              <View style={styles.charProgressBar}>
                <View 
                  style={[
                    styles.charProgressFill,
                    { 
                      width: `${(charCount / 1000) * 100}%`,
                      backgroundColor: charCount > 800 ? '#e74c3c' : charCount > 500 ? '#f39c12' : '#2a5298'
                    }
                  ]} 
                />
              </View>
              <Text style={[
                styles.charCount,
                charCount > 800 && styles.charCountWarning
              ]}>
                {charCount}/1000
              </Text>
            </View>
          </View>

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <Ionicons name="home" size={16} color="#f39c12" />
            <Text style={styles.tipsText}>
              Tip: Include specific details like date, time, and location for quicker resolution
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <Animated.View style={{ transform: [{ scale: submitScale }] }}>
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              (loading || !message.trim() || !compliantType) && styles.submitButtonDisabled
            ]} 
            onPress={handleSubmitComplaint}
            disabled={loading || !message.trim() || !compliantType}
          >
            <LinearGradient
              colors={['#1e3c72', '#2a5298']}
              style={styles.submitButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="send" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>
                    Share Your Feedback
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Ionicons name="lock-closed-outline" size={16} color="#27ae60" />
          <Text style={styles.privacyText}>
            Your feedback is confidential and will only be used to improve our services
          </Text>
        </View>
      </ScrollView>
    </View>
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
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  successGradient: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  headerGradient: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2c3e50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  typeButtonGradient: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 14,
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 8,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textArea: {
    padding: 20,
    fontSize: 16,
    minHeight: 160,
    textAlignVertical: 'top',
    color: '#2c3e50',
  },
  charCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f8f9fa',
  },
  charProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#ecf0f1',
    borderRadius: 2,
    marginRight: 12,
    overflow: 'hidden',
  },
  charProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  charCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  charCountWarning: {
    color: '#e74c3c',
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fffbf0',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  tipsText: {
    flex: 1,
    fontSize: 12,
    color: '#e67e22',
    marginLeft: 8,
    lineHeight: 16,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  privacyText: {
    fontSize: 12,
    color: '#27ae60',
    marginLeft: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});