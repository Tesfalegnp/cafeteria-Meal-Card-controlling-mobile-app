// components/Header.tsx
// Shared app header: Mizan Tepi University title (left) + logo or student photo (right)

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabaseClient';

export default function Header() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentPhoto();
  }, []);

  // Fetch student's image from the students table
  async function fetchStudentPhoto() {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.log('No logged-in user');
        return;
      }

      // Use user.id (UUID) to find matching student record
      const { data, error } = await supabase
        .from('students')
        .select('photo_url')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.warn('Student fetch error:', error.message);
        return;
      }

      if (data?.photo_url) {
        setPhotoUrl(data.photo_url);
      }
    } catch (e) {
      console.error('Error fetching student photo:', e);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.container}>
        {/* Left side: title */}
        <Text style={styles.title}>Mizan Tepi University</Text>

        {/* Right side: student photo or fallback logo */}
        <Image
          source={
            photoUrl
              ? { uri: photoUrl }
              : require('../assets/images/placeholder_account.jpeg') // fallback logo
          }
          style={styles.logo}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: '#fff',
  },
  container: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 👈 aligns title left, image right
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    resizeMode: 'cover',
  },
});
