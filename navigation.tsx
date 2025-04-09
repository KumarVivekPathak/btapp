import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Chat from './screens/Chat';
import Settings from './screens/Settings';
import {Text} from 'react-native'
import Bluetooth from './screens/Bluetooth';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerTintColor: '#0d6efd',
        tabBarStyle: {
          backgroundColor: '#f8f9fa',
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#0d6efd',
        tabBarInactiveTintColor: '#6c757d',
      }}
    >
      <Tab.Screen 
        name="Chat" 
        component={Chat} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>💬</Text>
          ),
        }}
      />
       <Tab.Screen 
        name="Bt/Wifi" 
        component={Bluetooth} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>BT/Wifi</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={Settings} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}