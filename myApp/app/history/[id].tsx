import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;
const API_BASE_URL = 'http://10.127.33.44:5000/api';

export default function ReceiptDetailScreen() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/receipt/${id}`);
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Detail Fetch Error:", err);
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16C784" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Receipt Image Card */}
        <View style={styles.imageWrapper}>
          {data?.imageUrl ? (
            <Image source={{ uri: data.imageUrl }} style={styles.receiptImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="receipt-outline" size={80} color="#ccc" />
              <Text style={{ color: '#999', marginTop: 10 }}>No Receipt Image</Text>
            </View>
          )}
        </View>

        {/* Info Card */}
        <View style={styles.mainCard}>
          <Text style={styles.merchantName}>{data?.merchantName || "Recent Scan"}</Text>
          <Text style={styles.amount}>₹{data?.totalAmount.toLocaleString('en-IN')}</Text>
          <View style={styles.badgeRow}>
             <View style={[styles.badge, { backgroundColor: data?.imageUrl ? '#E8F8F1' : '#EBF5FB' }]}>
                <Text style={{ color: data?.imageUrl ? '#16C784' : '#2980B9', fontWeight: '700', fontSize: 12 }}>
                    {data?.imageUrl ? 'SCANNED' : 'MANUAL'}
                </Text>
             </View>
             <Text style={styles.dateText}>
                {new Date(data?.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
             </Text>
          </View>
        </View>

        {/* Items Breakdown */}
        <View style={styles.itemsCard}>
          <Text style={styles.sectionTitle}>Items Extracted</Text>
          {data?.items && data.items.length > 0 ? (
            data.items.map((item: any, index: number) => (
              <View key={index} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name || "Unknown Item"}</Text>
                  <Text style={styles.itemCategory}>{item.category || "General"}</Text>
                </View>
                <Text style={styles.itemPrice}>₹{item.price || 0}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noItemsText}>No item breakdown available</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: '#fff' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  imageWrapper: { width: screenWidth, height: 300, backgroundColor: '#eee' },
  receiptImage: { width: '100%', height: '100%' },
  placeholderImage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainCard: { backgroundColor: '#fff', marginTop: -30, marginHorizontal: 20, borderRadius: 25, padding: 25, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20 },
  merchantName: { fontSize: 20, fontWeight: '700', color: '#666' },
  amount: { fontSize: 36, fontWeight: '900', color: '#111', marginVertical: 8 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  dateText: { fontSize: 14, color: '#999', fontWeight: '600' },
  itemsCard: { backgroundColor: '#fff', marginHorizontal: 20, marginTop: 20, borderRadius: 25, padding: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 15 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  itemName: { fontSize: 15, fontWeight: '700', color: '#111' },
  itemCategory: { fontSize: 12, color: '#999', marginTop: 2 },
  itemPrice: { fontSize: 16, fontWeight: '800', color: '#111' },
  noItemsText: { textAlign: 'center', color: '#999', marginTop: 10 }
});