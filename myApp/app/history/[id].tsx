import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;
const API_BASE_URL = 'http://192.168.1.5:5000/api'; 

export default function ReceiptDetailScreen() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false); 

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

  const isRealImage = data?.imageUrl && data.imageUrl.includes('cloudinary');

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      
      {/* 🟢 MODAL: Higher in the component tree to ensure it renders on top */}
      <Modal 
        visible={isModalVisible} 
        transparent={false} // Changed to false for a true full-screen black-out
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle" size={45} color="#fff" />
          </TouchableOpacity>

          <Image 
            source={{ uri: data?.imageUrl }} 
            style={styles.fullImage} 
            resizeMode="contain" 
          />
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* 🛠️ FIX: Added zIndex and elevated the TouchableOpacity */}
        <View style={styles.imageWrapper}>
          {isRealImage ? (
            <TouchableOpacity 
              onPress={() => {
                console.log("Image Clicked!"); // Check your terminal for this log!
                setModalVisible(true);
              }} 
              activeOpacity={0.7}
              style={styles.clickableArea}
            >
              <Image 
                source={{ uri: data.imageUrl }} 
                style={styles.receiptImage} 
                resizeMode="cover" 
              />
              <View style={styles.zoomOverlay}>
                <Ionicons name="expand" size={24} color="#fff" />
                <Text style={styles.zoomText}>Tap to enlarge</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="receipt-outline" size={80} color="#ccc" />
              <Text style={{ color: '#999', marginTop: 10 }}>No Receipt Image</Text>
            </View>
          )}
        </View>

        <View style={styles.mainCard}>
          <Text style={styles.merchantName}>{data?.merchantName || "Recent Scan"}</Text>
          <Text style={styles.amount}>₹{data?.totalAmount?.toLocaleString('en-IN')}</Text>
          <View style={styles.badgeRow}>
             <View style={[styles.badge, { backgroundColor: isRealImage ? '#E8F8F1' : '#EBF5FB' }]}>
                <Text style={{ color: isRealImage ? '#16C784' : '#2980B9', fontWeight: '700', fontSize: 12 }}>
                    {isRealImage ? 'SCANNED' : 'MANUAL'}
                </Text>
             </View>
             <Text style={styles.dateText}>
                {new Date(data?.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
             </Text>
          </View>
        </View>

        <View style={styles.itemsCard}>
          <Text style={styles.sectionTitle}>Items Extracted</Text>
          {data?.items?.map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name || item.product || "Unknown Item"}</Text>
                <Text style={styles.itemCategory}>{item.category || "General"}</Text>
              </View>
              <Text style={styles.itemPrice}>₹{item.price || 0}</Text>
            </View>
          ))}
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
  
  // 🛠️ Updated styles for clickability
  imageWrapper: { 
    width: screenWidth, 
    height: 350, 
    backgroundColor: '#eee',
    zIndex: 10, // Force it above the ScrollView's default layer
  },
  clickableArea: { 
    width: '100%', 
    height: '100%',
  },
  receiptImage: { 
    width: '100%', 
    height: '100%' 
  },
  zoomOverlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)' 
  },
  zoomText: { color: '#fff', fontSize: 14, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10 },
  
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

  // Modal Styles
  modalBackground: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  fullImage: { width: screenWidth, height: '90%' },
  closeButton: { position: 'absolute', top: 50, right: 25, zIndex: 100 }
});