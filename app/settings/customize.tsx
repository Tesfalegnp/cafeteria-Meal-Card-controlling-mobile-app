import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CustomizeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customize App</Text>
      <Text style={styles.subtitle}>Change theme or adjust app appearance.</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Light Theme</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Dark Theme</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Font Size</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  button: { marginTop: 12, backgroundColor: '#2f95dc', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
