import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from './app/navigation/AppNavigator';
import 'react-native-gesture-handler';


export default function App() {
  useEffect(() => {
    // Check if the user is authenticated
    const checkAuthentication = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        // Navigate to the appropriate screen based on authentication state
        navigation.navigate(userToken ? 'HomeScreen' : 'Login');
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Handle error or navigate to Auth screen as fallback
        navigation.navigate('Login');
      }
    };

    // Check authentication when the component mounts
    checkAuthentication();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}