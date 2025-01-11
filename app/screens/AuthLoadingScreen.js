import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if the user is authenticated
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          // User is logged in, navigate to the home screen
          navigation.navigate('StartUp');
        } else {
          // User is not logged in, navigate to the login screen
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Navigate to the login screen in case of an error
        navigation.navigate('Login');
      }
    };

    // Check authentication when the component mounts
    checkAuthentication();
  }, [navigation]);
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthLoadingScreen;