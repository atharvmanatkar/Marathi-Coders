import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import SideBar from '../../components/SideBar';

const API_BASE_URL = 'http://10.127.33.44:5000/api';

interface Transaction {
  _id: string;
  merchantName: string;
  totalAmount: number;
  date: string;
  imageUrl?: string;
  items: Array<{ category: string }>;
}

export default function HistoryScreen() {
  const router = useRouter();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [filter, setFilter] = useState('All');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/all-history`);
      setTransactions(res.data);
      setLoading(false);
    } catch (err) {
      console.error("History Fetch Error:", err);
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchHistory(); }, []));

  const filteredData = transactions.filter(item => {
    const type = item.imageUrl ? 'Scanned' : 'Manual';
    if (filter === 'All') return true;
    return type === filter;
  });

  const renderItem = ({ item }: { item: Transaction }) => {
    const isScanned = !!item.imageUrl;
    
    return (
      <TouchableOpacity 
        // FIX: Object-based navigation to satisfy TypeScript
        onPress={() => router.push({
          pathname: '/history/[id]',
          params: { id: item._id }
        })} 
        activeOpacity={0.7}
      >
        <View style={styles.historyCard}>
          <View style={styles.cardLeft}>
            <View style={[styles.iconContainer, { backgroundColor: isScanned ? '#E8F8F1' : '#EBF5FB' }]}>
              <Ionicons name={isScanned ? 'scan' : 'create-outline'} size={22} color={isScanned ? '#16C784' : '#2980B9'} />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.itemTitle}>{item.merchantName || "Recent Scan"}</Text>
              <Text style={styles.itemSubtext}>
                {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • {item.items[0]?.category || 'General'}
              </Text>
            </View>
          </View>
          <View style={styles.cardRight}>
            <Text style={styles.amountText}>₹{item.totalAmount.toLocaleString('en-IN')}</Text>
            <View style={[styles.typeBadge, { backgroundColor: isScanned ? '#16C784' : '#2980B9' }]}>
              <Text style={styles.typeBadgeText}>{isScanned ? 'Scanned' : 'Manual'}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <SideBar isVisible={isMenuVisible} onClose={() => setMenuVisible(false)} />
      <View style={styles.navHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={26} color="#111" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>History</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu-outline" size={30} color="#111" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.filterRow}>
          {['All', 'Scanned', 'Manual'].map((type) => (
            <TouchableOpacity 
              key={type} 
              onPress={() => setFilter(type)}
              style={[styles.filterPill, filter === type && { backgroundColor: type === 'Manual' ? '#2980B9' : '#111' }]}
            >
              <Text style={[styles.filterText, filter === type && { color: '#fff' }]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#16C784" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 15 },
  navTitle: { fontSize: 22, fontWeight: '800', color: '#111' },
  container: { flex: 1, paddingHorizontal: 20 },
  filterRow: { flexDirection: 'row', gap: 10, marginBottom: 20, marginTop: 10 },
  filterPill: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
  filterText: { fontWeight: '600', color: '#666' },
  historyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 18, marginBottom: 12, elevation: 2 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  infoContainer: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  itemSubtext: { fontSize: 12, color: '#999', marginTop: 2 },
  cardRight: { alignItems: 'flex-end' },
  amountText: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 5 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  typeBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});