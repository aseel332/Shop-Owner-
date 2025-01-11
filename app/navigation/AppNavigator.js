import React from 'react';
//import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import NameImageScreen from '../screens/NameImageScreen';
import LocationScreen from '../screens/LocationScreen';
import ShopDescriptionScreen from '../screens/ShopDescriptionScreen';
import OwnerDescriptionScreen from '../screens/OwnerDescriptionScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import ProductViewScreen from '../screens/ProductViewScreen';
import AddProductScreen1 from '../screens/AddProductScreen1';
import PriceSetScreen from '../screens/PriceSetScreen';
import StockScreen from '../screens/StockScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ShopNameScreen from '../screens/ShopNameScreen';
import StartupScreen from '../screens/StartupScreen';


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ShopName" >
       <Stack.Screen name="ShopName" component={ShopNameScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} options={{ headerShown: false }} /> 
      <Stack.Screen name="StartUp" component={StartupScreen} options={{ headerShown: false }}/>
     <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen}/>
      <Stack.Screen name="HomeScreen" component={HomeScreen}  />
      <Stack.Screen name="NameImageScreen" component={NameImageScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="LocationScreen" component={LocationScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="ShopDescriptionScreen" component={ShopDescriptionScreen}options={{ headerShown: false }}/>
      <Stack.Screen name="OwnerDescriptionScreen" component={OwnerDescriptionScreen}options={{ headerShown: false }} />
      <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
      <Stack.Screen name="ProductViewScreen" component={ProductViewScreen} />
      <Stack.Screen name="AddProductScreen1" component={AddProductScreen1}/>
      <Stack.Screen name="PriceSetScreen" component={PriceSetScreen}/>
      <Stack.Screen name="StockScreen" component={StockScreen} />
      <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
     
      
    </Stack.Navigator>
  );
};

export default AppNavigator;
