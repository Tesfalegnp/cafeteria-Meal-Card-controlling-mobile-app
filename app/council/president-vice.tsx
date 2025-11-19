// Mobile_app/TCSS-3/app/council/president-vice.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

interface FoodInventory {
  id: string;
  food_item: string;
  quantity: number;
  unit: string;
  current_stock: number;
  min_stock_level: number;
  category: string;
  status: string;
  approved_by_committee: boolean;
  approved_by_president: boolean;
  created_at: string;
  supplier: string;
  consumption_per_student: number;
  registered_by: string;
  storage_condition: string;
}

interface StockRemainItem {
  id: string;
  food_item: string;
  current_stock: number;
  unit: string;
  min_stock_level: number;
  category: string;
  consumption_per_student: number;
  predicted_days: number;
  weekly_requirement: number;
  stock_status: 'critical' | 'low' | 'warning' | 'good';
}

interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  likes_count: number;
  view_count: number;
  is_active: boolean;
}

const { width } = Dimensions.get('window');

export default function PresidentViceScreen() {
  const { student, councilMember } = useAuth();
  const [activeTab, setActiveTab] = useState<'inventory' | 'posts' | 'stock' | 'create'>('inventory');
  const [inventory, setInventory] = useState<FoodInventory[]>([]);
  const [stockRemain, setStockRemain] = useState<StockRemainItem[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
    fetchStudentsCount();
  }, [activeTab]);

  const fetchStudentsCount = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('student_id', { count: 'exact' });
      
      if (!error && data) {
        setStudentsCount(data.length || 0);
      }
    } catch (error) {
      console.error('Error fetching students count:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'inventory') {
        await loadPendingApproval();
      } else if (activeTab === 'posts') {
        await loadPosts();
      } else if (activeTab === 'stock') {
        await loadStockRemain();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadPendingApproval = async () => {
    const { data, error } = await supabase
      .from('food_inventory')
      .select('*')
      .eq('approved_by_committee', true)
      .eq('approved_by_president', false)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading inventory:', error);
      if (error.code === '42703') {
        Alert.alert(
          'Database Update Required',
          'Please contact administrator to update database schema with approval columns.'
        );
        setInventory([]);
        return;
      }
      throw error;
    }
    setInventory(data || []);
  };

  const loadStockRemain = async () => {
    try {
      const { data: inventoryData, error } = await supabase
        .from('food_inventory')
        .select('*')
        .eq('approved_by_committee', true)
        .eq('approved_by_president', true)
        .eq('status', 'active')
        .order('food_item');

      if (error) throw error;

      const stockWithPredictions = (inventoryData || []).map(item => {
        const predictedDays = calculatePredictedDays(item);
        const weeklyRequirement = calculateWeeklyRequirement(item);
        const stockStatus = getStockStatus(item, predictedDays);
        
        return {
          id: item.id,
          food_item: item.food_item,
          current_stock: item.current_stock,
          unit: item.unit,
          min_stock_level: item.min_stock_level,
          category: item.category,
          consumption_per_student: item.consumption_per_student,
          predicted_days: predictedDays,
          weekly_requirement: weeklyRequirement,
          stock_status: stockStatus
        };
      });

      setStockRemain(stockWithPredictions);
    } catch (error) {
      console.error('Error loading stock remain:', error);
      Alert.alert('Error', 'Failed to load stock analysis');
    }
  };

  const calculatePredictedDays = (item: FoodInventory) => {
    if (!item.consumption_per_student || studentsCount === 0) return 0;
    const dailyConsumption = item.consumption_per_student * studentsCount * 3;
    return dailyConsumption > 0 ? Math.floor(item.current_stock / dailyConsumption) : 0;
  };

  const calculateWeeklyRequirement = (item: FoodInventory) => {
    if (!item.consumption_per_student || studentsCount === 0) return 0;
    return item.consumption_per_student * studentsCount * 21;
  };

  const getStockStatus = (item: FoodInventory, predictedDays: number) => {
    const minStockLevel = item.min_stock_level || 0;
    
    if (item.current_stock <= minStockLevel * 0.3) {
      return 'critical';
    } else if (item.current_stock <= minStockLevel) {
      return 'low';
    } else if (predictedDays <= 7) {
      return 'warning';
    } else {
      return 'good';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#dc3545';
      case 'low': return '#fd7e14';
      case 'warning': return '#ffc107';
      case 'good': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return '🚨';
      case 'low': return '⚠️';
      case 'warning': return '🔔';
      case 'good': return '✅';
      default: return '📦';
    }
  };

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setPosts(data || []);
  };

  const approveInventory = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('food_inventory')
        .update({ 
          approved_by_president: true,
          president_approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) throw error;

      Alert.alert('Success', 'Item approved successfully! It will now appear in stock reports.');
      await loadPendingApproval();
    } catch (error) {
      console.error('Error approving item:', error);
      Alert.alert('Error', 'Failed to approve item');
    }
  };

  const rejectInventory = async (itemId: string) => {
    Alert.alert(
      'Reject Item',
      'Are you sure you want to reject this item? It will be removed from pending approvals.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('food_inventory')
                .update({ 
                  status: 'rejected',
                  updated_at: new Date().toISOString()
                })
                .eq('id', itemId);

              if (error) throw error;

              Alert.alert('Success', 'Item rejected successfully');
              await loadPendingApproval();
            } catch (error) {
              console.error('Error rejecting item:', error);
              Alert.alert('Error', 'Failed to reject item');
            }
          },
        },
      ]
    );
  };

  const createPost = async () => {
    if (!postForm.title.trim() || !postForm.content.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('posts')
        .insert({
          title: postForm.title,
          content: postForm.content,
          author_id: student?.student_id,
          created_at: new Date().toISOString(),
          likes_count: 0,
          dislikes_count: 0,
          view_count: 0,
          is_active: true,
          allow_comments: true
        });

      if (error) throw error;

      Alert.alert('Success', 'Post created successfully');
      setShowPostModal(false);
      setPostForm({ title: '', content: '' });
      setActiveTab('posts');
      await loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getCriticalItemsCount = () => {
    return stockRemain.filter(item => item.stock_status === 'critical').length;
  };

  const getLowItemsCount = () => {
    return stockRemain.filter(item => item.stock_status === 'low').length;
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e3c72" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {councilMember?.position} Dashboard
        </Text>
        <Text style={styles.subtitle}>
          Welcome, {student?.first_name}
        </Text>
        <Text style={styles.roleDescription}>
          Final approval for inventory items, news posts, and stock monitoring
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'inventory' && styles.activeTab]}
          onPress={() => setActiveTab('inventory')}
        >
          <Text style={[styles.tabText, activeTab === 'inventory' && styles.activeTabText]}>
            Pending ({inventory.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stock' && styles.activeTab]}
          onPress={() => setActiveTab('stock')}
        >
          <Text style={[styles.tabText, activeTab === 'stock' && styles.activeTabText]}>
            Stock
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && styles.activeTab]}
          onPress={() => setShowPostModal(true)}
        >
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
            Create
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'inventory' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items Approved by Committee - Awaiting Your Final Approval</Text>
            
            {inventory.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No items pending final approval</Text>
                <Text style={styles.emptySubtext}>
                  All committee-approved items have been processed
                </Text>
              </View>
            ) : (
              inventory.map((item) => (
                <View key={item.id} style={styles.inventoryCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.itemName}>{item.food_item}</Text>
                    <View style={styles.committeeBadge}>
                      <Text style={styles.badgeText}>Committee Approved</Text>
                    </View>
                  </View>
                  
                  <View style={styles.itemDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Current Stock:</Text>
                      <Text style={styles.detailValue}>
                        {item.current_stock} {item.unit}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Category:</Text>
                      <Text style={styles.detailValue}>{item.category}</Text>
                    </View>
                    {item.supplier && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Supplier:</Text>
                        <Text style={styles.detailValue}>{item.supplier}</Text>
                      </View>
                    )}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Consumption Rate:</Text>
                      <Text style={styles.detailValue}>
                        {item.consumption_per_student} {item.unit}/student
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => rejectInventory(item.id)}
                    >
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => approveInventory(item.id)}
                    >
                      <Text style={styles.approveButtonText}>Final Approve</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'posts' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Latest News & Announcements</Text>
            {posts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No posts yet</Text>
                <Text style={styles.emptySubtext}>
                  Create the first announcement for students
                </Text>
              </View>
            ) : (
              posts.map((post) => (
                <View key={post.id} style={styles.postCard}>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postContent} numberOfLines={3}>
                    {post.content}
                  </Text>
                  <Text style={styles.postMeta}>
                    {new Date(post.created_at).toLocaleDateString()} • 
                    Views: {post.view_count} • 
                    Likes: {post.likes_count}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'stock' && (
          <View style={styles.section}>
            {/* Stock Summary */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryNumber}>{stockRemain.length}</Text>
                <Text style={styles.summaryLabel}>Total Items</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={[styles.summaryNumber, { color: '#fd7e14' }]}>{getLowItemsCount()}</Text>
                <Text style={styles.summaryLabel}>Low Stock</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={[styles.summaryNumber, { color: '#dc3545' }]}>{getCriticalItemsCount()}</Text>
                <Text style={styles.summaryLabel}>Critical</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              Approved Stock Analysis
            </Text>

            {stockRemain.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No approved stock items</Text>
                <Text style={styles.emptySubtext}>
                  Approved items will appear here for analysis
                </Text>
              </View>
            ) : (
              stockRemain.map((item) => (
                <View key={item.id} style={styles.stockCard}>
                  <View style={styles.stockHeader}>
                    <View style={styles.stockTitleContainer}>
                      <Text style={styles.stockItemName}>{item.food_item}</Text>
                      <Text style={styles.stockCategory}>{item.category}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.stock_status) }]}>
                      <Text style={styles.statusText}>
                        {getStatusIcon(item.stock_status)} {item.stock_status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.stockDetails}>
                    <View style={styles.stockRow}>
                      <Text style={styles.stockLabel}>Current Stock:</Text>
                      <Text style={styles.stockValue}>
                        {item.current_stock} {item.unit}
                      </Text>
                    </View>
                    <View style={styles.stockRow}>
                      <Text style={styles.stockLabel}>Min Level:</Text>
                      <Text style={styles.stockValue}>
                        {item.min_stock_level} {item.unit}
                      </Text>
                    </View>
                    <View style={styles.stockRow}>
                      <Text style={styles.stockLabel}>Weekly Need:</Text>
                      <Text style={styles.stockValue}>
                        {item.weekly_requirement.toFixed(1)} {item.unit}
                      </Text>
                    </View>
                  </View>

                  {/* Prediction Section */}
                  <View style={styles.predictionContainer}>
                    <View style={styles.predictionHeader}>
                      <Text style={styles.predictionLabel}>Will Last For</Text>
                      <Text style={[
                        styles.predictionDays,
                        { color: getStatusColor(item.stock_status) }
                      ]}>
                        {item.predicted_days} days
                      </Text>
                    </View>
                    
                    {/* Progress Bar */}
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBackground}>
                        <View 
                          style={[
                            styles.progressBarFill,
                            { 
                              width: `${Math.min((item.predicted_days / 30) * 100, 100)}%`,
                              backgroundColor: getStatusColor(item.stock_status)
                            }
                          ]} 
                        />
                      </View>
                      <View style={styles.progressLabels}>
                        <Text style={styles.progressLabel}>0</Text>
                        <Text style={styles.progressLabel}>30 days</Text>
                      </View>
                    </View>

                    <View style={styles.consumptionInfo}>
                      <Text style={styles.consumptionText}>
                        Consumption: {item.consumption_per_student} {item.unit}/student/meal
                      </Text>
                      <Text style={styles.studentsText}>
                        Based on {studentsCount} students
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        visible={showPostModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Announcement</Text>
            <TouchableOpacity onPress={() => setShowPostModal(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={postForm.title}
              onChangeText={(text) => setPostForm({ ...postForm, title: text })}
              placeholder="Enter announcement title"
              maxLength={100}
            />

            <Text style={styles.label}>Content *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={postForm.content}
              onChangeText={(text) => setPostForm({ ...postForm, content: text })}
              placeholder="Enter announcement content"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={createPost}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Publish Announcement</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1e3c72',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1e3c72',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1e3c72',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  inventoryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  committeeBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  itemDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  rejectButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  approveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  approveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  postMeta: {
    fontSize: 12,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 60,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 16,
    color: '#1e3c72',
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#1e3c72',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Stock Analysis Styles
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  stockCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stockTitleContainer: {
    flex: 1,
  },
  stockItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  stockCategory: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  stockDetails: {
    marginBottom: 16,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stockLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  stockValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
  },
  predictionContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  predictionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  predictionDays: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 10,
    color: '#666',
  },
  consumptionInfo: {
    marginTop: 8,
  },
  consumptionText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  studentsText: {
    fontSize: 11,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
});