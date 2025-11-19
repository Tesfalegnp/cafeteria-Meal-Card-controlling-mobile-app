// Mobile_app/TCSS-3/app/_layout.tsx
import React from 'react';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import Header from '../components/Header';
import FooterTabs from '../components/FooterTabs';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '../contexts/AuthContext';
import AuthGuard from '../components/AuthGuard';

export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthGuard>
          <Header />
          <Stack>
            {/* Main tabs */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            
            {/* Settings routes */}
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            
            {/* Council routes */}
            <Stack.Screen 
              name="council/president-vice" 
              options={{ 
                title: 'President/Vice President',
                headerShown: false 
              }} 
            />
            <Stack.Screen 
              name="council/cafeteria-committee" 
              options={{ 
                title: 'Cafeteria Committee',
                headerShown: false 
              }} 
            />
            
            {/* Modal */}
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <FooterTabs />
          <StatusBar style="auto" />
        </AuthGuard>
      </ThemeProvider>
    </AuthProvider>
  );
}