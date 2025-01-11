import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SubscriptionScreen = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [shopId, setShopId] = useState('');

  useEffect(() => {
    // Fetch user email from AsyncStorage when component mounts
    getUserEmail();
  }, []);

  const getUserEmail = async () => {
    try {
      // Fetch user email from AsyncStorage
      const email = await AsyncStorage.getItem('userEmail');
      const shopId = await AsyncStorage.getItem('shopId', shopId);
      if (email && shopId) {
        setUserEmail(email);
        setShopId(shopId);
      }
    } catch (error) {
      console.error('Error fetching user email:', error);
    }
  };

  const handleNext = async () => {
    if (!selectedPlan || !userEmail) {
      // Display an error message if no plan is selected or user email is not available
      alert('Please select a subscription plan.');
      return;
    }

    try {
      // Send subscription data to the server along with user email
      await axios.post('http:///168.150.9.23:3000/api/Subscriptions', {
        plan: selectedPlan,
        productsLimit: getProductsLimit(selectedPlan), // Function to get product limit based on plan
        premiumFeatures: checkPremiumFeatures(selectedPlan), // Function to check premium features based on plan
        userEmail: userEmail, // Include user email in the request
        shopId: shopId,
      });

      // Store completion status in AsyncStorage with user email
      await AsyncStorage.setItem('SubscriptionCompleted_', 'true');

      // Navigate to the next screen (ProductViewScreen)
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Error creating subscription:', error);
      // Handle error, such as displaying an error message to the user
      alert('Failed to create subscription. Please try again later.');
    }
  };

  // Function to get product limit based on selected plan
  const getProductsLimit = (plan) => {
    switch (plan) {
      case 'plan1':
        return 50;
      case 'plan2':
        return 100;
      case 'plan3':
        return 60;
      default:
        return 0;
    }
  };

  // Function to check premium features based on selected plan
  const checkPremiumFeatures = (plan) => {
    return plan === 'plan3'; // Premium features are available only for 'plan3'
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose a Subscription Plan:</Text>
      <View style={styles.option}>
        <RadioButton
          label="Rs. 500/month - List 50 products"
          value="plan1"
          selected={selectedPlan === 'plan1'}
          onSelect={() => setSelectedPlan('plan1')}
        />
      </View>
      <View style={styles.option}>
        <RadioButton
          label="Rs. 1000/month - List 100 products"
          value="plan2"
          selected={selectedPlan === 'plan2'}
          onSelect={() => setSelectedPlan('plan2')}
        />
      </View>
      <View style={styles.option}>
        <RadioButton
          label="Rs. 800/month - List 60 products with premium features"
          value="plan3"
          selected={selectedPlan === 'plan3'}
          onSelect={() => setSelectedPlan('plan3')}
        />
      </View>
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const RadioButton = ({ label, value, selected, onSelect }) => {
  return (
    <View style={styles.radioButtonContainer}>
      <Text>{label}</Text>
      <Button title={selected ? 'Selected' : 'Select'} onPress={onSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default SubscriptionScreen;
