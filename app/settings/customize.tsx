// app/settings/customize.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
};

type FontSize = 'small' | 'medium' | 'large';

const THEME_PRESETS = {
  light: {
    primary: '#2f95dc',
    secondary: '#ff6b6b',
    background: '#f7f8fb',
    card: '#ffffff',
    text: '#333333',
    border: '#dddddd'
  },
  dark: {
    primary: '#4a9ee0',
    secondary: '#ff8585',
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#333333'
  },
  blue: {
    primary: '#2196f3',
    secondary: '#ff9800',
    background: '#e3f2fd',
    card: '#ffffff',
    text: '#1976d2',
    border: '#bbdefb'
  },
  green: {
    primary: '#4caf50',
    secondary: '#ff5722',
    background: '#e8f5e8',
    card: '#ffffff',
    text: '#2e7d32',
    border: '#c8e6c9'
  },
  purple: {
    primary: '#9c27b0',
    secondary: '#ffeb3b',
    background: '#f3e5f5',
    card: '#ffffff',
    text: '#7b1fa2',
    border: '#e1bee7'
  }
};

const FONT_SIZES = {
  small: {
    title: 18,
    body: 14,
    small: 12
  },
  medium: {
    title: 20,
    body: 16,
    small: 14
  },
  large: {
    title: 24,
    body: 18,
    small: 16
  }
};

