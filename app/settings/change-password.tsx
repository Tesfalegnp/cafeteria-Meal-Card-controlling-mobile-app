import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { supabase } from '../../lib/supabaseClient';

export default function ChangePassword() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      // Implement password change logic with Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Password changed successfully');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Current Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Enter current password"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleChangePassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Changing Password...' : 'Change Password'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f8fb' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 30, textAlign: 'center' },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#2f95dc',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});