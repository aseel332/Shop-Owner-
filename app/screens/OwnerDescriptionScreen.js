import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet, TouchableOpacity, Image, Dimensions, ImageBackground } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const OwnerDescriptionScreen = ({ navigation }) => {
  const [ownerName, setOwnerName] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [idCard, setIdCard] = useState(null);
  const [shopDocument, setShopDocument] = useState(null);
  const [gstNumber, setGstNumber] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [shopId, setShopId] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    getUserEmail();
  }, []);

  const getUserEmail = async () => {
    try {
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

  const handleDone = async () => {
    if (!ownerName || !dob || !phoneNumber || !address || !gstNumber || !userEmail) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('ownerName', ownerName);
      formData.append('dob', dob);
      formData.append('phoneNumber', phoneNumber);
      formData.append('address', address);
      if (profilePhoto) {
        formData.append('profilePhoto', {
          uri: profilePhoto,
          name: 'profilePhoto',
          type: 'image/*',
        });
      }
      if (idCard) {
        formData.append('idCard', {
          uri: idCard,
          name: 'idCard',
          type: 'image/*',
        });
      }
      if (shopDocument) {
        formData.append('shopDocument', {
          uri: shopDocument,
          name: 'shopDocument',
          type: 'image/*',
        });
      }
      formData.append('gstNumber', gstNumber);
      formData.append('userEmail', userEmail);
      formData.append('shopId', shopId);

      const response = await axios.post('http://168.150.9.23:3000/api/OwnerDescription', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        await AsyncStorage.setItem('OwnerDescriptionCompleted', 'true');
        navigation.navigate('SubscriptionScreen');
      } else {
        console.error('Failed to upload owner description data');
      }
    } catch (error) {
      console.error('Error uploading owner description data:', error);
    }
  };

  const pickDocument = async (setDocument) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (result.type === 'success') {
        setDocument(result.uri);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  return (
    
    <View style={styles.container}>
      <View style={styles.greenBox}></View>
      <ScrollView>
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
  
  
  <Text style={[styles.text, styles.head]}>Step 4:</Text>
     
      <View style={styles.profilePhotoContainer}>
        <TouchableOpacity onPress={() => pickDocument(setProfilePhoto)}>
          <View style={styles.profilePhotoPlaceholder}>
            {profilePhoto ? (
              <Image source={require('C:/Users/XYZ/ShopOwnerApp/assets/th 12Profile image.png')} style={styles.profilePhoto} />
            ) : (
              <Text style={styles.uploadText}>Click to upload your profile photo</Text>
            )}
          </View>
        </TouchableOpacity>
        <Text style={[styles.label, styles.naming]}>Name:</Text>
        <TextInput
          value={ownerName}
          onChangeText={text => setOwnerName(text)}
          style={styles.input}
        />
      </View>

      <Text style={styles.label}>Date of Birth:</Text>
      <TextInput
        value={dob}
        onChangeText={text => setDob(text)}
        style={styles.input}
      />

      <Text style={styles.label}>Phone Number:</Text>
      <TextInput
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
        style={styles.input}
      />

      <Text style={styles.label}>Address:</Text>
      <TextInput
        value={address}
        onChangeText={text => setAddress(text)}
        multiline
        style={styles.textArea}
      />

      <Text style={styles.label}>Upload Identity Card (Photo or PDF):</Text>
      <Button title="Select Identity Card" onPress={() => pickDocument(setIdCard)} />
      {idCard && <Text style={styles.fileName}>{idCard}</Text>}

      <Text style={styles.label}>Upload Shop Legal Document (Photo or PDF):</Text>
      <Button title="Select Shop Document" onPress={() => pickDocument(setShopDocument)} />
      {shopDocument && <Text style={styles.fileName}>{shopDocument}</Text>}

      <Text style={styles.label}>GST Number:</Text>
      <TextInput
        value={gstNumber}
        onChangeText={text => setGstNumber(text)}
        style={styles.input}
      />

      <Button title="Done" onPress={handleDone} color="#007BFF" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  naming:{

  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 0,
    marginTop:50,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#F9F9F9',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#F9F9F9',
    height: 60,
  },
  profilePhotoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: height/10,
    alignSelf:'center',
  },
  profilePhotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  uploadText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  fileName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
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
  text: {
    fontFamily: 'KaushanScript_400Regular',
    color: '#FFFFFF',
    position: 'absolute',
  },
  head: {
    fontSize: 48,
    width: 350,
    top: height/9.5,
    marginLeft: 0.2,
    color: '#000000',
  },
});

export default OwnerDescriptionScreen;
