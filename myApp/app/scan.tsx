import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker'; 
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [uploading, setUploading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null); 
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // 1. Gallery Pick - No forced crop, full image selection
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false, // 🟢 Set to false to see the full receipt without cropping
      quality: 0.8,
    });
    if (!result.canceled) {
      setPreviewUri(result.assets[0].uri); 
    }
  };

  // 2. Camera Capture
  const takePicture = async () => {
    if (cameraRef.current) {
      // @ts-ignore
      const photo = await cameraRef.current.takePictureAsync();
      setPreviewUri(photo.uri); 
    }
  };

  // 3. Final Upload to Gemini
  const uploadImage = async () => {
    if (!previewUri) return;
    
    setUploading(true);
    const formData = new FormData();
    // @ts-ignore
    formData.append('receipt', { uri: previewUri, name: 'receipt.jpg', type: 'image/jpeg' });

    try {
      // Ensure this IP matches your current laptop IP
      await axios.post('http://192.168.1.5:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert("Success", "Receipt Scanned!");
      setPreviewUri(null); 
    } catch (error) {
      Alert.alert("Error", "Analysis failed. Check your server connection.");
    } finally {
      setUploading(false);
    }
  };

  if (!permission?.granted) return <View style={styles.container}><Text>Grant Camera Permission</Text></View>;

  // --- REVIEW SCREEN (Shows after picking/taking photo) ---
  if (previewUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.previewTitle}>Review Receipt</Text>
        <Image source={{ uri: previewUri }} style={styles.previewImage} />
        
        {uploading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#16C784" />
            <Text style={{ marginTop: 10, fontWeight: '600' }}>Reding the Reciept...</Text>
          </View>
        ) : (
          <View style={styles.reviewButtons}>
            <TouchableOpacity style={styles.retryBtn} onPress={() => setPreviewUri(null)}>
              <Ionicons name="refresh" size={24} color="#555" />
              <Text style={styles.retryText}>Scan Again</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={uploadImage}>
              <Text style={styles.confirmText}>OK / Next</Text>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  // --- MAIN CAMERA VIEW ---
  return (
    <View style={{ flex: 1 }}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.galleryBtn} onPress={pickFromGallery}>
              <Ionicons name="images" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureBtn} onPress={takePicture} />
            <View style={{ width: 60 }} />
          </View>
        </View> 
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 20 },
  previewTitle: { fontSize: 22, fontWeight: '800', marginBottom: 20 },
  previewImage: { width: '100%', height: '65%', borderRadius: 15, marginBottom: 30, resizeMode: 'contain' },
  reviewButtons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', gap: 15 },
  retryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#ddd' },
  confirmBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 12, backgroundColor: '#111' },
  retryText: { marginLeft: 10, fontWeight: '700', color: '#555' },
  confirmText: { marginRight: 10, fontWeight: '700', color: 'white' },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'center' },
  controls: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-around', marginBottom: 40 },
  captureBtn: { width: 75, height: 75, borderRadius: 40, backgroundColor: 'white', borderWidth: 6, borderColor: 'rgba(255,255,255,0.3)' },
  galleryBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  loadingBox: { alignItems: 'center' }
});