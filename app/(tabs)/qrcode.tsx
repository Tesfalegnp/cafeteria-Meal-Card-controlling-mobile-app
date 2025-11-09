// app/(tabs)/qrcode.tsx
// Placeholder for future QR code implementation.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QRCodeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📷 QR Code feature coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#555',
  },
});
