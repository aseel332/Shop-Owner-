import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, KeyboardAvoidingView, StyleSheet, Dimensions, Platform, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFonts, KaushanScript_400Regular } from '@expo-google-fonts/kaushan-script';
import { Kreon_400Regular, Kreon_700Bold } from '@expo-google-fonts/kreon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const ShopDescriptionScreen = ({ navigation }) => {
  const [shopType, setShopType] = useState('');
  const [description, setDescription] = useState('');
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
      const shopId = await AsyncStorage.getItem('shopId');
      if (email && shopId) {
        setUserEmail(email);
        setShopId(shopId);
      }
    } catch (error) {
      console.error('Error fetching user email:', error);
    }
  };

  const handleNext = async () => {
    // Validate shop type and description
    if (!shopType || !description || !userEmail) {
      Alert.alert('Error', 'Please select a shop type, enter a description, and provide your email.');
      return;
    }

    try {
      // Send data to server
      const response = await fetch('http:///168.150.9.23:3000/api/ShopDescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shopType, description, userEmail, shopId }),
      });

      if (response.ok) {
        // If data was successfully stored, set completion status and navigate to the next screen
        await AsyncStorage.setItem('ShopDescriptionCompleted', 'true');
        navigation.navigate('OwnerDescriptionScreen');
      } else {
        // Handle error response
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error uploading shop description:', error);
      Alert.alert('Error', 'Failed to upload shop description. Please try again later.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
        <Text style={[styles.text, styles.head]}>Step 3:</Text>

        <View style={styles.stepContainer}>
          <Text style={[styles.text1, styles.label]}>Category of your shop:</Text>
          <Picker
            selectedValue={shopType}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setShopType(itemValue)}
          >
            <Picker.Item label="Select shop type" value="" />
            <Picker.Item label="Grocery" value="Grocery" />
            <Picker.Item label="Clothing" value="Clothing" />
            <Picker.Item label="Electronics" value="Electronics" />
            {/* Add more shop types as needed */}
          </Picker>

          <Text style={[styles.text1, styles.pass]}>Description:</Text>
          <TextInput
            multiline
            numberOfLines={4}
            style={styles.textInput}
            value={description}
            onChangeText={setDescription}
            onSubmitEditing={Keyboard.dismiss} // Dismiss keyboard on submit
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stepContainer: {
    marginTop: height / 7.2072, // Adjust as needed for positioning
    paddingHorizontal: width / 18,
  },
  textInput: {
    borderColor: '#31772B',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    borderColor: '#31772B',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  button: {
    position: 'absolute',
    bottom: height / 13.7931034,
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
    color: '#000000',
  },
  pass: {
    fontSize: 16,
    marginLeft: width / 150,
    marginTop: 10,
    marginBottom: 22,
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
  greenBox: {
    width: width,
    height: height / 7.33044954,
    backgroundColor: '#31772B',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1, // Make sure greenBox is on top
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
});

export default ShopDescriptionScreen;
