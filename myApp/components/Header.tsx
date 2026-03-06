import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  onMenuPress: () => void;
  hasNotification?: boolean;
  limitDiff?: number; // Pass the over-budget amount
}

export default function Header({ onMenuPress, hasNotification, limitDiff }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.mainRow}>
        <TouchableOpacity style={styles.left} onPress={onMenuPress} activeOpacity={0.7}>
          <Ionicons name="person-circle" size={42} color="#16C784" />
          <Text style={styles.name}>Shubham M.</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.7} 
          style={styles.notifContainer}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Ionicons name="notifications-outline" size={28} color="#111" />
          {hasNotification && <View style={styles.badge} />}
        </TouchableOpacity>
      </View>

      {/* 🔔 NOTIFICATION DROPDOWN */}
      {showDropdown && hasNotification && (
        <View style={styles.dropdown}>
          <View style={styles.triangle} />
          <View style={styles.notifItem}>
            <Ionicons name="warning" size={20} color="#FF4D4D" />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.notifTitle}>Budget Exceeded!</Text>
              <Text style={styles.notifBody}>
                You are ₹{limitDiff?.toFixed(0)} over your daily limit.
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { zIndex: 1000, width: '100%' },
  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 15,
  },
  left: { flexDirection: "row", alignItems: "center" },
  name: { marginLeft: 10, fontSize: 18, fontWeight: "700", color: "#111" },
  notifContainer: { position: 'relative', padding: 5 },
  badge: { 
    position: 'absolute', 
    right: 5, 
    top: 5, 
    width: 12, 
    height: 12, 
    backgroundColor: '#FF4D4D', 
    borderRadius: 6, 
    borderWidth: 2, 
    borderColor: 'white' 
  },
  dropdown: {
    position: 'absolute',
    top: 90,
    right: 0,
    width: 260,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  triangle: {
    position: 'absolute',
    top: -10,
    right: 15,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'white',
  },
  notifItem: { flexDirection: 'row', alignItems: 'center' },
  notifTitle: { fontWeight: '800', fontSize: 14, color: '#111' },
  notifBody: { fontSize: 12, color: '#666', marginTop: 2 }
});