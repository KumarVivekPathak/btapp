import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BluetoothDevices from '../components/BluetoothDevices';
import WifiDevices from '../components/WifiDevices';

const Settings = () => {
      const [activeTab, setActiveTab] = useState('bluetooth');
  return (
    <View>
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
                <BluetoothDevices />
              ) : (
                <WifiDevices />
              )}
            </View>
    </View>
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


export default Settings;