export default function Customize() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'blue' | 'green' | 'purple'>('light');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [notifications, setNotifications] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState<'en' | 'es' | 'fr'>('en');
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const [
        theme,
        font,
        notifs,
        biometric,
        autoSavePref,
        lang,
        haptic
      ] = await Promise.all([
        AsyncStorage.getItem('pref_theme'),
        AsyncStorage.getItem('pref_fontSize'),
        AsyncStorage.getItem('pref_notifications'),
        AsyncStorage.getItem('pref_biometric'),
        AsyncStorage.getItem('pref_autoSave'),
        AsyncStorage.getItem('pref_language'),
        AsyncStorage.getItem('pref_haptic')
      ]);

      setDarkMode(theme === 'dark');
      setSelectedTheme((theme as any) || 'light');
      setFontSize((font as FontSize) || 'medium');
      setNotifications(notifs !== 'false');
      setBiometricAuth(biometric === 'true');
      setAutoSave(autoSavePref !== 'false');
      setLanguage((lang as any) || 'en');
      setHapticFeedback(haptic !== 'false');
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreference = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch (error) {
      console.error('Error saving preference:', error);
      Alert.alert('Error', 'Failed to save preference');
    }
  };

  const handleThemeToggle = async (val: boolean) => {
    setDarkMode(val);
    const theme = val ? 'dark' : 'light';
    setSelectedTheme(theme);
    await savePreference('pref_theme', theme);
  };

  const handleThemeSelect = async (theme: keyof typeof THEME_PRESETS) => {
    setSelectedTheme(theme);
    setDarkMode(theme === 'dark');
    await savePreference('pref_theme', theme);
  };

  const handleFontSizeChange = async (size: FontSize) => {
    setFontSize(size);
    await savePreference('pref_fontSize', size);
  };

  const handleNotificationsToggle = async (val: boolean) => {
    setNotifications(val);
    await savePreference('pref_notifications', val);
  };

  const handleBiometricToggle = async (val: boolean) => {
    setBiometricAuth(val);
    await savePreference('pref_biometric', val);
  };

  const handleAutoSaveToggle = async (val: boolean) => {
    setAutoSave(val);
    await savePreference('pref_autoSave', val);
  };

  const handleLanguageChange = async (lang: 'en' | 'es' | 'fr') => {
    setLanguage(lang);
    await savePreference('pref_language', lang);
  };

  const handleHapticToggle = async (val: boolean) => {
    setHapticFeedback(val);
    await savePreference('pref_haptic', val);
  };

  const resetToDefaults = async () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setDarkMode(false);
            setSelectedTheme('light');
            setFontSize('medium');
            setNotifications(true);
            setBiometricAuth(false);
            setAutoSave(true);
            setLanguage('en');
            setHapticFeedback(true);

            await Promise.all([
              AsyncStorage.setItem('pref_theme', 'light'),
              AsyncStorage.setItem('pref_fontSize', 'medium'),
              AsyncStorage.setItem('pref_notifications', 'true'),
              AsyncStorage.setItem('pref_biometric', 'false'),
              AsyncStorage.setItem('pref_autoSave', 'true'),
              AsyncStorage.setItem('pref_language', 'en'),
              AsyncStorage.setItem('pref_haptic', 'true')
            ]);

            Alert.alert('Success', 'All settings have been reset to default');
          }
        }
      ]
    );
  };

  const currentTheme = THEME_PRESETS[selectedTheme];
  const currentFontSize = FONT_SIZES[fontSize];

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: currentTheme.background }]}>
        <ActivityIndicator size="large" color={currentTheme.primary} />
        <Text style={[styles.loadingText, { color: currentTheme.text }]}>Loading preferences...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: currentTheme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: currentTheme.text, fontSize: currentFontSize.title }]}>
        Customize App
      </Text>

      {/* Theme Selection */}
      <View style={[styles.section, { backgroundColor: currentTheme.card }]}>
        <Text style={[styles.sectionTitle, { color: currentTheme.text, fontSize: currentFontSize.body }]}>
          Theme & Appearance
        </Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={[styles.settingLabel, { color: currentTheme.text, fontSize: currentFontSize.body }]}>
              Dark Mode
            </Text>
            <Text style={[styles.settingDescription, { color: currentTheme.text, fontSize: currentFontSize.small }]}>
              Switch between light and dark themes
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={handleThemeToggle}
            trackColor={{ false: currentTheme.border, true: currentTheme.primary }}
            thumbColor={darkMode ? currentTheme.secondary : '#f4f3f4'}
          />
        </View>

        <View style={styles.themeContainer}>
          <Text style={[styles.themeLabel, { color: currentTheme.text, fontSize: currentFontSize.body }]}>
            Theme Colors
          </Text>
          <View style={styles.themeGrid}>
            {Object.entries(THEME_PRESETS).map(([key, theme]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: theme.primary,
                    borderColor: selectedTheme === key ? currentTheme.secondary : currentTheme.border,
                    borderWidth: selectedTheme === key ? 3 : 1
                  }
                ]}
                onPress={() => handleThemeSelect(key as any)}
              >
                <View style={styles.themePreview}>
                  <View style={[styles.themePreviewTop, { backgroundColor: theme.card }]} />
                  <View style={[styles.themePreviewBottom, { backgroundColor: theme.background }]} />
                </View>
                <Text style={styles.themeName}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={[styles.settingLabel, { color: currentTheme.text, fontSize: currentFontSize.body }]}>
              Font Size
            </Text>
            <Text style={[styles.settingDescription, { color: currentTheme.text, fontSize: currentFontSize.small }]}>
              Adjust text size throughout the app
            </Text>
          </View>
          <View style={styles.fontSizeButtons}>
            {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.fontSizeButton,
                  {
                    backgroundColor: fontSize === size ? currentTheme.primary : currentTheme.background,
                    borderColor: currentTheme.border
                  }
                ]}
                onPress={() => handleFontSizeChange(size)}
              >
                <Text
                  style={[
                    styles.fontSizeButtonText,
                    {
                      color: fontSize === size ? '#fff' : currentTheme.text,
                      fontSize: FONT_SIZES[size].small
                    }
                  ]}
                >
                  A
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Preferences */}
      <View style={[styles.section, { backgroundColor: currentTheme.card }]}>
        <Text style={[styles.sectionTitle, { color: currentTheme.text, fontSize: currentFontSize.body }]}>
          Preferences
        </Text>

        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={[styles.settingLabel, { color: currentTheme.text, fontSize: currentFontSize.body }]}>
              Push Notifications
            </Text>
            <Text style={[styles.settingDescription, { color: currentTheme.text, fontSize: currentFontSize.small }]}>
              Receive important updates and alerts
            </Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={handleNotificationsToggle}
            trackColor={{ false: currentTheme.border, true: currentTheme.primary }}
            thumbColor={notifications ? currentTheme.secondary : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={[styles.settingLabel, { color: currentTheme.text, fontSize: currentFontSize.body }]}>
              Biometric Authentication
            </Text>
            <Text style={[styles.settingDescription, { color: currentTheme.text, fontSize: currentFontSize.small }]}>
              Use fingerprint or face ID for login
            </Text>
          </View>
          <Switch
            value={biometricAuth}
            onValueChange={handleBiometricToggle}
            trackColor={{ false: currentTheme.border, true: currentTheme.primary }}
            thumbColor={biometricAuth ? currentTheme.secondary : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={[styles.settingLabel, { color: currentTheme.text, fontSize: currentFontSize.body }]}>
              Auto-save Changes
            </Text>
            <Text style={[styles.settingDescription, { color: currentTheme.text, fontSize: currentFontSize.small }]}>
              Automatically save profile changes
            </Text>
          </View>
          <Switch
            value={autoSave}
            onValueChange={handleAutoSaveToggle}
            trackColor={{ false: currentTheme.border, true: currentTheme.primary }}
            thumbColor={autoSave ? currentTheme.secondary : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={[styles.settingLabel, { color: currentTheme.text, fontSize: currentFontSize.body }]}>
              Haptic Feedback
            </Text>
            <Text style={[styles.settingDescription, { color: currentTheme.text, fontSize: currentFontSize.small }]}>
              Vibrate on interactions
            </Text>
          </View>
          <Switch
            value={hapticFeedback}
            onValueChange={handleHapticToggle}
            trackColor={{ false: currentTheme.border, true: currentTheme.primary }}
            thumbColor={hapticFeedback ? currentTheme.secondary : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Language */}
      <View style={[styles.section, { backgroundColor: currentTheme.card }]}>
        <Text style={[styles.sectionTitle, { color: currentTheme.text, fontSize: currentFontSize.body }]}>
          Language
        </Text>
        <View style={styles.languageButtons}>
          {[
            { code: 'en', name: 'English' },
            { code: 'es', name: 'Español' },
            { code: 'fr', name: 'Français' }
          ].map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                {
                  backgroundColor: language === lang.code ? currentTheme.primary : currentTheme.background,
                  borderColor: currentTheme.border
                }
              ]}
              onPress={() => handleLanguageChange(lang.code as any)}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  {
                    color: language === lang.code ? '#fff' : currentTheme.text,
                    fontSize: currentFontSize.body
                  }
                ]}
              >
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Reset Section */}
      <View style={[styles.section, { backgroundColor: currentTheme.card }]}>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: currentTheme.secondary }]}
          onPress={resetToDefaults}
        >
          <Text style={[styles.resetButtonText, { color: '#fff', fontSize: currentFontSize.body }]}>
            Reset to Default Settings
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: currentTheme.text, fontSize: currentFontSize.small }]}>
          Changes will be applied across the app
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    opacity: 0.7,
  },
  themeContainer: {
    marginTop: 8,
  },
  themeLabel: {
    fontWeight: '600',
    marginBottom: 12,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeOption: {
    width: '48%',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  themePreview: {
    width: 60,
    height: 40,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  themePreviewTop: {
    height: '30%',
  },
  themePreviewBottom: {
    height: '70%',
  },
  themeName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  fontSizeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  fontSizeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSizeButtonText: {
    fontWeight: 'bold',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  languageButtonText: {
    fontWeight: '600',
  },
  resetButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  footerText: {
    opacity: 0.7,
    textAlign: 'center',
  },
});