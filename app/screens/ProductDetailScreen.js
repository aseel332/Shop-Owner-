import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetailScreen = () => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product details when component mounts
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    try {
      // Retrieve user email, product ID, and shop ID from AsyncStorage
      const userEmail = await AsyncStorage.getItem('userEmail');
      const ProductId = await AsyncStorage.getItem('ProductId');
      const shopId = await AsyncStorage.getItem('shopId');

      if (userEmail && ProductId && shopId) {
        // Fetch product details from the server
        const response = await axios.get('http://168.150.9.23:3000/api/Priceset', {
          params: { userEmail, ProductId, shopId }
        });

        if (response.status === 200) {
          // Set the product state with the retrieved data
          setProduct(response.data);
        } else {
          console.error('Failed to fetch product details:', response.status);
        }
      } else {
        console.error('User email, product ID, or shop ID not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  return (
    <View style={styles.container}>
      {product ? (
        <>
          <Text style={styles.heading}>{product.productName}</Text>
          <Text style={styles.detail}>Product Price: {product.productPrice}</Text>
          <Text style={styles.subHeading}>Pricing Plans</Text>
          {product.pricingPlans.map((plan, index) => (
            <Text key={index} style={styles.detail}>
              For {plan.quantity} products, the total price is Rs. {plan.totalPrice}
            </Text>
          ))}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
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
  detail: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ProductDetailScreen;
