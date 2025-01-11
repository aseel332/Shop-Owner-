import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AddProductScreen1 = ({ navigation }) => {
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [shopId, setShopId] = useState('');
  const [shopName, setShopName] = useState('');
  const [ProductId, setProductId] = useState('');
  const categories = [
    'Electronics',
    'Clothing',
    'Furniture',
    'Books',
    'Toys',
    'Groceries',
    'Cosmetics',
    'Accessories',
    'Sports Equipment',
    'Home Appliances',
    'Stationery',
  ];

  useEffect(() => {
    // Retrieve userEmail and shopId from AsyncStorage
    getUserData();
    generateProductId();
  }, []);
  

  const generateProductId = async () => {
    // Generate a unique shop ID using timestamp
    const timestamp = new Date().getTime();
    setProductId(`product_${timestamp}`);
  };
  
  
  const getUserData = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      const shopId = await AsyncStorage.getItem('shopId');
      const shopName = await AsyncStorage.getItem('shopName');
      if (userEmail && shopId && shopName) {
        setUserEmail(userEmail);
        setShopId(shopId);
        setShopName(shopName);
      } else {
        Alert.alert('Error', 'User data not found');
        // Handle error or navigate to another screen
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data');
      // Handle error
    }
  };

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      setErrorMessage('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({ base64: true });
    if (pickerResult.cancelled === true) {
      return;
    }

    setProductImage(`data:image/jpeg;base64,${pickerResult.base64}`);
    setErrorMessage('');
  };

  const handleNext = async () => {
    if (!productName || !productCategory || !productDescription) {
      setErrorMessage('Please fill in all mandatory fields');
      return;
      
    }
   try {
      const formData = new FormData();
      formData.append('userEmail', userEmail);
      formData.append('shopId', shopId);
      formData.append('shopName', shopName);
      formData.append('productName', productName);
      formData.append('productCategory', productCategory);
      formData.append('productDescription', productDescription);
      formData.append('ProductId', ProductId);
      if (productImage) {
        formData.append('productImage', productImage);
      }

      const response = await axios.post('http://168.150.9.23:3000/api/AddProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
   if (response.status === 201) {
        Alert.alert('Success', 'Product added successfully');
        await AsyncStorage.setItem('ProductId', ProductId);
        navigation.navigate('PriceSetScreen');
      } else {
        Alert.alert('Error', 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add Product</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={handleImageUpload}>
        {productImage ? <Image source={{ uri: productImage }} style={styles.image} /> : <Text>Select Image</Text>}
      </TouchableOpacity>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Product Name *"
        value={productName}
        onChangeText={(text) => setProductName(text)}
      />
      <Picker
        selectedValue={productCategory}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setProductCategory(itemValue)}
      >
        <Picker.Item label="Select Category *" value="" />
        {categories.map((category, index) => (
          <Picker.Item key={index} label={category} value={category} />
        ))}
      </Picker>
      <TextInput
        style={[styles.input, styles.description]}
        placeholder="Product Description *"
        multiline
        numberOfLines={4}
        value={productDescription}
        onChangeText={(text) => setProductDescription(text)}
      />
      <Button title="Next" onPress={handleNext} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  picker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  description: {
    height: 80,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default AddProductScreen1;
