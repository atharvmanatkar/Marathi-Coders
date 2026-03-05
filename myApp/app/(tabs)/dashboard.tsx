interface Vendor {
  _id: string;
  totalSpent: number;
  visitCount: number;
}

interface DailyStat {
  _id: number;
  amount: number;
}

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import axios from 'axios';
import SideBar from '../../components/SideBar';

const screenWidth = Dimensions.get('window').width;
const API_BASE_URL = 'http://192.168.1.5:5000/api';

export default function DashboardScreen() {
  const router = useRouter();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ expenses: 0, savings: 0, avgValue: 0, totalScanned: 0 });
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<DailyStat[]>([]);

  const getDayName = (id: number) => {
    const days = ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[id] || '??';
  };

  const loadDashboardData = async () => {
    try {
      console.log("🔄 Starting Data Fetch...");
      setLoading(true);
      
      // 1. Fetch Summary Stats (Mounted at /api/ because of app.use('/', receiptRoutes))
      const summaryRes = await axios.get(`${API_BASE_URL}/dashboard-summary`);
      setStats(summaryRes.data);

      // 2. Fetch Daily Stats
      const statsRes = await axios.get(`${API_BASE_URL}/daily-stats`);
      const fullWeek = [1, 2, 3, 4, 5, 6, 7].map(dayId => {
        const found = statsRes.data.find((d: any) => d._id === dayId);
        return found || { _id: dayId, amount: 0 };
      });
      setChartData(fullWeek);

      // 3. Fetch Top Vendors
      const vendorRes = await axios.get(`${API_BASE_URL}/top-merchants`);
      setVendors(vendorRes.data);

      // 4. Fetch Category Breakdown (Mounted at /api/categories/)
      // FIX: Mapping 'total' from your backend to 'population' for the PieChart
      const categoryRes = await axios.get(`${API_BASE_URL}/categories/breakdown`);
      const formattedPieData = categoryRes.data.map((item: any, index: number) => ({
        name: item._id || 'Other',
        population: item.total || 0, // Match your backend field name 'total'
        color: ['#1A5276', '#2980B9', '#5499C7', '#A9CCE3', '#16C784'][index % 5],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
      }));
      setCategoryData(formattedPieData);

      setLoading(false);
      console.log("✅ Dashboard Sync Complete");
    } catch (error) {
      console.error("❌ Dashboard Sync Error:", error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(22, 199, 132, ${opacity})`,
    labelColor: (opacity = 1) => `#666`,
    strokeWidth: 2,
    decimalPlaces: 0,
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#16C784" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <SideBar isVisible={isMenuVisible} onClose={() => setMenuVisible(false)} />
      
      <View style={styles.navHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={26} color="#111" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Dashboard</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu-outline" size={30} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* Summary Row */}
        <View style={styles.summaryRow}>
          <View style={[styles.card, styles.summaryCard, { backgroundColor: '#111' }]}>
            <Text style={styles.cardLabelLight}>Savings</Text>
            <Text style={styles.cardValueLight}>₹{stats.savings.toLocaleString('en-IN')}</Text>
            <Text style={styles.growthText}>Based on ₹60k limit</Text>
          </View>
          <View style={[styles.card, styles.summaryCard, { backgroundColor: '#fff' }]}>
            <Text style={styles.cardLabelDark}>Expenses</Text>
            <Text style={styles.cardValueDark}>₹{stats.expenses.toLocaleString('en-IN')}</Text>
            <Text style={[styles.growthText, { color: stats.expenses > 60000 ? '#E74C3C' : '#16C784' }]}>
               {stats.expenses > 60000 ? 'Over Limit' : 'Within Budget'}
            </Text>
          </View>
        </View>

        {/* Weekly Trend Graph */}
        <View style={[styles.card, styles.chartCard]}>
          <Text style={styles.sectionTitle}>Weekly Spending Trend</Text>
          <LineChart
            data={{
              labels: chartData.map((item: DailyStat) => getDayName(item._id)),
              datasets: [{ data: chartData.map((item: DailyStat) => item.amount) }]
            }}
            width={screenWidth - 60}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Budget Tracker */}
        <View style={[styles.card, styles.budgetCard]}>
          <View style={styles.flexRow}>
            <Text style={styles.sectionTitle}>Budget Tracker</Text>
            <Text style={[styles.percentageText, { color: '#2980B9' }]}>
              {Math.round((stats.expenses / 60000) * 100)}% Used
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { 
              width: `${Math.min((stats.expenses / 60000) * 100, 100)}%`, 
              backgroundColor: '#2980B9' 
            }]} />
          </View>
          <Text style={styles.subText}>₹{stats.expenses.toLocaleString('en-IN')} of ₹60,000 limit</Text>
        </View>

        {/* Intelligence Grid */}
        <Text style={styles.groupTitle}>Receipt Intelligence</Text>
        <View style={styles.intelGrid}>
          <View style={[styles.card, styles.intelBox]}>
            <Ionicons name="document-text-outline" size={24} color="#16C784" />
            <Text style={styles.intelValue}>{stats.totalScanned}</Text>
            <Text style={styles.intelSub}>Total Scanned</Text>
          </View>
          <View style={[styles.card, styles.intelBox]}>
            <Ionicons name="calculator-outline" size={24} color="#16C784" />
            <Text style={styles.intelValue}>₹{stats.avgValue.toLocaleString('en-IN')}</Text>
            <Text style={styles.intelSub}>Avg. Value</Text>
          </View>
        </View>

        {/* Merchant Insight */}
        {vendors.length > 0 && (
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Ionicons name="sparkles" size={20} color="#fff" />
            </View>
            <Text style={styles.insightText}>
              <Text style={{ fontWeight: '800' }}>{vendors[0]._id}</Text> is your most visited merchant.
            </Text>
          </View>
        )}

        {/* Pie Chart Breakdown */}
        {categoryData.length > 0 && (
          <View style={[styles.card, styles.chartCard]}>
            <Text style={styles.sectionTitle}>Category Breakdown</Text>
            <PieChart
              data={categoryData}
              width={screenWidth - 40}
              height={180}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          </View>
        )}

        {/* Vendors List */}
        <View style={[styles.card, { marginBottom: 40 }]}>
          <Text style={styles.sectionTitle}>Top 3 Vendors</Text>
          {vendors.map((vendor, i) => (
            <View key={i} style={styles.vendorRow}>
              <View>
                <Text style={styles.vendorName}>{vendor._id}</Text>
                <Text style={styles.vendorSub}>{vendor.visitCount} transactions</Text>
              </View>
              <Text style={styles.vendorAmount}>₹{vendor.totalSpent.toLocaleString('en-IN')}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  navHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 15 },
  navTitle: { fontSize: 22, fontWeight: '800', color: '#111' },
  scrollContainer: { paddingHorizontal: 20 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryCard: { width: '48%', height: 130, justifyContent: 'center' },
  cardLabelLight: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  cardValueLight: { color: '#fff', fontSize: 24, fontWeight: '800', marginVertical: 4 },
  cardLabelDark: { color: '#666', fontSize: 13 },
  cardValueDark: { color: '#111', fontSize: 24, fontWeight: '800', marginVertical: 4 },
  growthText: { fontSize: 11, color: '#16C784', fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  groupTitle: { fontSize: 18, fontWeight: '800', marginVertical: 10, color: '#111' },
  chartCard: { alignItems: 'center' },
  chart: { marginTop: 15, borderRadius: 16 },
  budgetCard: { paddingBottom: 25 },
  flexRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  percentageText: { fontWeight: '700' },
  progressBarBg: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%' },
  subText: { marginTop: 8, fontSize: 12, color: '#999' },
  intelGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  intelBox: { width: '48%', alignItems: 'center', paddingVertical: 25 },
  intelValue: { fontSize: 20, fontWeight: '800', marginTop: 10 },
  intelSub: { fontSize: 12, color: '#666' },
  insightCard: { backgroundColor: '#E8F8F1', padding: 15, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  insightIcon: { backgroundColor: '#16C784', padding: 8, borderRadius: 10, marginRight: 12 },
  insightText: { flex: 1, color: '#111', fontSize: 14, lineHeight: 20 },
  vendorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  vendorName: { fontSize: 15, fontWeight: '600', color: '#111' },
  vendorSub: { fontSize: 12, color: '#999' },
  vendorAmount: { fontSize: 15, fontWeight: '700', color: '#111' },
});