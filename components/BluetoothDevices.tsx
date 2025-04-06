// components/BluetoothDevices.js
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const BluetoothDevices = () => {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const bleManager = useMemo(() => new BleManager(), []);

  useEffect(() => {
    return () => {
      bleManager.destroy();
    };
  }, [bleManager]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 31) { // Android 12+
          const permissions = [
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ];
          
          const results = await PermissionsAndroid.requestMultiple(permissions);
          
          const allGranted = Object.values(results).every(
            result => result === PermissionsAndroid.RESULTS.GRANTED
          );
          
          if (!allGranted) {
            Alert.alert(
              'Permissions Required',
              'Bluetooth scanning requires location and bluetooth permissions',
              [{ text: 'OK' }]
            );
            return false;
          }
          return true;
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'Bluetooth scanning requires location permission',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      // iOS handling if needed
      return true;
    }
  };

  const scanDevices = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setDevices([]);
    setScanning(true);

    bleManager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        startScan();
      } else if (state === 'PoweredOff') {
        Alert.alert('Bluetooth is off', 'Please turn on Bluetooth to scan for devices');
        setScanning(false);
      }
    }, true);
  };

  const startScan = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scanning error:', error);
        setScanning(false);
        return;
      }
      
      if (device) {
        console.log(" device is :: ",device)
        setDevices((prevDevices) => {
          // Check if device already exists in our array
          if (!prevDevices.find(d => d.id === device.id)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => {
      bleManager.stopDeviceScan();
      setScanning(false);
    }, 10000);
  };

  const stopScan = () => {
    bleManager.stopDeviceScan();
    setScanning(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.deviceItem}>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>
          {item.name || 'Unknown Device'}
        </Text>
        <Text style={styles.deviceId}>ID: {item.id}</Text>
        <Text style={styles.deviceRssi}>Signal: {item.rssi} dBm</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Bluetooth Devices</Text>
        <TouchableOpacity
          style={[styles.scanButton, scanning ? styles.stopButton : null]}
          onPress={scanning ? stopScan : scanDevices}
          disabled={scanning && Platform.OS === 'ios'} // iOS doesn't support stopping scan
        >
          <Text style={styles.scanButtonText}>
            {scanning ? 'Stop Scan' : 'Start Scan'}
          </Text>
        </TouchableOpacity>
      </View>

      {scanning && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0d6efd" />
          <Text style={styles.loadingText}>Scanning for devices...</Text>
        </View>
      )}

      {devices.length === 0 && !scanning ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No devices found</Text>
          <Text style={styles.emptySubText}>
            Tap "Start Scan" to begin searching for Bluetooth devices
          </Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  scanButton: {
    backgroundColor: '#0d6efd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  stopButton: {
    backgroundColor: '#dc3545',
  },
  scanButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  loadingContainer: {
    marginVertical: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#6c757d',
  },
  listContainer: {
    paddingBottom: 16,
  },
  deviceItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
  },
  deviceId: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  deviceRssi: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6c757d',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default BluetoothDevices;