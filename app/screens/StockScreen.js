import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StockScreen = ({ navigation }) => {
  const [stockQuantity, setStockQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [shopId, setShopId] = useState('');
  const [ProductId, setProductId] = useState('');

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      const shopId = await AsyncStorage.getItem('shopId');
      const ProductId = await AsyncStorage.getItem('ProductId');
      setUserEmail(userEmail);
      setShopId(shopId);
      setProductId(ProductId);
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  const handleSaveStock = async () => {
    try {
      const response = await fetch('http:///168.150.9.23:3000/api/stocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          shopId,
          stockQuantity,
          expiryDate,
          ProductId,
        }),
      });
      if (response.ok) {
        console.log('Stock saved successfully');
        navigation.navigate('ProductViewScreen');
      } else {
        console.error('Failed to save stock');
      }
    } catch (error) {
      console.error('Error saving stock:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Stock Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Stock Quantity"
        value={stockQuantity}
        onChangeText={setStockQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Expiry Date (optional)"
        value={expiryDate}
        onChangeText={setExpiryDate}
      />
      <Button title="Save" onPress={handleSaveStock} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default StockScreen;
