import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import AsyncStorage from '@react-native-async-storage/async-storage';
 // Import AsyncStorage

// Import ReactNativeAsyncStorage from AsyncStorage
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCfVFZHSV2p0cACxPOZP0YqEYs0R-8EStg",
  authDomain: "shopownerapp.firebaseapp.com",
  projectId: "shopownerapp",
  storageBucket: "shopownerapp.appspot.com",
  messagingSenderId: "471103361219",
  appId: "1:471103361219:web:3cbfb370d9d0746a029276",
  measurementId: "G-HRJB60N7MR"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
export default app;
