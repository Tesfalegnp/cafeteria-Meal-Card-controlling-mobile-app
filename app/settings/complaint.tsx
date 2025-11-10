import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabaseClient';

export default function Complaint() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);

  const handleSubmitComplaint = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('complaints')
        .insert([
          {
            title,
            description,
            category,
            status: 'pending',
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Complaint submitted successfully');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Submit Complaint/Feedback</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {['general', 'technical', 'suggestion', 'bug'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.categoryButtonActive
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[
                styles.categoryText,
                category === cat && styles.categoryTextActive
              ]}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Brief title of your complaint/feedback"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Please describe your issue or feedback in detail..."
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSubmitComplaint}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Submitting...' : 'Submit Complaint'}
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
  textArea: {
    height: 120,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonActive: {
    backgroundColor: '#2f95dc',
    borderColor: '#2f95dc',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
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