// ShopNameScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ImageBackground } from 'react-native';
import { useFonts, KaushanScript_400Regular } from '@expo-google-fonts/kaushan-script';
import { Kreon_400Regular, Kreon_700Bold } from '@expo-google-fonts/kreon';
import * as SplashScreen from 'expo-splash-screen';


const { width, height } = Dimensions.get('window');

const ShopNameScreen = ({ navigation }) => {
  const [isReady, setIsReady] = useState(false);
  let [fontsLoaded] = useFonts({
    KaushanScript_400Regular,
    Kreon_400Regular, Kreon_700Bold,
  });
  useEffect(() => {
    const prepare = async () => {
      if (fontsLoaded) {
        // Hide the splash screen once fonts are loaded
        await SplashScreen.hideAsync();
        setIsReady(true);
      }
    };

    

    prepare();

    const timer = setTimeout(() => {
      navigation.navigate('AuthLoading');
    }, 1500); // Delay for 1.5 seconds

    return () => clearTimeout(timer);
  }, [fontsLoaded, navigation]);

  if (!isReady) {
    return null; // Render nothing while loading
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
    <ImageBackground
        source={require('C:/Users/XYZ/ShopOwnerApp/assets/th 2.jpg')}  // Replace with your image path
        style={styles.image}
        resizeMode="cover"
      />

<ImageBackground
        source={require('C:/Users/XYZ/ShopOwnerApp/assets/clouds.jpg')}  // Replace with your image path
        style={styles.clay}
        resizeMode="cover"
      />
        <View style={styles.overlay} />

    
      <Text style={[styles.text, styles.cityMall]}>City Mall</Text>
      <Text style={[styles.text, styles.forOwners]}>for Owners</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#31772B',
  },
  text: {
    fontFamily: 'KaushanScript_400Regular',
    color: '#FFFFFF',
    position: 'absolute',
  },
  cityMall: {
    fontSize: 64,
    left: (width - 241 * 93) / 2, // 64 * 6 is an approximate width of the text
    top: 400,
    left : 78,
  },
  forOwners: {
    fontSize: 36,
    left: (width - 24 * 9) / 2, // 24 * 9 is an approximate width of the text
    top: 485,
    left: 125,
  },

  image: {
    
    width: 450,
    height:1100,
    left: 5,
    top: 145,
    alignItems: 'center', // Center content vertically
    justifyContent: 'center', // Center content horizontally
    color: '#31772B',
    overlayColor:'#31772B',
  },

  clay:{

    width: 440,
    height:450,
    left: -10,
    top: -800,
    alignItems: 'center', // Center content vertically
    justifyContent: 'center', // Center content horizontally
    color: '#31772B',
    overlayColor:'#31772B'
  },

  
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fill the entire parent container
    backgroundColor: 'rgba(49, 119, 43, 0.5)',
    overlayColor:'#31772B' // Adjust color and opacity (rgba) for multiply effect
  },
});

export default ShopNameScreen;
