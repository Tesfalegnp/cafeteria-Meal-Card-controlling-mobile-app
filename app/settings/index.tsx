import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabaseClient';

export default function SettingsMain() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const studentId = await AsyncStorage.getItem('studentId');
    if (!studentId) {
      router.replace('/settings/login');
    } else {
      // already logged in, redirect to dashboard/profile
      router.replace('/settings/profile');
    }
    setLoading(false);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2f95dc" />;
  return <View />;
}
