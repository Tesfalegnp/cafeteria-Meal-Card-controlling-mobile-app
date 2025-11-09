// components/PostCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


type Post = {
id: string;
title: string;
content?: string;
likes_count?: number | null;
dislikes_count?: number | null;
created_at?: string | null;
};


export default function PostCard({ post, onLike, onDislike, onOpenComments }: { post: Post; onLike: () => void; onDislike: () => void; onOpenComments: () => void; }) {
return (
<View style={styles.card}>
<Text style={styles.title}>{post.title}</Text>
{post.content ? <Text style={styles.content}>{post.content}</Text> : null}


<View style={styles.row}>
<TouchableOpacity onPress={onLike} style={styles.action}>
<Text>👍 {post.likes_count ?? 0}</Text>
</TouchableOpacity>
<TouchableOpacity onPress={onDislike} style={styles.action}>
<Text>👎 {post.dislikes_count ?? 0}</Text>
</TouchableOpacity>
<TouchableOpacity onPress={onOpenComments} style={styles.action}>
<Text>💬 Comments</Text>
</TouchableOpacity>
</View>
</View>
);
}


const styles = StyleSheet.create({
card: { padding: 12, borderRadius: 8, backgroundColor: '#fff', marginVertical: 8, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4 },
title: { fontSize: 16, fontWeight: '700' },
content: { marginTop: 8, color: '#444' },
row: { marginTop: 12, flexDirection: 'row' },
action: { marginRight: 16 },
});