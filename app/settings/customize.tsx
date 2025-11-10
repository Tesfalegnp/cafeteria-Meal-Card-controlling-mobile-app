// // app/settings/customize.tsx
// import React, { useEffect, useState } from 'react';
// import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function Customize() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       const v = await AsyncStorage.getItem('pref_theme');
//       setDarkMode(v === 'dark');
//       setLoading(false);
//     })();
//   }, []);

//   const onToggle = async (val: boolean) => {
//     setDarkMode(val);
//     await AsyncStorage.setItem('pref_theme', val ? 'dark' : 'light');
//     Alert.alert('Saved', `Theme saved: ${val ? 'dark' : 'light'}`);
//   };

//   if (loading) return null;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Customize App</Text>
//       <View style={styles.row}>
//         <Text>Dark mode</Text>
//         <Switch value={darkMode} onValueChange={onToggle} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#f7f8fb' },
//   title: { fontSize: 20, fontWeight: '700', marginBottom: 18 },
//   row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
// });
// // app/settings/customize.tsx
// import React, { useEffect, useState } from 'react';
// import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function Customize() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       const v = await AsyncStorage.getItem('pref_theme');
//       setDarkMode(v === 'dark');
//       setLoading(false);
//     })();
//   }, []);

//   const onToggle = async (val: boolean) => {
//     setDarkMode(val);
//     await AsyncStorage.setItem('pref_theme', val ? 'dark' : 'light');
//     Alert.alert('Saved', `Theme saved: ${val ? 'dark' : 'light'}`);
//   };

//   if (loading) return null;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Customize App</Text>
//       <View style={styles.row}>
//         <Text>Dark mode</Text>
//         <Switch value={darkMode} onValueChange={onToggle} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#f7f8fb' },
//   title: { fontSize: 20, fontWeight: '700', marginBottom: 18 },
//   row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
// });
