import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import THEME from '../../constants/theme';
import CategoryCard from '../../components/CategoryCard';
import CategoryDetail from '../../components/CategoryDetail';
import { useEffect } from 'react';
import axios from 'axios';
const TERTIARY_GREEN = '#2DCC70';

export default function CategoryPage() {
  const router = useRouter();
  const categories = {
  'Food': 'restaurant',
  'Dairy': 'water',
  'Snacks': 'fast-food',
  'Cleaning': 'trash',
  'Personal Care': 'heart',
  'Cloths': 'shirt',
  'Grocery': 'cart',
  'Education': 'book',
  'Health': 'medkit',
  'Entertainment': 'film',
  'Electronics': 'laptop',
  'Transport': 'bus',
  'Others': 'pricetag'
}as const;
  const { category, refresh} = useLocalSearchParams();
  // State to track if a specific category is open
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryTotals, setCategoryTotals] = useState<any[]>([]);

  useEffect(() => {
  const fetchCategoryTotals = async () => {
    try {
      const res = await axios.get('http://192.168.1.5:5000/api/categories/breakdown');
      setCategoryTotals(res.data);
    } catch (error) {
      console.log("Category fetch error:", error);
    }
  };

  fetchCategoryTotals();
}, [refresh]);

  useEffect(() => {
  if (category) {
    if (Array.isArray(category)) {
      setSelectedCategory(category[0]);
    } else {
      setSelectedCategory(category);
    }
  }
}, [category]);
  

if (selectedCategory) {
  return (
    <CategoryDetail
      category={selectedCategory}
      onBack={() => setSelectedCategory(null)}
    />
  );
}

  // --- MAIN LIST VIEW ---
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>All Categories</Text>
      </View>
    
      <View style={styles.insightCard}>
        <View style={styles.insightIcon}><Ionicons name="bulb" size={20} color={THEME.colors.accent} /></View>
        <View style={styles.insightTextContent}>
          <Text style={styles.insightTitle}>Pro Tip</Text>
          <Text style={styles.insightDesc}>Your weekend spending is 10% lower than usual.</Text>
        </View>
      </View>

      <View style={styles.listContainer}>
  {Object.entries(categories).map(([title, icon]) => (
    <CategoryCard
      key={title}
      title={title}
      amount={`₹${
  categoryTotals.find((c: any) => c._id === title)?.total?.toLocaleString('en-IN') || 0
} spent`}
      status="success"
      iconName={icon}
      onPress={() => setSelectedCategory(title)}
    />
  ))}
</View>
      {/* 5. Plus Button */}
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: TERTIARY_GREEN }]}
              activeOpacity={0.9}
              onPress={() => router.push('/additems')}
            >
              <Ionicons name="add" size={35} color="white" />
            </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Main List Styles
  container: { flex: 1, backgroundColor: THEME.colors.background, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 25 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.colors.card, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  title: { fontSize: 24, fontWeight: '800', color: THEME.colors.textPrimary },
  insightCard: { flexDirection: 'row', backgroundColor: '#EEF6FF', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 25 },
  insightIcon: { width: 40, height: 40, backgroundColor: 'white', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  insightTextContent: { marginLeft: 12, flex: 1 },
  insightTitle: { fontWeight: '700', color: THEME.colors.accent },
  insightDesc: { fontSize: 12, color: THEME.colors.textSecondary },
  listContainer: { gap: 12 },

  // Detail View Styles (Professional Version of your Sketch)
  detailContainer: { flex: 1, backgroundColor: '#F8F9FB' },
  detailScrollContent: { padding: 20 },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, paddingTop: 40 },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  avatarText: { fontWeight: 'bold', fontSize: 12 },
  userName: { fontSize: 16, fontWeight: '700', color: '#333' },
  heroCard: { backgroundColor: '#2DCC70', padding: 30, borderRadius: 20, marginBottom: 20 },
  heroLabel: { color: 'white', fontSize: 14, opacity: 0.9 },
  heroAmount: { color: 'white', fontSize: 36, fontWeight: '800', marginTop: 5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { backgroundColor: 'white', width: '48%', padding: 15, borderRadius: 15, elevation: 2 },
  statLabel: { color: '#666', fontSize: 12 },
  statValue: { fontSize: 20, fontWeight: 'bold', marginVertical: 5 },
  progressBg: { height: 4, backgroundColor: '#eee', borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: '#2DCC70', borderRadius: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  seeAllText: { color: '#2DCC70', fontSize: 12 },
  receiptBox: { backgroundColor: 'white', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  receiptIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F0F9F4', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  receiptTitle: { fontWeight: '600', color: '#1A1A1A' },
  receiptDate: { color: '#999', fontSize: 12 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 64, height: 64, borderRadius: 32, backgroundColor: '#2DCC70', justifyContent: 'center', alignItems: 'center', elevation: 5 },
});