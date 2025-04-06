// components/WifiDevices.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';

const WifiDevices = () => {
  const [wifiList, setWifiList] = useState([]);
  const [scanning, setScanning] = useState(false);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'WiFi scanning requires location permission',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      // iOS doesn't need explicit location permission for WiFi scanning
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const scanWifiNetworks = async () => {
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Location permission is required for WiFi scanning',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setScanning(true);
      setWifiList([]);
      
      if (Platform.OS === 'ios') {
        // iOS needs to be connected to a WiFi network to retrieve current SSID
        const ssid = await WifiManager.getCurrentWifiSSID();
        setWifiList([{ SSID: ssid, BSSID: 'N/A', level: 'N/A', frequency: 'N/A' }]);
      } else {
        // Android can scan for all available networks
        const wifiArray = await WifiManager.loadWifiList();
        setWifiList(wifiArray);
      }
    } catch (error) {
      console.error('Error scanning WiFi:', error);
      Alert.alert(
        'Scanning Error',
        'Failed to scan WiFi networks. Please check if WiFi is enabled.',
        [{ text: 'OK' }]
      );
    } finally {
      setScanning(false);
    }
  };

  const getSignalStrength = (level) => {
    if (level >= -50) return 'Excellent';
    if (level >= -60) return 'Good';
    if (level >= -70) return 'Fair';
    return 'Poor';
  };

  const getSignalIcon = (level) => {
    if (level >= -50) return '▮▮▮▮';
    if (level >= -60) return '▮▮▮ ';
    if (level >= -70) return '▮▮  ';
    return '▮   ';
  };

  const renderItem = ({ item }) => (
    <View style={styles.networkItem}>
      <View style={styles.networkInfo}>
        <Text style={styles.networkName}>{item.SSID || 'Hidden Network'}</Text>
        <Text style={styles.networkDetail}>BSSID: {item.BSSID}</Text>
        {Platform.OS === 'android' && (
          <>
            <View style={styles.signalContainer}>
              <Text style={styles.signalText}>{getSignalIcon(item.level)} </Text>
              <Text style={styles.signalStrength}>
                {getSignalStrength(item.level)} ({item.level} dBm)
              </Text>
            </View>
            <Text style={styles.networkDetail}>
              Frequency: {(item.frequency / 1000).toFixed(1)} GHz
            </Text>
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>WiFi Networks</Text>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={scanWifiNetworks}
          disabled={scanning}
        >
          <Text style={styles.scanButtonText}>
            {scanning ? 'Scanning...' : 'Scan Networks'}
          </Text>
        </TouchableOpacity>
      </View>

      {scanning && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0d6efd" />
          <Text style={styles.loadingText}>Scanning for WiFi networks...</Text>
        </View>
      )}

      {wifiList.length === 0 && !scanning ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No WiFi networks found</Text>
          <Text style={styles.emptySubText}>
            Tap "Scan Networks" to begin searching for WiFi networks
          </Text>
        </View>
      ) : (
        <FlatList
          data={wifiList}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.BSSID || `network-${index}`}
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
  networkItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  networkInfo: {
    flex: 1,
  },
  networkName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
  },
  networkDetail: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  signalText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#0d6efd',
  },
  signalStrength: {
    fontSize: 14,
    color: '#495057',
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

export default WifiDevices;