import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TextInput, Alert, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground, TouchableOpacity, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFonts, KaushanScript_400Regular } from '@expo-google-fonts/kaushan-script';
import { Kreon_400Regular, Kreon_700Bold } from '@expo-google-fonts/kreon';

const { width, height } = Dimensions.get('window');

const NameImageScreen = ({ navigation }) => {
  const [shopName, setShopName] = useState('');
  const [shopImage, setShopImage] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [shopId, setShopId] = useState('');
  const [username, setUsername] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    getUserEmail();
    generateShopId();
    
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const getUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        setUserEmail(email);
      }
    } catch (error) {
      console.error('Error retrieving user email:', error);
    }
  };

  const generateShopId = async () => {
    const timestamp = new Date().getTime();
    setShopId(`shop_${timestamp}`);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      setShopImage(pickerResult.uri);
    }
  };

  const handleNext = async () => {
    if (!shopName) {
      Alert.alert('Error', 'Please enter a shop name.');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('email', userEmail);
      formData.append('shopName', shopName);
      formData.append('shopId', shopId);
      formData.append('username', username);

      if (shopImage) {
        formData.append('shopImage', {
          uri: shopImage,
          name: 'shopImage.jpg',
          type: 'image/jpeg',
        });
      }

      const response = await axios.post('http://168.150.9.23:3000/api/NameAndImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        await AsyncStorage.setItem('NameImageScreen_completed', 'true');
        await AsyncStorage.setItem('shopId', shopId);
        await AsyncStorage.setItem('shopName', shopName);
        navigation.navigate('LocationScreen');
      } else {
        const errorData = response.data;
        Alert.alert('Error', errorData.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error uploading shop data:', error);
      Alert.alert('Error', 'Failed to upload shop data. Please try again later.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ImageBackground
        source={require('C:/Users/XYZ/ShopOwnerApp/assets/build1.png')}
        style={styles.image}
        resizeMode="cover"
      />
      <ImageBackground
        source={require('C:/Users/XYZ/ShopOwnerApp/assets/th 4.png')}
        style={styles.clay}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.greenBox}></View>
      <Text style={[styles.text, styles.head]}>Step 1:</Text>
      
      <TouchableOpacity onPress={pickImage} style={[styles.imageUploadContainer, keyboardVisible && styles.imageUploadContainerKeyboardVisible]}>
        <ImageBackground
          source={require('C:/Users/XYZ/ShopOwnerApp/assets/shop.png')}
          style={styles.image2}
          resizeMode="cover"
        />
        <Text style={[styles.text1, styles.mid]}>Upload photos for your shop</Text>
      </TouchableOpacity>
      <View style={[styles.formContainer, keyboardVisible && styles.formContainerKeyboardVisible]}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter the name of your shop"
          value={shopName}
          onChangeText={(text) => setShopName(text)}
          placeholderTextColor="#999"
        />
        <Text style={[styles.text1, styles.label]}>Name:</Text>
        <Text style={[styles.text1, styles.pass]}>Username:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Create a username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          placeholderTextColor="#999"
        />
        <Text style={[styles.text1, styles.low]}>The name and image you enter would be displayed to the customers</Text>
        <TouchableOpacity>
        <Text style={[styles.text1, styles.lower]}>Preview</Text>
      </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
     
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    position: 'absolute',
    top: height / 1.80995475,
    left: width / 12.413793,
    width: '85.5555556%',
  },
  formContainerKeyboardVisible: {
    top: height / 3, // Adjust as needed
  },
  textInput: {
    borderColor: '#000',
    borderBottomWidth: 1,
    paddingLeft: 2,
    marginTop: -15,
    borderRadius: 5,
    backgroundColor: '#fff',
    height: height / 15.3846154,
  },
  text: {
    fontFamily: 'KaushanScript_400Regular',
    color: '#FFFFFF',
    position: 'absolute',
  },
  text1: {
    fontFamily: 'Kreon_400Regular',
    color: '#31772B',
  },
  head: {
    fontSize: 36,
    width: 350,
    marginTop: height / 7.2072,
    marginLeft: width / 18,
    color: '#000000',
  },
  mid: {
    top:height/6.5,
    alignSelf: 'center',
    fontSize: 20,
  },
  low: {
    height: height / 20,
    width: width / 1.18032787,
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
    marginTop: height / 30,
    textAlign: 'center',
  },
  lower: {
    fontSize: 32,
    marginTop: 15,
    alignSelf: 'center',
  },
  pass: {
    fontSize: 16,
    marginLeft: width / 150,
    marginTop: 10,
    marginBottom:22,
  },
  label:{
    position:'absolute',
    marginLeft: width / 150,
    marginTop:-30,
    fontSize:16,
  },
  image: {
    position: 'absolute',
    width: width * 3.01388889,
    height: height * 1.51,
    top: 0,
    left: width / -1.22866894,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
  },
  clay: {
    position: 'absolute',
    width: width,
    height: height / 2.25988701,
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.1,
  },
  image2: {
    height: height / 4.4444,
    width: width / 2.79512195,
    top: height/7,
    alignSelf: 'center',
  },
  greenBox: {
    width: width,
    height: height / 7.33044954,
    backgroundColor: '#31772B',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1, // Make sure greenBox is on top
  },
  imageUploadContainer: {
    position: 'absolute',
    top: height / 19,
    left: width / 4,
    alignItems: 'center',
    zIndex: 0, // Ensure this is below greenBox
  },
  imageUploadContainerKeyboardVisible: {
    top: -height / 7, // Adjust as needed
    marginBottom:15,
  },
  button: {
    position: 'absolute',
    top: height / 1.12044818,
    left: width / 7.05882353,
    height: height / 13.7931034,
    width: width / 1.368821,
    backgroundColor: '#31772B',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
});

export default NameImageScreen;
