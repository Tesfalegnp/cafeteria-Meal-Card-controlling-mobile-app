// // app/settings/profile.tsx
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   ScrollView,
//   Image,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { supabase } from '../../lib/supabaseClient';
// import Header from '../_components/HeaderPlaceholderIfNeeded'; // optional, skip if you have app-level header
// import { useRouter } from 'expo-router';

// export default function ProfileScreen() {
//   const router = useRouter();
//   const [student, setStudent] = useState<any | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const sid = await AsyncStorage.getItem('studentId');
//       if (!sid) {
//         router.replace('/(tabs)/settings'); // go to login gate
//         return;
//       }
//       await load(sid);
//     })();
//   }, []);

//   const load = async (studentId: string) => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase.from('students').select('*').eq('student_id', studentId).single();
//       if (error) {
//         console.warn(error);
//         Alert.alert('Error', 'Could not load profile.');
//       } else {
//         setStudent(data);
//       }
//     } catch (err) {
//       console.warn(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const save = async () => {
//     if (!student) return;
//     setLoading(true);
//     try {
//       // Only allow editing limited fields (as requested)
//       const updates: any = {
//         email: student.email,
//         phone: student.phone,
//         photo_url: student.photo_url,
//         // you can add other editable fields here
//       };
//       const { error } = await supabase.from('students').update(updates).eq('student_id', student.student_id);
//       if (error) throw error;
//       Alert.alert('Saved');
//       setEditing(false);
//       await load(student.student_id);
//     } catch (err: any) {
//       console.warn(err);
//       Alert.alert('Save error', err?.message ?? String(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2f95dc" />;

//   if (!student) return null;

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
//         <Image
//           source={student.photo_url ? { uri: student.photo_url } : require('../../../assets/images/placeholder_account.jpeg')}
//           style={{ width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 12 }}
//         />
//         <Text style={{ fontWeight: '700', fontSize: 18, textAlign: 'center' }}>
//           {student.first_name} {student.middle_name ?? ''} {student.last_name ?? ''}
//         </Text>
//         <Text style={{ color: '#666', textAlign: 'center', marginBottom: 12 }}>{student.student_id}</Text>

//         <Text>Email</Text>
//         <TextInput
//           style={styles.input}
//           value={student.email ?? ''}
//           onChangeText={(t) => setStudent({ ...student, email: t })}
//           editable={editing}
//         />

//         <Text>Phone</Text>
//         <TextInput
//           style={styles.input}
//           value={String(student.phone ?? '')}
//           onChangeText={(t) => setStudent({ ...student, phone: t })}
//           editable={editing}
//         />

//         <View style={{ marginTop: 12 }}>
//           {editing ? (
//             <>
//               <Button title="Save changes" onPress={save} />
//               <View style={{ height: 8 }} />
//               <Button title="Cancel" onPress={() => setEditing(false)} color="#999" />
//             </>
//           ) : (
//             <Button title="Edit profile" onPress={() => setEditing(true)} />
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f7f8fb' },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 10,
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     marginBottom: 12,
//   },
// });
