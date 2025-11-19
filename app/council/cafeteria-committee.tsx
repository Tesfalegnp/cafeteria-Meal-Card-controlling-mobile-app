// Mobile_app/TCSS-3/app/council/cafeteria-committee.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
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
}

export default function CafeteriaCommitteeScreen() {
  const { student, councilMember } = useAuth();
  const [inventory, setInventory] = useState<FoodInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      // Only show items that are not yet approved by committee
      const { data, error } = await supabase
        .from('food_inventory')
        .select('*')
        .eq('approved_by_committee', false)
        .eq('approved_by_president', false)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading inventory:', error);
        // If columns don't exist, show empty state with guidance
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
    } catch (error) {
      console.error('Error loading inventory:', error);
      Alert.alert('Error', 'Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const approveItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('food_inventory')
        .update({ 
          approved_by_committee: true,
          committee_approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) throw error;

      Alert.alert('Success', 'Item approved! It has been sent to President for final approval.');
      await loadInventory();
    } catch (error) {
      console.error('Error approving item:', error);
      Alert.alert('Error', 'Failed to approve item');
    }
  };

  const rejectItem = async (itemId: string) => {
    Alert.alert(
      'Reject Item',
      'Are you sure you want to reject this item?',
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
              await loadInventory();
            } catch (error) {
              console.error('Error rejecting item:', error);
              Alert.alert('Error', 'Failed to reject item');
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInventory();
    setRefreshing(false);
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
          First-level approval for food inventory items
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            New Items Pending Committee Approval ({inventory.length})
          </Text>

          {inventory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No items pending approval</Text>
              <Text style={styles.emptySubtext}>
                All new items have been reviewed
              </Text>
            </View>
          ) : (
            inventory.map((item) => (
              <View key={item.id} style={styles.inventoryCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.itemName}>{item.food_item}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>NEW</Text>
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
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Min Stock Level:</Text>
                    <Text style={styles.detailValue}>
                      {item.min_stock_level} {item.unit}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Registered:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => rejectItem(item.id)}
                  >
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => approveItem(item.id)}
                  >
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Approval Process Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Approval Process</Text>
          <View style={styles.processSteps}>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Cafeteria Manager registers item</Text>
            </View>
            <View style={styles.processStep}>
              <View style={[styles.stepNumber, styles.currentStep]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Committee reviews & approves</Text>
            </View>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>President gives final approval</Text>
            </View>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>Item appears in stock reports</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  statusBadge: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
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
  infoSection: {
    backgroundColor: '#e8f4fd',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1e3c72',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3c72',
    marginBottom: 12,
  },
  processSteps: {
    gap: 12,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6c757d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentStep: {
    backgroundColor: '#1e3c72',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 14,
    color: '#495057',
    flex: 1,
  },
});