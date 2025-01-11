import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, BackHandler, ToastAndroid, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [backPressCount, setBackPressCount] = useState(0);
  const [shopName, setShopName] = useState('');
  const [shopId, setShopId] = useState('');
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchShopName();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const deleteShopData = async () => {
      await AsyncStorage.removeItem('shopId');
      await AsyncStorage.removeItem('shopName');
    };
    deleteShopData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (backPressCount === 0) {
        setBackPressCount(1);
        ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
        setTimeout(() => setBackPressCount(0), 2000);
        return true;
      } else if (backPressCount === 1) {
        BackHandler.exitApp();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, [backPressCount]);

  const fetchShopName = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (userEmail) {
        const response = await axios.get('http://168.150.9.23:3000/api/NameAndImage', {
          params: {
            userEmail: userEmail,
          }
        });
        if (response.data && response.data.length > 0) {
          const shopData = response.data[0];
          setShopName(shopData.name);
          setShopId(shopData.shopId);
        }
      }
    } catch (error) {
      console.error('Error fetching shop name:', error);
    }
  };

  const handleShopView = async () => {
    await AsyncStorage.setItem('shopId', shopId);
    await AsyncStorage.setItem('shopName', shopName);
    navigation.navigate('ProductViewScreen');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userEmail');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDeleteShop = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      await axios.delete(`http://168.150.9.23:3000/api/NameAndImage`, {
        params: {
          userEmail: userEmail,
        }
      });
      await axios.delete(`http://168.150.9.23:3000/api/Locations`, {
        params: {
          userEmail: userEmail,
        }
      });
      await axios.delete(`http://168.150.9.23:3000/api/ShopDescription`, {
        params: { 
          userEmail: userEmail,
          shopId: shopId
        }
      });
      await axios.delete(`http://168.150.9.23:3000/api/OwnerDescription`, {
        params: {
          userEmail: userEmail,
        }
      });
      await axios.delete(`http://168.150.9.23:3000/api/Subscriptions`, {
        params: {
          userEmail: userEmail,
        }
      });
      setShopName('');
      Alert.alert('Shop Deleted', 'Your shop has been deleted successfully.');
    } catch (error) {
      console.error('Error deleting shop:', error);
    }
    navigation.navigate('StartUp');
  };

  const toggleSlider = () => {
    setIsSliderOpen(!isSliderOpen);
  };

  return (
    <LinearGradient
      colors={['#94CCFF', '#F7F9FB']}
      style={{ flex: 1 }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.8 }}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.sliderButton} onPress={toggleSlider}>
          <Text style={styles.sliderButtonText}>{isSliderOpen ? 'X' : '☰'}</Text>
        </TouchableOpacity>
        {isSliderOpen && (
          <View style={styles.slider}>
            <TouchableOpacity style={styles.sliderOption} onPress={() => navigation.navigate('ManageSubscription')}>
              <Text>Manage Subscription</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sliderOption} onPress={() => navigation.navigate('Help')}>
              <Text>Help</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sliderOption} onPress={handleLogout}>
              <Text>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sliderOption} onPress={handleDeleteShop}>
              <Text>Delete Shop</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.welcomeText}>Welcome to our app!</Text>
        
            <TouchableOpacity style={styles.shopBox} onPress={handleShopView}>
              <Text style={styles.shopText}>{shopName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deliveryBox}>
              <Text style={styles.shopText}>Deliver</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.promotionsBox}>
              <Text style={styles.shopText}>Promotions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.whatsGoingOnBox}>
              <Text style={styles.shopText}>What's going on?</Text>
            </TouchableOpacity>
        
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 999,
  },
  sliderButtonText: {
    fontSize: 20,
  },
  slider: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    zIndex: 998,
  },
  sliderOption: {
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  shopBox: {
    position: 'absolute',
    top: width * 0.38,
    left: width * 0.05,
    width: width * 0.45,
    height: width * 0.45,
    backgroundColor: '#DAEAF9',
    borderRadius: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 13,
    elevation: 7,
  },
  deliveryBox: {
    position: 'absolute',
    top: width * 0.38,
    left: width * 0.55,
    width: width * 0.28,
    height: width * 0.28,
    backgroundColor: '#DAEAF9',
    borderRadius: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 13,
    elevation: 7,
  },
  promotionsBox: {
    position: 'absolute',
    top: width * 0.67,
    left: width * 0.05,
    width: width * 0.28,
    height: width * 0.28,
    backgroundColor: '#DAEAF9',
    borderRadius: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 13,
    elevation: 7,
  },
  whatsGoingOnBox: {
    position: 'absolute',
    top: width * 0.67,
    left: width * 0.55,
    width: width * 0.45,
    height: width * 0.45,
    backgroundColor: '#DAEAF9',
    borderRadius: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 13,
    elevation: 7,
  },
  createShopBox: {
    position: 'absolute',
    top: width * 0.38,
    left: width * 0.05,
    width: width * 0.28,
    height: width * 0.28,
    backgroundColor: '#DAEAF9',
    borderRadius: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 13,
    elevation: 7,
  },
  shopText: {
    fontFamily: 'Myanmar Khyay',
    fontSize: width * 0.05,
  },
});

export default HomeScreen;
