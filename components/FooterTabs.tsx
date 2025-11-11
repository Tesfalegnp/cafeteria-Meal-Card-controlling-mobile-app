import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FooterTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.tab} 
          onPress={() => router.push('/(tabs)')}
        >
          <Ionicons 
            name={isActive('/(tabs)') ? "home" : "home-outline"} 
            size={22} 
            color={isActive('/(tabs)') ? '#1e3c72' : '#666'} 
          />
          <Text style={[styles.label, isActive('/(tabs)') && styles.activeLabel]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tab} 
          onPress={() => router.push('/(tabs)/posts')}
        >
          <Ionicons 
            name={isActive('/(tabs)/posts') ? "newspaper" : "newspaper-outline"} 
            size={22} 
            color={isActive('/(tabs)/posts') ? '#1e3c72' : '#666'} 
          />
          <Text style={[styles.label, isActive('/(tabs)/posts') && styles.activeLabel]}>Posts</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tab} 
          onPress={() => router.push('/(tabs)/qrcode')}
        >
          <Ionicons 
            name={isActive('/(tabs)/qrcode') ? "qr-code" : "qr-code-outline"} 
            size={22} 
            color={isActive('/(tabs)/qrcode') ? '#1e3c72' : '#666'} 
          />
          <Text style={[styles.label, isActive('/(tabs)/qrcode') && styles.activeLabel]}>QR</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tab} 
          onPress={() => router.push('/settings')}
        >
          <Ionicons 
            name={isActive('/settings') ? "settings" : "settings-outline"} 
            size={22} 
            color={isActive('/settings') ? '#1e3c72' : '#666'} 
          />
          <Text style={[styles.label, isActive('/settings') && styles.activeLabel]}>Settings</Text>
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
  tab: { 
    alignItems: 'center' 
  },
  label: { 
    fontSize: 11, 
    marginTop: 2,
    color: '#666',
  },
  activeLabel: {
    color: '#1e3c72',
    fontWeight: '600',
  },
});