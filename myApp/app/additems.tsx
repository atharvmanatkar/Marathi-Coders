import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function AddItems() {

  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');

  const categories: Record<string, keyof typeof Ionicons.glyphMap> = {
    Food: 'restaurant',
    Dairy: 'water',
    Snacks: 'fast-food',
    Cleaning: 'trash',
    'Personal Care': 'heart',
    Cloths: 'shirt',
    Grocery: 'cart',
    Education: 'book',
    Health: 'medkit',
    Entertainment: 'film',
    Electronics: 'laptop',
    Transport: 'bus',
    Others: 'pricetag'
  };

  const [category, setCategory] = useState<keyof typeof categories | ''>('');
  const [showCategories, setShowCategories] = useState(false);

  const saveItem = async () => {

    if (!name || !amount || !category) {
      alert('Please enter all fields');
      return;
    }

    try {

      await axios.post(`http://192.168.1.5:5000/api/categories/add-item`, {
        product: name,
        price: parseFloat(amount),
        category: category,
      });

      setAmount('');
      setName('');
      setCategory('');

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        router.replace('/category?refresh=true');
      }, 1500);

    } catch (err) {
      console.log(err);
      alert('Failed to save item');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >

      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

          {success && (
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.successText}>
                Expense added to {category}
              </Text>
            </View>
          )}

          {/* Amount Card */}
          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>ENTER AMOUNT</Text>

            <View style={styles.inputRow}>
              <Text style={styles.currencySymbol}>₹</Text>

              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                autoFocus
              />

            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>

            {/* Category */}
            <View style={styles.inputGroup}>

              <Text style={styles.inputLabel}>Category</Text>

              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowCategories(!showCategories)}
              >

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>

                  {category ? (
                    <>
                      <Ionicons name={categories[category]} size={18} color="#333" />
                      <Text style={{ fontSize: 16 }}>{category}</Text>
                    </>
                  ) : (
                    <Text style={{ color: '#999' }}>Select Category</Text>
                  )}

                </View>

                <Ionicons name="chevron-down" size={18} color="#666" />

              </TouchableOpacity>

              {showCategories && (
                <View style={styles.categoryList}>

                  {Object.entries(categories).map(([cat, icon]) => (

                    <TouchableOpacity
                      key={cat}
                      style={styles.categoryItem}
                      onPress={() => {
                        setCategory(cat as keyof typeof categories);
                        setShowCategories(false);
                      }}
                    >

                      <Ionicons name={icon} size={18} color="#333" />
                      <Text style={{ marginLeft: 10 }}>{cat}</Text>

                    </TouchableOpacity>

                  ))}

                </View>
              )}

            </View>

            {/* Description */}
            <View style={styles.inputGroup}>

              <Text style={styles.inputLabel}>Expense description</Text>

              <TextInput
                style={styles.textInput}
                placeholder="e.g. Bus ticket, Pizza, School fees"
                value={name}
                onChangeText={setName}
              />

            </View>

            {/* Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveItem}
            >

              <Text style={styles.saveButtonText}>
                Add Expense
              </Text>

            </TouchableOpacity>

          </View>

        </ScrollView>

      </SafeAreaView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700'
  },

  heroCard: {
    backgroundColor: '#000',
    margin: 20,
    borderRadius: 24,
    padding: 30,
  },

  heroLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  currencySymbol: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '700',
    marginRight: 10
  },

  amountInput: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: '700',
    flex: 1
  },

  form: {
    paddingHorizontal: 20
  },

  inputGroup: {
    marginBottom: 30
  },

  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontWeight: '600'
  },

  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    fontSize: 18,
    paddingVertical: 10,
    color: '#000'
  },

  saveButton: {
    backgroundColor: '#2DCC70',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },

  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700'
  },

  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2DCC70',
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    gap: 8
  },

  successText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  },

  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingVertical: 12,
  },

  categoryList: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 10,
    elevation: 3
  },

  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2'
  }

});

function SafeAreaView({ children, style }: any) {
  return (
    <View style={[{ paddingTop: Platform.OS === 'android' ? 30 : 0 }, style]}>
      {children}
    </View>
  );
}