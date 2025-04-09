// App.js
import React, { useState } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StatusBar,
  Alert,
  PermissionsAndroid,
  Platform
} from 'react-native';
import WifiScanner from '../components/WifiScanner';
import BluetoothScanner from '../components/BluetoothScanner';


const Bluetooth = () => {
  const [activeTab, setActiveTab] = useState('bluetooth');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <Text style={styles.headerTitle}>Device Scanner</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'bluetooth' ? styles.activeTab : null]} 
          onPress={() => setActiveTab('bluetooth')}
        >
          <Text style={[styles.tabText, activeTab === 'bluetooth' ? styles.activeTabText : null]}>Bluetooth</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'wifi' ? styles.activeTab : null]} 
          onPress={() => setActiveTab('wifi')}
        >
          <Text style={[styles.tabText, activeTab === 'wifi' ? styles.activeTabText : null]}>WiFi</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        {activeTab === 'bluetooth' ? (
          <BluetoothScanner />
        ) : (
          <WifiScanner />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginVertical: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#0d6efd',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
  },
  activeTabText: {
    color: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
});

export default Bluetooth;