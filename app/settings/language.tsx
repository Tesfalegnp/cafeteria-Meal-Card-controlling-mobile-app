import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function LanguageScreen() {
  const [language, setLanguage] = useState('English');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Language</Text>
      <Text style={styles.subtitle}>Select your preferred app language.</Text>

      {['English', 'Amharic', 'Oromo', 'Tigrigna'].map((lang) => (
        <TouchableOpacity
          key={lang}
          style={[
            styles.button,
            language === lang && { backgroundColor: '#1a73e8' },
          ]}
          onPress={() => setLanguage(lang)}
        >
          <Text style={styles.buttonText}>{lang}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.current}>Current: {language}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  button: { marginTop: 12, backgroundColor: '#2f95dc', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  current: { marginTop: 20, fontSize: 16, fontWeight: '500' },
});
