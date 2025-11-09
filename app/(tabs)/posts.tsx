// app/(tabs)/posts.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import { supabase } from '../../lib/supabaseClient';

// ----------------------------
// Type Definitions
// ----------------------------
type Post = {
  id: string;
  title: string;
  content?: string;
  likes_count?: number;
  dislikes_count?: number;
};

type Comment = {
  id: string;
  post_id: string;
  comment: string;
  created_at?: string;
  user_id?: string;
};

// ----------------------------
// Helper function to get current user id
// ----------------------------
import AsyncStorage from '@react-native-async-storage/async-storage';
async function getCurrentUserId() {
  try {
    let stored = await AsyncStorage.getItem('user_id');
    if (!stored) {
      stored = 'user-' + Math.floor(Math.random() * 1000000);
      await AsyncStorage.setItem('user_id', stored);
    }
    return stored;
  } catch (e) {
    return 'anonymous';
  }
}

// ----------------------------
// Posts Screen
// ----------------------------
export default function PostsScreen() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  // ----------------------------
  // Fetch all posts
  // ----------------------------
  async function fetchPosts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts(data || []);

      // fetch comments for each post
      for (const post of data || []) {
        fetchComments(post.id);
      }
    } catch (e) {
      console.error('fetchPosts error', e);
      Alert.alert('Error', 'Could not load posts');
    } finally {
      setLoading(false);
    }
  }

  // ----------------------------
  // Fetch comments for a post
  // ----------------------------
  async function fetchComments(postId: string) {
    try {
      const { data, error } = await supabase
        .from('posts_comment')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setCommentsByPost((prev) => ({ ...prev, [postId]: data || [] }));
    } catch (e) {
      console.warn('fetchComments', e);
    }
  }

  // ----------------------------
  // Handle reaction (like/dislike)
  // ----------------------------
  async function handleReaction(postId: string, type: 'like' | 'dislike') {
    const userId = await getCurrentUserId();

    try {
      const { error } = await supabase.from('post_reactions').upsert(
        {
          post_id: postId,
          user_id: userId,
          reaction_type: type,
        },
        { onConflict: ['post_id', 'user_id'] } // ✅ correct columns
      );

      if (error) throw error;

      await updatePostCounts(postId);
      fetchPosts();
    } catch (e) {
      console.warn('Reaction error', e);
      Alert.alert('Error', 'Could not save reaction');
    }
  }

  // ----------------------------
  // Update post likes/dislikes count
  // ----------------------------
  async function updatePostCounts(postId: string) {
    try {
      const { count: likes } = await supabase
        .from('post_reactions')
        .select('*', { count: 'exact', head: false })
        .eq('post_id', postId)
        .eq('reaction_type', 'like');

      const { count: dislikes } = await supabase
        .from('post_reactions')
        .select('*', { count: 'exact', head: false })
        .eq('post_id', postId)
        .eq('reaction_type', 'dislike');

      await supabase
        .from('posts')
        .update({ likes_count: likes ?? 0, dislikes_count: dislikes ?? 0 })
        .eq('id', postId);
    } catch (e) {
      console.warn('updatePostCounts error', e);
    }
  }

  // ----------------------------
  // Handle add comment
  // ----------------------------
  async function handleAddComment(postId: string) {
    const text = commentText[postId]?.trim();
    if (!text) return;

    const userId = await getCurrentUserId();

    try {
      const { error } = await supabase.from('posts_comment').insert({
        post_id: postId,
        comment: text,
        user_id: userId,
      });

      if (error) throw error;

      setCommentText((prev) => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
    } catch (e) {
      console.warn('addComment error', e);
      Alert.alert('Error', 'Could not save comment');
    }
  }

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  // ----------------------------
  // Render a single post
  // ----------------------------
  const renderPost = ({ item }: { item: Post }) => {
    const comments = commentsByPost[item.id] || [];

    return (
      <View style={styles.postCard}>
        <Text style={styles.postTitle}>{item.title}</Text>
        {item.content ? <Text style={styles.postContent}>{item.content}</Text> : null}

        <View style={styles.reactionRow}>
          <TouchableOpacity onPress={() => handleReaction(item.id, 'like')} style={styles.reactionBtn}>
            <Text>👍 {item.likes_count ?? 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleReaction(item.id, 'dislike')} style={styles.reactionBtn}>
            <Text>👎 {item.dislikes_count ?? 0}</Text>
          </TouchableOpacity>
        </View>

        {/* Comments */}
        <View style={styles.commentSection}>
          <Text style={styles.commentTitle}>Comments</Text>
          <ScrollView style={styles.commentsScroll}>
            {comments.map((c) => (
              <View key={c.id} style={styles.commentItem}>
                <Text>{c.comment}</Text>
                <Text style={styles.commentTime}>{c.created_at}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.addCommentRow}>
            <TextInput
              value={commentText[item.id] || ''}
              onChangeText={(t) => setCommentText((prev) => ({ ...prev, [item.id]: t }))}
              placeholder="Write a comment..."
              style={styles.commentInput}
            />
            <TouchableOpacity onPress={() => handleAddComment(item.id)} style={styles.sendBtn}>
              <Text style={{ color: '#fff' }}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderPost}
      contentContainerStyle={{ paddingBottom: 200 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

// ----------------------------
// Styles
// ----------------------------
const styles = StyleSheet.create({
  postCard: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  postTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  postContent: { fontSize: 15, marginBottom: 12 },
  reactionRow: { flexDirection: 'row', marginBottom: 10 },
  reactionBtn: { marginRight: 20 },
  commentSection: { borderTopWidth: 1, borderColor: '#eee', paddingTop: 8 },
  commentTitle: { fontWeight: '700', marginBottom: 6 },
  commentsScroll: { maxHeight: 150, marginBottom: 8 },
  commentItem: { paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  commentTime: { fontSize: 10, color: '#999' },
  addCommentRow: { flexDirection: 'row', alignItems: 'center' },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#2f95dc',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
