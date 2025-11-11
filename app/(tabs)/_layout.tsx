import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // hidden, we use shared FooterTabs
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="posts" />
      <Tabs.Screen name="qrcode" />
      <Tabs.Screen name="rule_regulation" />
    </Tabs>
  );
}