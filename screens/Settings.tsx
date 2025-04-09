import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import CustomInput from '../components/CustomInput';
import { useAppContext } from '../context/AppContext';


const Settings = () => {
  // const [name, setName] = useState('');
  // const [location, setLocation] = useState('');
  // const [bluetoothAddress, setBluetoothAddress] = useState('');
  // const [baseURL, setBaseURL] = useState('');
  const { baseURL, setBaseURL, name, setName, location, setLocation, bluetoothAddress, setBluetoothAddress } = useAppContext();

  const handleSave = () => {
    const settingsData = {
      name,
      location,
      bluetoothAddress,
      baseURL,
    };
    console.log('Settings Data:', JSON.stringify(settingsData, null, 2));
    Alert.alert('Success', 'Settings saved locally (check console), '+ JSON.stringify(settingsData));
  };

  return (
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
  >
    <ScrollView style={styles.scrollView}>
    
      <View style={styles.contentContainer}>
        <View style={styles.profileContainer}>
          <CustomInput
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
          <CustomInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="Enter your location"
          />
          <CustomInput
            label="Bluetooth Address"
            value={bluetoothAddress}
            onChangeText={setBluetoothAddress}
            placeholder="Enter Bluetooth address"
          />
          <CustomInput
            label="Base URL"
            value={baseURL}
            onChangeText={setBaseURL}
            placeholder="Enter base URL"
          />

          <View style={styles.buttonContainer}>
            <Button title="Save Settings" onPress={handleSave} />
          </View>
        </View>
      </View>
  
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginVertical: 16,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  profileContainer: {
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 24,
  },
});

export default Settings;
