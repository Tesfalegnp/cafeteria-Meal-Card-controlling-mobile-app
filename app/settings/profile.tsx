import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../lib/supabaseClient';

export default function ProfileScreen() {
  const router = useRouter();
  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const sid = await AsyncStorage.getItem('studentId');
      if (!sid) {
        router.replace('/settings');
        return;
      }
      await load(sid);
    })();
  }, []);

  const load = async (studentId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('student_id', studentId)
        .single();
      
      if (error) {
        console.warn(error);
        Alert.alert('Error', 'Could not load profile.');
      } else {
        setStudent(data);
        // Initialize date if exists
        if (data['Date-of-birth']) {
          setTempDate(new Date(data['Date-of-birth']));
        }
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  // Image picker function
  const pickImage = async () => {
    if (!editing) return;

    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload images.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images, // Fixed: Use MediaType instead of MediaTypeOptions
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Upload image function using FormData
  const uploadImage = async (uri: string) => {
    if (!student) return;

    setUploading(true);
    try {
      // Get the file extension
      const fileExt = uri.split('.').pop() || 'jpg';
      const fileName = `${student.student_id}-${Date.now()}.${fileExt}`;
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: `image/${fileExt}`,
        name: fileName,
      } as any);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, formData, {
          contentType: `image/${fileExt}`,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      // Update student record with new photo URL
      const { error: updateError } = await supabase
        .from('students')
        .update({ photo_url: publicUrl })
        .eq('student_id', student.student_id);

      if (updateError) throw updateError;

      // Update local state
      setStudent({ ...student, photo_url: publicUrl });
      Alert.alert('Success', 'Profile photo updated successfully!');
      
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Remove profile photo
  const removePhoto = async () => {
    if (!student || !student.photo_url) return;

    setUploading(true);
    try {
      const { error } = await supabase
        .from('students')
        .update({ photo_url: null })
        .eq('student_id', student.student_id);

      if (error) throw error;

      setStudent({ ...student, photo_url: null });
      Alert.alert('Success', 'Profile photo removed successfully!');
    } catch (error: any) {
      console.error('Remove error:', error);
      Alert.alert('Error', 'Failed to remove photo');
    } finally {
      setUploading(false);
    }
  };

  // Show image action options
  const showImageOptions = () => {
    if (!editing || uploading) return;

    Alert.alert(
      'Profile Photo',
      'Choose an option',
      [
        {
          text: 'Choose from Gallery',
          onPress: pickImage,
        },
        ...(student?.photo_url ? [{
          text: 'Remove Current Photo',
          onPress: removePhoto,
          style: 'destructive' as const,
        }] : []),
        {
          text: 'Cancel',
          style: 'cancel' as const,
        },
      ]
    );
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const validateAge = (birthDate: string): boolean => {
    const age = calculateAge(birthDate);
    return age >= 15;
  };

  const save = async () => {
    if (!student) return;
    
    // Validate age before saving
    if (student['Date-of-birth']) {
      if (!validateAge(student['Date-of-birth'])) {
        Alert.alert('Validation Error', 'You must be at least 15 years old to register.');
        return;
      }
    }

    setLoading(true);
    try {
      const updates: any = {
        email: student.email,
        "phone-number": student["phone-number"],
        photo_url: student.photo_url,
        diet_type: student.diet_type,
        status: student.status,
        "Date-of-birth": student["Date-of-birth"],
        "Place-of-Birth": student["Place-of-Birth"],
        "Gender": student["Gender"],
        nationality: student.nationality,
        "emergency-contact-name": student["emergency-contact-name"],
        "emergency-contact-phone": student["emergency-contact-phone"],
        "emergency-contact-email": student["emergency-contact-email"],
        "national-id-number": student["national-id-number"],
        "health-level": student["health-level"],
      };
      
      const { error } = await supabase
        .from('students')
        .update(updates)
        .eq('student_id', student.student_id);
        
      if (error) throw error;
      Alert.alert('Success', 'Profile updated successfully!');
      setEditing(false);
      await load(student.student_id);
    } catch (err: any) {
      console.warn(err);
      Alert.alert('Save error', err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    
    if (selectedDate) {
      setTempDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setStudent({ ...student, "Date-of-birth": formattedDate });
      
      // Show age validation immediately
      const age = calculateAge(formattedDate);
      if (age < 15) {
        Alert.alert('Age Restriction', `You must be at least 15 years old. Current age: ${age}`);
      }
    }
  };

  const showDatePickerModal = () => {
    setTempDate(student['Date-of-birth'] ? new Date(student['Date-of-birth']) : new Date(2000, 0, 1));
    setShowDatePicker(true);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2f95dc" />;

  if (!student) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity 
            onPress={showImageOptions}
            disabled={!editing || uploading}
          >
            <View style={styles.imageContainer}>
              <Image
                source={student.photo_url ? { uri: student.photo_url } : require('../../assets/images/placeholder_account.jpeg')}
                style={styles.profileImage}
              />
              {editing && (
                <View style={styles.imageOverlay}>
                  {uploading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="camera" size={24} color="#fff" />
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
          
          <Text style={styles.name}>
            {student.first_name} {student.middle_name ? student.middle_name + ' ' : ''}{student.last_name}
          </Text>
          <Text style={styles.studentId}>{student.student_id}</Text>
          {student.department && (
            <Text style={styles.department}>{student.department}</Text>
          )}
          {student.year && (
            <Text style={styles.batchYear}>Batch: {new Date(student.year).getFullYear()}</Text>
          )}
          
          {editing && (
            <View style={styles.imageHint}>
              <Text style={styles.imageHintText}>
                Tap image to {student.photo_url ? 'change' : 'add'} photo
              </Text>
            </View>
          )}
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, !editing && styles.disabledInput]}
              value={student.email ?? ''}
              onChangeText={(t) => setStudent({ ...student, email: t })}
              editable={editing}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, !editing && styles.disabledInput]}
              value={student["phone-number"] ? String(student["phone-number"]) : ''}
              onChangeText={(t) => setStudent({ ...student, "phone-number": t })}
              editable={editing}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Date of Birth 
              {student["Date-of-birth"] && (
                <Text style={styles.ageText}>
                  {' '}(Age: {calculateAge(student["Date-of-birth"])})
                  {calculateAge(student["Date-of-birth"]) < 15 && (
                    <Text style={styles.ageWarning}> - Must be 15+</Text>
                  )}
                </Text>
              )}
            </Text>
            {editing ? (
              <TouchableOpacity onPress={showDatePickerModal}>
                <View style={[styles.input, styles.dateInput]}>
                  <Text style={student["Date-of-birth"] ? styles.dateText : styles.placeholderText}>
                    {student["Date-of-birth"] ? formatDate(student["Date-of-birth"]) : 'Select Date of Birth'}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={student["Date-of-birth"] ? formatDate(student["Date-of-birth"]) : ''}
                editable={false}
              />
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Place of Birth</Text>
            <TextInput
              style={[styles.input, !editing && styles.disabledInput]}
              value={student["Place-of-Birth"] ?? ''}
              onChangeText={(t) => setStudent({ ...student, "Place-of-Birth": t })}
              editable={editing}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Gender</Text>
            <TextInput
              style={[styles.input, !editing && styles.disabledInput]}
              value={student["Gender"] ?? ''}
              onChangeText={(t) => setStudent({ ...student, "Gender": t })}
              editable={editing}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Nationality</Text>
            <TextInput
              style={[styles.input, !editing && styles.disabledInput]}
              value={student.nationality ?? ''}
              onChangeText={(t) => setStudent({ ...student, nationality: t })}
              editable={editing}
            />
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Contact Name</Text>
            <TextInput
              style={[styles.input, !editing && styles.disabledInput]}
              value={student["emergency-contact-name"] ?? ''}
              onChangeText={(t) => setStudent({ ...student, "emergency-contact-name": t })}
              editable={editing}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contact Phone</Text>
            <TextInput
              style={[styles.input, !editing && styles.disabledInput]}
              value={student["emergency-contact-phone"] ?? ''}
              onChangeText={(t) => setStudent({ ...student, "emergency-contact-phone": t })}
              editable={editing}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contact Email</Text>
            <TextInput
              style={[styles.input, !editing && styles.disabledInput]}
              value={student["emergency-contact-email"] ?? ''}
              onChangeText={(t) => setStudent({ ...student, "emergency-contact-email": t })}
              editable={editing}
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Additional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>National ID Number</Text>
            <TextInput
              style={[styles.input, !editing && styles.disabledInput]}
              value={student["national-id-number"] ?? ''}
              onChangeText={(t) => setStudent({ ...student, "national-id-number": t })}
              editable={editing}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Diet Type</Text>
            <TextInput
              style={[styles.input, !editing && styles.disabledInput]}
              value={student.diet_type ?? ''}
              onChangeText={(t) => setStudent({ ...student, diet_type: t })}
              editable={editing}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Health Level</Text>
            <TextInput
              style={[styles.input, !editing && styles.disabledInput]}
              value={student["health-level"] ?? ''}
              onChangeText={(t) => setStudent({ ...student, "health-level": t })}
              editable={editing}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Status</Text>
            <TextInput
              style={[styles.input, !editing && styles.disabledInput]}
              value={student.status ?? ''}
              onChangeText={(t) => setStudent({ ...student, status: t })}
              editable={editing}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {editing ? (
            <>
              <Button 
                title="Save Changes" 
                onPress={save} 
                disabled={loading || uploading} 
              />
              <View style={styles.buttonSpacing} />
              <Button 
                title="Cancel" 
                onPress={() => {
                  setEditing(false);
                  load(student.student_id);
                }} 
                color="#999" 
                disabled={loading || uploading}
              />
            </>
          ) : (
            <Button title="Edit Profile" onPress={() => setEditing(true)} />
          )}
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerContent}>
              <Text style={styles.datePickerTitle}>Select Date of Birth</Text>
              <DateTimePicker
                value={tempDate || new Date(2000, 0, 1)}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                style={styles.datePicker}
              />
              <View style={styles.datePickerButtons}>
                <Button 
                  title="Cancel" 
                  onPress={() => setShowDatePicker(false)} 
                  color="#999" 
                />
                <Button 
                  title="Confirm" 
                  onPress={() => handleDateChange(null, tempDate || undefined)} 
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f7f8fb' 
  },
  scrollContainer: { 
    padding: 16, 
    paddingBottom: 120 
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageHint: {
    marginTop: 8,
  },
  imageHintText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  name: {
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
  },
  studentId: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 4,
  },
  department: {
    color: '#2f95dc',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  batchYear: {
    color: '#888',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#f9f9f9',
    color: '#666',
  },
  dateInput: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  ageText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666',
  },
  ageWarning: {
    color: '#ff6b6b',
    fontWeight: '600',
  },
  actions: {
    marginTop: 24,
  },
  buttonSpacing: {
    height: 12,
  },
  datePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  datePicker: {
    height: 200,
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});