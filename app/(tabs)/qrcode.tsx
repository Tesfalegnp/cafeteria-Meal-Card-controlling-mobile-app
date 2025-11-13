// app/(tabs)/qrcode.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../lib/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

// ----------------------------
// Type Definitions
// ----------------------------
type Student = {
  student_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  department: string;
  year?: string;
  qr_code?: string;
};

// ----------------------------
// QR Code Screen Component
// ----------------------------
export default function QRCodeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    checkAuthAndLoadStudent();
  }, []);

  // ----------------------------
  // Check Authentication and Load Student Data
  // ----------------------------
  const checkAuthAndLoadStudent = async () => {
    try {
      const studentId = await AsyncStorage.getItem('studentId');
      if (!studentId) {
        Alert.alert('Authentication Required', 'Please login to access your QR code');
        router.replace('/settings/login');
        return;
      }
      await fetchStudentData(studentId);
    } catch (error) {
      console.error('Auth check error:', error);
      Alert.alert('Error', 'Unable to verify authentication');
    }
  };

  // ----------------------------
  // Fetch Single Student Data
  // ----------------------------
  const fetchStudentData = async (studentId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('student_id, first_name, middle_name, last_name, department, year, qr_code')
        .eq('student_id', studentId)
        .single();

      if (error) throw error;

      if (data) {
        // Generate QR code if it doesn't exist
        const studentWithQR = {
          ...data,
          qr_code: data.qr_code || generateQRCode(data.student_id, data.first_name, data.last_name)
        };
        setStudent(studentWithQR);
      } else {
        Alert.alert('Error', 'Student data not found');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching student:', error);
      Alert.alert('Error', 'Could not load student data');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Generate QR Code
  // ----------------------------
  const generateQRCode = (studentId: string, firstName: string, lastName: string): string => {
    const qrData = JSON.stringify({
      studentId: studentId,
      name: `${firstName} ${lastName}`,
      type: "meal_card",
      timestamp: new Date().toISOString()
    });
    
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
  };

  // ----------------------------
  // Refresh Handler
  // ----------------------------
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    const studentId = await AsyncStorage.getItem('studentId');
    if (studentId) {
      await fetchStudentData(studentId);
    }
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2a5298" />
        <Text style={styles.loadingText}>Loading your QR code...</Text>
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="qr-code-outline" size={64} color="#ccc" />
        <Text style={styles.errorTitle}>No Student Data</Text>
        <Text style={styles.errorText}>Unable to load student information</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={checkAuthAndLoadStudent}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Meal Card</Text>
          <Text style={styles.headerSubtitle}>Present this QR code at the cafeteria</Text>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2a5298']}
            tintColor="#2a5298"
          />
        }
      >
        {/* Student Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="person-circle-outline" size={24} color="#2a5298" />
            <Text style={styles.infoTitle}>Student Information</Text>
          </View>
          
          <View style={styles.infoContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>
                {student.first_name} {student.middle_name} {student.last_name}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Student ID:</Text>
              <Text style={styles.infoValue}>{student.student_id}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Department:</Text>
              <Text style={styles.infoValue}>{student.department}</Text>
            </View>
            
            {student.year && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Batch:</Text>
                <Text style={styles.infoValue}>
                  {new Date(student.year).getFullYear()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* QR Code Card */}
        <View style={styles.qrCard}>
          <View style={styles.qrHeader}>
            <Ionicons name="qr-code-outline" size={24} color="#27ae60" />
            <Text style={styles.qrTitle}>Meal QR Code</Text>
          </View>

          <View style={styles.qrCodeContainer}>
            <Image 
              source={{ uri: student.qr_code }} 
              style={styles.qrCodeImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsText}>
              Show this QR code at the cafeteria counter for meal scanning
            </Text>
            <Text style={styles.instructionsSubtext}>
              Code will be scanned automatically by the scanner device
            </Text>
          </View>
        </View>

        {/* Usage Instructions */}
        <View style={styles.instructionsCard}>
          <View style={styles.instructionsHeader}>
            <Ionicons name="information-circle-outline" size={24} color="#e67e22" />
            <Text style={styles.instructionsTitle}>How to Use</Text>
          </View>
          
          <View style={styles.instructionSteps}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Open this screen when you're at the cafeteria
              </Text>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Present your phone to the scanner device
              </Text>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Wait for the confirmation beep
              </Text>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>
                Collect your meal after successful scan
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Info */}
      <View style={styles.bottomInfo}>
        <Ionicons name="shield-checkmark-outline" size={16} color="#27ae60" />
        <Text style={styles.bottomInfoText}>
          This QR code is unique to your student account
        </Text>
      </View>
    </View>
  );
}

// ----------------------------
// Enhanced Modern Styles
// ----------------------------
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2a5298',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerGradient: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 8,
  },
  infoContent: {
    // Content styles
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    flex: 2,
    textAlign: 'right',
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  qrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 8,
  },
  qrCodeContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  qrCodeImage: {
    width: 250,
    height: 250,
  },
  instructions: {
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  instructionsSubtext: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 8,
  },
  instructionSteps: {
    // Steps container
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    backgroundColor: '#2a5298',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomInfoText: {
    fontSize: 12,
    color: '#27ae60',
    marginLeft: 6,
    fontWeight: '500',
  },
});