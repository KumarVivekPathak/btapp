import React, { createContext, useState, useContext, ReactNode } from 'react';
import { BluetoothDevice } from 'react-native-bluetooth-classic';

type AppContextType = {
  baseURL: string;
  setBaseURL: (url: string) => void;
  name: string;
  setName: (name: string) => void;
  location: string;
  setLocation: (location: string) => void;
  bluetoothAddress: string;
  setBluetoothAddress: (address: string) => void;
  nearestDevice: BluetoothDevice | null;
  setNearestDevice: (device: BluetoothDevice | null) => void;
  nearestNeighbors: BluetoothDevice[];
  setNearestNeighbors: (devices: BluetoothDevice[]) => void;
};

const AppContext = createContext<AppContextType>({
  baseURL: '',
  setBaseURL: () => { },
  name: '',
  setName: () => { },
  location: '',
  setLocation: () => { },
  bluetoothAddress: '',
  setBluetoothAddress: () => { },
  nearestDevice: null,
  setNearestDevice: () => { },
  nearestNeighbors: [],
  setNearestNeighbors: () => { },
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [baseURL, setBaseURL] = useState('');
  const [name, setName] = useState(''); // Add this
  const [location, setLocation] = useState(''); // Add this
  const [bluetoothAddress, setBluetoothAddress] = useState(''); // Add this
  const [nearestDevice, setNearestDevice] = useState<BluetoothDevice | null>(null);
  const [nearestNeighbors, setNearestNeighbors] = useState<BluetoothDevice[]>([]);

  
  return (
    <AppContext.Provider  value={{ 
      baseURL, 
      setBaseURL,
      name,
      setName,
      location,
      setLocation,
      bluetoothAddress,
      setBluetoothAddress,
      nearestDevice,
      setNearestDevice,
      nearestNeighbors,
      setNearestNeighbors
    }}
  >  
  {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
