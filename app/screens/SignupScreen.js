// SignupScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from '../firebase.js'; // Adjust the path as per your project structure

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignupWithEmail = () => {
    const auth = getAuth(firebaseApp);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        // Navigate to the home screen or do something else
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert('Error', errorMessage);
      });
  };

  const handleSignupWithPhone = () => {
    // Implement phone number authentication here
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Sign Up with Email" onPress={handleSignupWithEmail} />
      
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
      />
      <Button title="Sign Up with Phone Number" onPress={handleSignupWithPhone} />
    </View>
  );
};

export default SignupScreen;
