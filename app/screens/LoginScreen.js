import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView,Keyboard } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useFonts, KaushanScript_400Regular } from '@expo-google-fonts/kaushan-script';
import { Kreon_400Regular, Kreon_700Bold } from '@expo-google-fonts/kreon';
import firebaseApp from '../firebase.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  

  let [fontsLoaded] = useFonts({
    KaushanScript_400Regular,
    Kreon_400Regular,
    Kreon_700Bold,
  });
    const handleEmailLogin = () => {
    const auth = getAuth(firebaseApp);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        AsyncStorage.multiSet([
          ['userEmail', email],
          ['userToken', user.accessToken],
        ])
          .then(() => {
            console.log('User email and token stored successfully:', email, user.accessToken);
            navigation.navigate('StartUp');
          })
          .catch((error) => {
            console.error('Error storing user data:', error);
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert('Error', errorMessage);
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      
      <ImageBackground
        source={require('C:/Users/XYZ/ShopOwnerApp/assets/build1.png')} // Replace with your image path
        style={styles.image}
        resizeMode="cover"
      />
      <ImageBackground
        source={require('C:/Users/XYZ/ShopOwnerApp/assets/th 4.png')} // Replace with your image path
        style={styles.clay}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <Text style={[styles.text, styles.head]}>Welcome to City Mall for owners</Text>
      <Text style={[styles.text1, styles.mid]}>Login</Text>
      <Text style={[styles.text1, styles.email]}>E-mail:</Text>
      <TextInput
        style={[styles.textInput, styles.emailInput]}
        placeholder="Type your e-mail"
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholderTextColor="#999"
      />
      <Text style={[styles.text1, styles.pass]}>Password:</Text>
      <TextInput
        style={[styles.textInput, styles.passwordInput]}
        placeholder="Type your password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button} onPress={handleEmailLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bbb} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>Don't have an account?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
        <Text style={styles.forgetPasswordText}>Forget password?</Text>
      </TouchableOpacity>
      
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  
  bbb:{
    position:'absolute',
    backgroundColor:'#FFFFFF',
    

  },
   
  textInput: {
    height: 50,
    borderColor: '#000',
    borderBottomWidth: 1,
    paddingLeft: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    height: height/15.3846154,
  },
  
  emailInput: {
    width: '89.1666667%',
    position: 'absolute',
    top: height/2.93040293,
  },
  passwordInput: {
    width: '89.1666667%',
    position: 'absolute',
    top: height/2.19178082,
  },
  text: {
    fontFamily: 'KaushanScript_400Regular',
    color: '#FFFFFF',
    position: 'absolute',
  },
  text1: {
    fontFamily: 'Kreon_400Regular',
    color: '#31772B',
    position: 'absolute',
  },
  head: {
    fontSize: 36,
    width: 350,
    top: height/12.9032258,
    left: width/18.9473684,
    color: '#000000',
  },
  mid: {
    fontFamily: 'Kreon_700Bold',
    fontSize: 48,
    alignContent: 'center',
    top: height/4.8192771,
  },
  email: {
    fontSize: 16,
    left: width/13.333333,
    top: height/3.2388664,
  },
  pass: {
    fontSize: 16,
    left: width/13.333333,
    top: height/2.31884058,
  },
  signupText: {
    position: 'absolute',
    height:height/40,
    width:width/2.5294118,
    top: 20,
    right:width/27.6923077,
    color: '#000000',
    fontFamily: 'Kreon_400Regular',
    fontSize: 16,
    textDecorationLine: 'underline',
    opacity:0.5,
  },
  image: {
    position: 'absolute',
    width: width*3.01388889,
    height: height*1.51,
    top: height*0,
    left: width/-1.22866894,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  clay: {
    position: 'absolute',
    width: width,
    height: height / 2.25988701,
    top: height*0,
    left: width*0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.1,
  },
  button: {
    position: 'absolute',
    top: height / 1.70575693,
    left: width / 3.75,
    height: height / 17.3913043,
    width: width / 2.19512195,
    backgroundColor: '#31772B',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Kreon_700Bold',
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  
  forgetPasswordText: {
    position: 'absolute',
    width:width/3.10344828,
    top:20,
    rigth:width/1.6,
    color: '#000000',
    fontFamily: 'Kreon_400Regular',
    fontSize: 16,
    opacity:0.5,
  },
});

export default LoginScreen;
