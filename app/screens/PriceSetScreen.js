import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const PriceSetScreen = ({ navigation }) => {
  const [productPrice, setProductPrice] = useState('');
  const [pricingPlans, setPricingPlans] = useState([]);
  const [planQuantity, setPlanQuantity] = useState('');
  const [planTotalPrice, setPlanTotalPrice] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
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
      if (userEmail && shopId && ProductId) {
        setUserEmail(userEmail);
        setShopId(shopId);
        setProductId(ProductId);
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  const handleAddProductPrice = async () => {
    try {
      const formData = {
        userEmail: userEmail,
        shopId: shopId,
        productPrice: productPrice,
        pricingPlans: pricingPlans,
        ProductId: ProductId
      };

      const response = await axios.post('http:///168.150.9.23:3000/api/Priceset', formData);

      if (response.status === 201) {
        Alert.alert('Success', 'Product price and pricing plans saved successfully.');
        navigation.navigate('StockScreen');
      } else {
        Alert.alert('Error', 'Failed to save product price and pricing plans.');
      }
    } catch (error) {
      console.error('Error adding product price:', error);
      Alert.alert('Error', 'Failed to save product price and pricing plans. Please try again later.');
    }
  };

  const handleAddPlan = () => {
    const newPlan = {
      quantity: planQuantity,
      totalPrice: planTotalPrice,
    };
    setPricingPlans([...pricingPlans, newPlan]);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Set Product Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Price"
        value={productPrice}
        onChangeText={setProductPrice}
        keyboardType="numeric"
      />
      <Button title="Save" onPress={handleAddProductPrice} />
      
      <Text style={styles.subHeading}>Pricing Plans</Text>
      <Button title="Add Pricing Plan" onPress={() => setModalVisible(true)} />
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalHeading}>Add Pricing Plan</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter Quantity"
              value={planQuantity}
              onChangeText={setPlanQuantity}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Enter Total Price"
              value={planTotalPrice}
              onChangeText={setPlanTotalPrice}
              keyboardType="numeric"
            />
            <Text style={styles.modalInstructions}>
              Enter the quantity and total price for the pricing plan.
            </Text>
            <Button title="Add" onPress={handleAddPlan} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </ScrollView>
        </View>
      </Modal>
      <Text style={styles.pricingPlansTitle}>Pricing Plans:</Text>
      {pricingPlans.map((plan, index) => (
        <Text key={index} style={styles.pricingPlan}>
          For {plan.quantity} products, the total price is Rs. {plan.totalPrice}
        </Text>
      ))}
      <Button title="Next" onPress={() => navigation.navigate('StockScreen')} />
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
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalInstructions: {
    marginBottom: 20,
  },
  pricingPlansTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  pricingPlan: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default PriceSetScreen;
