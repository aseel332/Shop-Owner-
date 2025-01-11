import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, FlatList, BackHandler, ToastAndroid
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFonts, KaushanScript_400Regular } from '@expo-google-fonts/kaushan-script';
import { Kreon_400Regular, Kreon_700Bold } from '@expo-google-fonts/kreon';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: "Open your business to the World!",
    text: "Welcome to City Mall! Take your business online effortlessly. Register your shop, list your products, and reach customers everywhere. Click 'Start Business' to start growing your business today!",
    image: require('C:/Users/XYZ/ShopOwnerApp/assets/first2.png'), // Replace with your image path
  },
  {
    id: '2',
    title: "Larger amount of Audience!",
    text: "Unlock your shop's potential within your city with our app! By registering, you connect with a local audience, boosting visibility and sales. Join us to tap into nearby opportunities and grow your business!",
    image: require('C:/Users/XYZ/ShopOwnerApp/assets/second.png'), // Replace with your image path
  },
  {
    id: '3',
    title: "Fastest Deliveries!",
    text: "Get ready for lightning-fast deliveries! With our app, enjoy quick and efficient delivery of your products within the city. Join us and delight your customers with speedy service!",
    image: require('C:/Users/XYZ/ShopOwnerApp/assets/third.png'), // Replace with your image path
  }
];

