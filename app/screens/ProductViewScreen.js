import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProductViewScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      const shopId = await AsyncStorage.getItem('shopId');

      const response = await axios.get(`http://168.150.9.23:3000/api/AddProduct`, {
        params: {
          userEmail: userEmail,
          shopId: shopId,
        }
      });

      if (response.status === 200) {
        const data = response.data;
        if (Array.isArray(data)) {
          setProducts(data);
          const uniqueCategories = [...new Set(data.map(product => product.productCategory))];
          setCategories(uniqueCategories);
        } else {
          console.error('Invalid response data:', data);
        }
      } else {
        console.error('Failed to fetch products:', response.status);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductPress = async (product) => {
    navigation.navigate('ProductDetailScreen', { productId: product.ProductId });
    await AsyncStorage.setItem('ProductId', product.ProductId);
  };

  const handleAddProduct = () => {
    navigation.navigate('AddProductScreen1');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => handleProductPress(item)}>
      {item.productImage && <Image source={{ uri: item.productImage }} style={styles.productImage} />}
      <Text style={styles.productName}>{item.productName}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Refresh data when the component gains focus
      getProducts();
      // Delete ProductId from AsyncStorage when navigating back to this screen
      AsyncStorage.removeItem('ProductId');
    });

    // Cleanup function to remove the listener when the component unmounts
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={selectedCategory ? products.filter(product => product.productCategory === selectedCategory) : products}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={() => <Text style={styles.noProductText}>No products found</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  productItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  noProductText: {
    fontSize: 16,
    color: 'gray',
    alignSelf: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default ProductViewScreen;
