// components/CommentList.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';


export default function CommentList({ comments, onAddComment }: { comments: Array<{ id: string; comment: string }>; onAddComment: (text: string) => void; }) {
const [text, setText] = useState('');


return (
<View style={{ marginTop: 12 }}>
<FlatList data={comments} keyExtractor={(i) => i.id} renderItem={({ item }) => (<View style={styles.comment}><Text>{item.comment}</Text></View>)} style={{ maxHeight: 200 }} />


<View style={styles.inputRow}>
<TextInput placeholder="Write a comment..." value={text} onChangeText={setText} style={styles.input} />
<TouchableOpacity style={styles.send} onPress={() => { if (text.trim()) { onAddComment(text.trim()); setText(''); } }}>
<Text>Send</Text>
</TouchableOpacity>
</View>
</View>
);
}


const styles = StyleSheet.create({
inputRow: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
input: { flex: 1, borderWidth: StyleSheet.hairlineWidth, borderColor: '#ddd', borderRadius: 8, padding: 8 },
send: { marginLeft: 8, paddingHorizontal: 12, paddingVertical: 8 },
comment: { padding: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' },
});