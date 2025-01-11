import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  KeyboardAvoidingView,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Button,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Modal from 'react-native-modal';

const { width, height } = Dimensions.get('window');

const LocationScreen = ({ navigation }) => {
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [markerPosition, setMarkerPosition] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [shopId, setShopId] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
      console.error('Error retrieving user email:', error);
    }
  };

  const handleSaveLocation = async () => {
    if (!addressLine1 || !pincode || !city || !state || !country) {
      Alert.alert('Error', 'Please fill all fields and select a location on the map.');
      return;
    }

    try {
      const response = await axios.post('http://168.150.9.23:3000/api/Locations', {
        email: userEmail,
        addressLine1,
        addressLine2,
        landmark,
        pincode,
        city,
        state,
        country,
        latitude: markerPosition?.latitude,
        longitude: markerPosition?.longitude,
        shopId,
      });

      if (response.status === 201) {
        Alert.alert('Location Saved', 'Your shop location has been saved successfully.');
        await AsyncStorage.setItem('LocationScreen_completed', 'true');
        navigation.navigate('ShopDescriptionScreen');
      } else {
        Alert.alert('Error', 'Failed to save location data. Please try again later.');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert('Error', 'Failed to save location data. Please try again later.');
    }
  };

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarkerPosition(coordinate);
    reverseGeocode(coordinate);
  };

  const reverseGeocode = async (coordinate) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: coordinate.latitude,
          lon: coordinate.longitude,
          format: 'json',
        },
      });

      if (response.data) {
        const address = response.data.address;
        setAddressLine1(address.road || '');
        setAddressLine2(address.neighbourhood || '');
        setLandmark(address.building || '');
        setPincode(address.postcode || '');
        setCity(address.city || '');
        setState(address.state || '');
        setCountry(address.country || '');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      Alert.alert('Error', 'Please enter a location to search.');
      return;
    }

    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: searchQuery,
          format: 'json',
          addressdetails: 1,
        },
      });

      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching location:', error);
      Alert.alert('Error', 'Failed to search location. Please try again later.');
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
      <Text style={[styles.text, styles.head]}>Step 2:</Text>
      <Text style={[styles.text1, styles.mid]}>Search your shop location on map</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search location"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>

      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markerPosition && <Marker coordinate={markerPosition} />}
      </MapView>

      {searchResults.length > 0 && (
        <ScrollView style={styles.searchResultsContainer}>
          {searchResults.map((result, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                const coordinate = {
                  latitude: parseFloat(result.lat),
                  longitude: parseFloat(result.lon),
                };
                setMarkerPosition(coordinate);
                reverseGeocode(coordinate);
                setSearchResults([]);
                setSearchQuery('');
              }}
            >
              <Text style={styles.searchResult}>{result.display_name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity  onPress={toggleModal}>
        <Text style={[styles.text1, styles.low] }>Enter location manually</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <ScrollView>
            <TextInput
              style={styles.textInput}
              placeholder="Address Line 1"
              value={addressLine1}
              onChangeText={setAddressLine1}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Address Line 2"
              value={addressLine2}
              onChangeText={setAddressLine2}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Landmark"
              value={landmark}
              onChangeText={setLandmark}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Pincode"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.textInput}
              placeholder="City"
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              style={styles.textInput}
              placeholder="State"
              value={state}
              onChangeText={setState}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Country"
              value={country}
              onChangeText={setCountry}
            />
            <Button title="Save Location" onPress={handleSaveLocation} />
          </ScrollView>
        </View>
        </Modal>
        <TouchableOpacity style={styles.manualEntryButton}  onPress={handleSaveLocation}>
          <Text style={styles.buttonText}> Next </Text>
        </TouchableOpacity>
</KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#FFFFFF',
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
buttonText: {
  color: '#FFFFFF',
  fontSize: 38,
  fontWeight: 'bold',
  textAlign: 'center',
},
head: {
fontSize: 48,
width: 350,
marginTop: height / 7.2072,
marginLeft: width / 25,
color: '#000000',
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
zIndex: 1,
},
searchContainer: {
flexDirection: 'row',
alignItems: 'center',
marginTop: 20,
paddingHorizontal: 20,
},
searchInput: {
flex: 1,
borderWidth: 1,
borderColor: '#ccc',
paddingVertical: 8,
paddingHorizontal: 12,
marginRight: 10,
borderRadius: 6,
},
map: {
width: width/1.08761,
height: height/2.3372549,
marginTop: '36 %',
marginLeft: width/25,
borderRadius: 15,
borderWidth:1,
borderColor: '#31772B',

},
searchResultsContainer: {
position: 'absolute',
top: 120,
left: 20,
right: 20,
backgroundColor: '#fff',
zIndex: 1000,
elevation: 2,
maxHeight: 200,
borderRadius: 6,
borderWidth: 1,
borderColor: '#ccc',
},
searchResult: {
padding: 10,
borderBottomWidth: 1,
borderBottomColor: '#eee',
},
manualEntryButton: {
position: 'absolute',
bottom: 20,
left: width/7.0588,

backgroundColor: '#31772B',
padding: 16,
borderRadius: 8,
alignItems: 'center',
height:height/13.79,
width: width/1.36,
},
manualEntryText: {
color: '#fff',
fontSize: 16,
},
modalContent: {
backgroundColor: '#fff',
padding: 20,
borderTopLeftRadius: 20,
borderTopRightRadius: 20,
height: '75%',
},
textInput: {
borderWidth: 1,
borderColor: '#ccc',
paddingVertical: 10,
paddingHorizontal: 16,
marginBottom: 12,
borderRadius: 6,
},
mid: {
  top: height/ 4.523711,
  
  fontSize: 20,
  left: width/19,
},
low:{
  fontSize:24,
  alignSelf:'center',
  paddingTop: 30,
 
  
  
  
},
});
export default LocationScreen;
