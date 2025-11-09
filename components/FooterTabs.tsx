// components/FooterTabs.tsx
// Shared footer that appears above phone bottom bar. Uses expo-router to navigate
// so Settings can live outside the tabs folder while footer remains consistent.

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FooterTabs() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['bottom']} style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.tab} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="home-outline" size={22} />
          <Text style={styles.label}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab} onPress={() => router.push('/(tabs)/posts')}>
          <Ionicons name="newspaper-outline" size={22} />
          <Text style={styles.label}>Posts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab} onPress={() => router.push('/(tabs)/qrcode')}>
          <Ionicons name="qr-code-outline" size={22} />
          <Text style={styles.label}>QR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={22} />
          <Text style={styles.label}>Settings</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e6e6e6',
    paddingBottom: Platform.OS === 'ios' ? 10 : 6,
  },
  tab: { alignItems: 'center' },
  label: { fontSize: 11, marginTop: 2 },
});
