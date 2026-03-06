import React, { useEffect, useState } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

const { width } = Dimensions.get('window');

type ReceiptItemDetail = {
  product: string;
  price: number;
  category: string;
};

type ReceiptItem = {
  _id: string;
  userId?: string;
  imageUrl?: string;
  totalAmount?: number;
  items: ReceiptItemDetail[];
  date: string;
  merchantName?: string;
};

type CategoryDetailProps = {
  category: string;
  onBack: () => void;
};

export default function CategoryDetail({ category, onBack }: CategoryDetailProps) {
  const router = useRouter();
  const TERTIARY_GREEN = '#2DCC70';

  const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const res = await axios.get(`http://192.168.1.5:5000/api/categories/${category}`);
      setReceipts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

 const getTotalSpent = () => {
  let total = 0;
  receipts.forEach((r) => {
    r.items.forEach((i) => {
      if (i.category.toLowerCase() === category.toLowerCase()) {
        total += i.price;
      }
    });
  });
  return Number(total.toFixed(2)); // rounds to 2 decimal places
};

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>{category}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 2. Total Amount Card */}
        <View style={styles.blackHeroCard}>
          <Text style={styles.heroLabel}>Total {category} Spent</Text>
          <Text style={styles.heroAmount}>₹ {getTotalSpent()}</Text>
          <View style={styles.cardAccent} />
        </View>

        {/* 3. Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Monthly</Text>
            <Text style={styles.statValue}>₹ {Math.round(getTotalSpent() / 4)}</Text>
            <View style={styles.progressBase}>
              <View style={[styles.progressFill, { width: '40%', backgroundColor: TERTIARY_GREEN }]} />
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Today</Text>
            <Text style={styles.statValue}>
              ₹ {receipts.length > 0 ? receipts[0].items[0].price : 0}
            </Text>
          </View>
        </View>

        {/* 4. Receipts List Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Receipts</Text>
          <TouchableOpacity>
            <Text style={{ color: TERTIARY_GREEN, fontWeight: '600' }}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Receipts List */}
        {loading ? (
          <ActivityIndicator size="large" color={TERTIARY_GREEN} />
        ) : (
          receipts.map((receipt) =>
            receipt.items
              .filter((item) => item.category.toLowerCase() === category.toLowerCase())
              .map((item, index) => (
                <View key={receipt._id + index} style={styles.receiptBox}>
                  <View style={styles.receiptInfo}>
                    <View style={styles.iconCircle}>
                      <Ionicons name="document-text" size={20} color={TERTIARY_GREEN} />
                    </View>
                    <View>
                      <Text style={styles.receiptText}>{item.product}</Text>
                      <Text style={styles.receiptDate}>
                        {receipt.date ? new Date(receipt.date).toLocaleDateString() : "N/A"}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.receiptAmount}>₹ {item.price}</Text>
                </View>
              ))
          )
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 55,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: { padding: 8, marginRight: 10 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A1A' },
  scrollContent: { paddingHorizontal: 20 },
  blackHeroCard: { 
    backgroundColor: '#000000', 
    padding: 30, 
    borderRadius: 28, 
    marginBottom: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 }
  },
  heroLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
  heroAmount: { color: 'white', fontSize: 40, fontWeight: '800', marginTop: 8 },
  cardAccent: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)'
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statCard: { backgroundColor: 'white', width: '47%', padding: 20, borderRadius: 24, elevation: 2 },
  statLabel: { color: '#888', fontSize: 13, marginBottom: 5 },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  progressBase: { height: 6, backgroundColor: '#F0F0F0', borderRadius: 3, marginTop: 10 },
  progressFill: { height: 6, borderRadius: 3 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  receiptBox: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  receiptInfo: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    backgroundColor: '#F0FFF4', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 15 
  },
  receiptText: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  receiptDate: { color: '#999', fontSize: 13, marginTop: 2 },
  receiptAmount: { fontSize: 16, fontWeight: '700', color: '#E74C3C' },
  fab: { 
    position: 'absolute', 
    bottom: 40, 
    right: 25, 
    width: 65, 
    height: 65, 
    borderRadius: 32.5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 10,
    shadowColor: '#2DCC70',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  }
});