// app/(tabs)/posts.tsx
import React, { useEffect, useState, useRef } from 'react';
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
  Image,
  RefreshControl,
  Animated,
} from 'react-native';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ----------------------------
// Type Definitions
// ----------------------------
type Post = {
  id: string;
  title: string;
  content?: string;
  likes_count?: number;
  dislikes_count?: number;
  view_count?: number;
  image_url?: string;
  created_at: string;
  author_id?: string;
  allow_comments?: boolean;
};

type Comment = {
  id: string;
  post_id: string;
  comment: string;
  created_at?: string;
  user_id?: string;
};

// ----------------------------
// Helper functions
// ----------------------------
async function getCurrentUserId() {
  try {
    // First try to get student ID from login
    const studentId = await AsyncStorage.getItem('studentId');
    if (studentId) return studentId;
    
    // Fallback to anonymous user (like your working code)
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

async function checkLoginForInteraction() {
  const studentId = await AsyncStorage.getItem('studentId');
  if (!studentId) {
    Alert.alert('Login Required', 'Please login to interact with posts');
    return false;
  }
  return true;
}

// Format date to relative time
function formatRelativeTime(dateString: string) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  } catch (e) {
    return 'Recently';
  }
}

// ----------------------------
// Post Item Component
// ----------------------------
function PostItem({ 
  item, 
  comments, 
  commentText, 
  onReaction, 
  onAddComment, 
  onCommentChange,
  onViewPost 
}: { 
  item: Post;
  comments: Comment[];
  commentText: string;
  onReaction: (postId: string, type: 'like' | 'dislike') => void;
  onAddComment: (postId: string) => void;
  onCommentChange: (postId: string, text: string) => void;
  onViewPost: (postId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    if (!expanded) {
      onViewPost(item.id);
    }
    setExpanded(!expanded);
  };

  return (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.postMeta}>
          <Text style={styles.postTime}>{formatRelativeTime(item.created_at)}</Text>
          <View style={styles.viewCount}>
            <Ionicons name="eye-outline" size={14} color="#666" />
            <Text style={styles.viewCountText}>{item.view_count || 0}</Text>
          </View>
        </View>
      </View>

      {/* Post Title */}
      <Text style={styles.postTitle}>{item.title}</Text>

      {/* Post Content with Read More */}
      {item.content && (
        <View>
          <Text 
            style={styles.postContent}
            numberOfLines={expanded ? undefined : 3}
          >
            {item.content}
          </Text>
          {item.content.length > 150 && (
            <TouchableOpacity onPress={handleExpand}>
              <Text style={styles.readMore}>
                {expanded ? 'Read less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Post Image */}
      {item.image_url && (
        <Image 
          source={{ uri: item.image_url }} 
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      {/* Reaction Stats */}
      <View style={styles.reactionStats}>
        <View style={styles.statItem}>
          <Ionicons name="thumbs-up" size={16} color="#4ECDC4" />
          <Text style={styles.statText}>{item.likes_count || 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="thumbs-down" size={16} color="#FF6B6B" />
          <Text style={styles.statText}>{item.dislikes_count || 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="chatbubble-outline" size={16} color="#45B7D1" />
          <Text style={styles.statText}>{comments.length}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="eye-outline" size={16} color="#667eea" />
          <Text style={styles.statText}>{item.view_count || 0}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onReaction(item.id, 'like')}
        >
          <Ionicons name="thumbs-up-outline" size={20} color="#4ECDC4" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onReaction(item.id, 'dislike')}
        >
          <Ionicons name="thumbs-down-outline" size={20} color="#FF6B6B" />
          <Text style={styles.actionText}>Dislike</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleExpand}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#45B7D1" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color="#FECA57" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      {expanded && (
        <View style={styles.commentSection}>
          <Text style={styles.commentTitle}>Comments ({comments.length})</Text>
          
          <ScrollView style={styles.commentsScroll} showsVerticalScrollIndicator={false}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>User</Text>
                  <Text style={styles.commentTime}>
                    {formatRelativeTime(comment.created_at || '')}
                  </Text>
                </View>
                <Text style={styles.commentText}>{comment.comment}</Text>
              </View>
            ))}
            
            {comments.length === 0 && (
              <Text style={styles.noComments}>No comments yet. Be the first to comment!</Text>
            )}
          </ScrollView>

          {/* Add Comment */}
          <View style={styles.addCommentRow}>
            <TextInput
              value={commentText}
              onChangeText={(text) => onCommentChange(item.id, text)}
              placeholder="Write a comment..."
              style={styles.commentInput}
              multiline
              placeholderTextColor="#999"
            />
            <TouchableOpacity 
              onPress={() => onAddComment(item.id)}
              style={[
                styles.sendBtn,
                !commentText.trim() && styles.sendBtnDisabled
              ]}
              disabled={!commentText.trim()}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// Create animated FlatList component
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// ----------------------------
// Posts Screen
// ----------------------------
export default function PostsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  
  // Animation values for header
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -120],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPosts().then(() => setRefreshing(false));
  }, []);

  // Handle scroll event
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  // ----------------------------
  // Fetch all posts (same as your working code)
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
  // Fetch comments for a post (same as your working code)
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
  // Handle view post (increment view count) - NEW FEATURE
  // ----------------------------
  async function handleViewPost(postId: string) {
    try {
      // Try to use the RPC function first
      const { error } = await supabase.rpc('increment_view_count', {
        post_id: postId
      });

      if (error) {
        console.log('RPC failed, using direct update');
        // Fallback: direct update (like your working code style)
        const currentPost = posts.find(p => p.id === postId);
        const newViewCount = (currentPost?.view_count || 0) + 1;
        
        await supabase
          .from('posts')
          .update({ view_count: newViewCount })
          .eq('id', postId);
      }

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, view_count: (post.view_count || 0) + 1 }
          : post
      ));
    } catch (e) {
      console.warn('View count error', e);
    }
  }

  // ----------------------------
  // Handle reaction (like/dislike) - with login check
  // ----------------------------
  async function handleReaction(postId: string, type: 'like' | 'dislike') {
    const isLoggedIn = await checkLoginForInteraction();
    if (!isLoggedIn) {
      router.push('/settings/login');
      return;
    }

    const userId = await getCurrentUserId();

    try {
      const { error } = await supabase.from('post_reactions').upsert(
        {
          post_id: postId,
          user_id: userId,
          reaction_type: type,
        },
        { onConflict: ['post_id', 'user_id'] } 
      );

      if (error) throw error;

      await updatePostCounts(postId);
      fetchPosts(); // Refresh posts to get updated counts
    } catch (e) {
      console.warn('Reaction error', e);
      Alert.alert('Error', 'Could not save reaction');
    }
  }

  // ----------------------------
  // Update post likes/dislikes count (same as your working code)
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
  // Handle add comment - with login check
  // ----------------------------
  async function handleAddComment(postId: string) {
    const isLoggedIn = await checkLoginForInteraction();
    if (!isLoggedIn) {
      router.push('/settings/login');
      return;
    }

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

  // ----------------------------
  // Handle comment text change
  // ----------------------------
  function handleCommentChange(postId: string, text: string) {
    setCommentText((prev) => ({ ...prev, [postId]: text }));
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2a5298" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }]
          }
        ]}
      >
        <LinearGradient
          colors={['#1e3c72', '#2a5298']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Campus Posts</Text>
            <Text style={styles.headerSubtitle}>Stay updated with campus news</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Posts List - Using AnimatedFlatList instead of regular FlatList */}
      <AnimatedFlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostItem
            item={item}
            comments={commentsByPost[item.id] || []}
            commentText={commentText[item.id] || ''}
            onReaction={handleReaction}
            onAddComment={handleAddComment}
            onCommentChange={handleCommentChange}
            onViewPost={handleViewPost}
          />
        )}
        contentContainerStyle={styles.postsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2a5298']}
            tintColor="#2a5298"
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="newspaper-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Posts Yet</Text>
            <Text style={styles.emptyText}>
              Check back later for campus updates and announcements
            </Text>
          </View>
        }
      />
    </View>
  );
}

// ----------------------------
// Enhanced Modern Styles
// ----------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerGradient: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  postsList: {
    paddingTop: 120, // Space for the animated header
    paddingBottom: 20,
  },
  postCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  postHeader: {
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postTime: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  viewCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewCountText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
    lineHeight: 24,
  },
  postContent: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 20,
    marginBottom: 8,
  },
  readMore: {
    color: '#2a5298',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },
  reactionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ecf0f1',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 6,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    minWidth: 70,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 4,
  },
  commentSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#ecf0f1',
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
  },
  commentsScroll: {
    maxHeight: 200,
    marginBottom: 12,
  },
  commentItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  commentTime: {
    fontSize: 11,
    color: '#7f8c8d',
  },
  commentText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 18,
  },
  noComments: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  addCommentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    marginRight: 8,
    backgroundColor: '#f8f9fa',
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: '#2a5298',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#ccc',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
});