const StartupScreen = ({ navigation }) => {
  const [backPressCount, setBackPressCount] = useState(0);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const [isNameImageScreenCompleted, setIsNameImageScreenCompleted] = useState(false);
  const [isLocationScreenCompleted, setIsLocationScreenCompleted] = useState(false);
  const [isOwnerDescriptionCompleted, setIsOwnerDescriptionCompleted] = useState(false);
  const [isShopDescriptionCompleted, setIsShopDescriptionCompleted] = useState(false);
  const [isSubscriptionCompleted, setIsSubscriptionCompleted] = useState(false);

  useEffect(() => {
    const checkScreenCompletion = async () => {
      try {
        const nameImageCompleted = await AsyncStorage.getItem('NameImageScreen_completed');
        const locationCompleted = await AsyncStorage.getItem('LocationScreen_completed');
        const ownerDescriptionCompleted = await AsyncStorage.getItem('OwnerDescriptionCompleted');
        const shopDescriptionCompleted = await AsyncStorage.getItem('ShopDescriptionCompleted');
        const subscriptionCompleted = await AsyncStorage.getItem('SubscriptionCompleted_');

        setIsNameImageScreenCompleted(nameImageCompleted === 'true');
        setIsLocationScreenCompleted(locationCompleted === 'true');
        setIsOwnerDescriptionCompleted(ownerDescriptionCompleted === 'true');
        setIsShopDescriptionCompleted(shopDescriptionCompleted === 'true');
        setIsSubscriptionCompleted(subscriptionCompleted === 'true');
      } catch (error) {
        console.error('Error checking screen completion:', error);
      }
    };

    checkScreenCompletion();
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('userEmail');
        if (userEmail) {
          const response = await axios.get('http://168.150.9.23:3000/api/Subscriptions', {
            params: { userEmail },
          });
          if (response.data && response.data.length > 0) {
            navigation.navigate('HomeScreen');
          }
        } else {
          navigation.navigate('Login'); // Navigate to Login if no email is found in AsyncStorage
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        navigation.navigate('StartUp'); // Handle errors by navigating to the Login screen
      }
    };

    checkSubscription();
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      if (backPressCount === 0) {
        setBackPressCount(1);
        ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
        setTimeout(() => setBackPressCount(0), 2000); // Reset back press count after 2 seconds
        return true;
      } else if (backPressCount === 1) {
        BackHandler.exitApp();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, [backPressCount]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.multiRemove([
        'NameImageScreen_completed',
        'LocationScreen_completed',
        'OwnerDescriptionCompleted',
        'ShopDescriptionCompleted',
        'SubscriptionCompleted_'
      ]);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDeleteProcess = async () => {
    try {
      // Delete AsyncStorage items
      await AsyncStorage.multiRemove([
        'NameImageScreen_completed',
        'LocationScreen_completed',
        'OwnerDescriptionCompleted',
        'ShopDescriptionCompleted',
        'SubscriptionCompleted_'
      ]);
      // Reset screen completion states
      setIsNameImageScreenCompleted(false);
      setIsLocationScreenCompleted(false);
      setIsOwnerDescriptionCompleted(false);
      setIsShopDescriptionCompleted(false);
      setIsSubscriptionCompleted(false);

      // Delete API data associated with userEmail
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (userEmail) {
        await axios.delete('http:///168.150.9.23:3000/api/NameAndImage', {
          params: { userEmail },
          
        });
        await axios.delete('http:///168.150.9.23:3000/api/Locations', {
          params: { userEmail },
          
        });
        await axios.delete('http:///168.150.9.23:3000/api/ShopDescription', {
          params: { userEmail },
          
        });
        await axios.delete('http:///168.150.9.23:3000/api/OwnerDescription', {
          params: { userEmail },
          
        });
        await axios.delete('http:///168.150.9.23:3000/api/Subscriptions', {
          params: { userEmail },
          
        });
      }

      navigation.navigate('StartUp');
    } catch (error) {
      console.error('Error deleting process:', error);
    }
  };

  const toggleSlider = () => {
    setIsSliderOpen(!isSliderOpen);
  };

  const navigateToNextScreen = () => {
    if (!isNameImageScreenCompleted) {
      navigation.navigate('NameImageScreen');
    } else if (!isLocationScreenCompleted) {
      navigation.navigate('LocationScreen');
    } else if (!isShopDescriptionCompleted) {
      navigation.navigate('ShopDescriptionScreen');
    } else if (!isOwnerDescriptionCompleted) {
      navigation.navigate('OwnerDescriptionScreen');
    } else if (!isSubscriptionCompleted) {
      navigation.navigate('SubscriptionScreen');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.greenBox}>
        <TouchableOpacity style={styles.sliderButton} onPress={toggleSlider}>
          <Text style={styles.sliderButtonText}>{isSliderOpen ? 'X' : '☰'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={sliderRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(slideIndex);
        }}
      />
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
      {((isNameImageScreenCompleted || isLocationScreenCompleted || isOwnerDescriptionCompleted || isShopDescriptionCompleted || isSubscriptionCompleted) &&
        <TouchableOpacity style={styles.button} onPress={navigateToNextScreen}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      )}
      {!isNameImageScreenCompleted && !isLocationScreenCompleted && !isOwnerDescriptionCompleted && !isShopDescriptionCompleted && !isSubscriptionCompleted &&
        <TouchableOpacity style={styles.button} onPress={navigateToNextScreen}>
          <Text style={styles.buttonText}>Start Business</Text>
        </TouchableOpacity>
      }
      {isSliderOpen && (
        <View style={styles.slider}>
          <TouchableOpacity style={styles.sliderOption} onPress={handleLogout}>
            <Text style={styles.sliderOptionText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sliderOption} onPress={handleDeleteProcess}>
            <Text style={styles.sliderOptionText}>Delete Process</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const renderSlide = ({ item }) => (
  <View style={styles.slide}>
    <Text style={[styles.text, styles.head]}>{item.title}</Text>
    <Text style={[styles.text1, styles.mid]}>{item.text}</Text>
    <ImageBackground
      source={item.image}
      style={styles.image}
      resizeMode="cover"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  greenBox: {
    width: width,
    height: height / 7.33044954,
    backgroundColor: '#31772B',
    top: 0,
  },
  button: {
    position: 'absolute',
    top: height / 1.12,
    height: height / 13.7931034,
    width: width / 1.36888,
    backgroundColor: '#31772B',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontFamily: 'Kreon_700Bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  slide: {
    width,
    height: height - height / 7.33044954,
    top: -100,
  },
  sliderButton: {
    position: 'absolute',
    left: width / 21.1764706,
    top: height / 14.2857143,
    zIndex: 999,
    width: width / 9.729,
    height: height / 32.3636,
  },
  sliderButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  slider: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    zIndex: 998,
  },
  sliderOption: {
    paddingVertical: 10,
  },
  sliderOptionText: {
    fontSize: 18,
    color: '#000',
  },
  text: {
    fontFamily: 'KaushanScript_400Regular',
    color: '#FFFFFF',
    position: 'absolute',
  },
  head: {
    fontSize: 36,
    width: 350,
    top: height / 6.50406504,
    left: width / 60,
    color: '#000000',
  },
  image: {
    position: 'absolute',
    width: width / 3.195,
    height: height / 4.444,
    top: height / 3.125,
    left: width / 2.99346939,
    opacity: 1,
    borderRadius: 94,
    alignContent: 'center',
  },
  text1: {
    position: 'absolute',
    fontSize: 20,
  },
  mid: {
    position: 'absolute',
    width: width / 1.097,
    height: height / 4.25531,
    justifyContent: 'center',
    top: height / 1.716732,
    left: width / 21.1764,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    top: height / 1.20663,
  },
  paginationDot: {
    width: 13,
    height: 13,
    borderRadius: 13,
    marginHorizontal: 8,
  },
  activeDot: {
    backgroundColor: '#31772B',
  },
  inactiveDot: {
    backgroundColor: '#C4C4C4',
  },
});

export default StartupScreen;
