// components/Header.tsx
// Shared app header: Mizan Tepi University title (left) + logo or student photo (right)

import React, { useEffect, useState } from 'react';
import { Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabaseClient';

export default function Header() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    fetchStudentData();
  }, []);

  // Fetch student's data from the students table
  async function fetchStudentData() {
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
        .select('photo_url, first_name, last_name')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.warn('Student fetch error:', error.message);
        return;
      }

      if (data?.photo_url) {
        setPhotoUrl(data.photo_url);
      }
      
      if (data?.first_name) {
        setUserName(`${data.first_name} ${data.last_name || ''}`.trim());
      }
    } catch (e) {
      console.error('Error fetching student data:', e);
    }
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#fff" 
        translucent={false}
      />
      <View style={styles.container}>
        {/* Left side: title and welcome message */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mizan Tepi University</Text>
          {userName ? (
            <Text style={styles.welcomeText}>Welcome, {userName}</Text>
          ) : null}
        </View>

        {/* Right side: student photo with fallback and status indicator */}
        <View style={styles.photoContainer}>
          <Image
            source={
              photoUrl
                ? { uri: photoUrl }
                : require('../assets/images/placeholder_account.jpeg')
            }
            style={styles.logo}
            onError={() => console.log('Error loading profile image')}
          />
          {/* Online status indicator */}
          <View style={styles.statusIndicator} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: '#fff',
  },
  container: {
    height: Platform.OS === 'ios' ? 70 : 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  welcomeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400',
  },
  photoContainer: {
    position: 'relative',
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    resizeMode: 'cover',
    borderWidth: 1.5,
    borderColor: '#e1e5e9',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50', // Green for online status
    borderWidth: 1.5,
    borderColor: '#fff',
  },
});