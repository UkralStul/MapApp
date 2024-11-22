import { View, Text, Platform } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router'
import { Tabs } from 'expo-router';
import { WebSocketProvider } from '../../../context/webSocketContext';
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";


export default function TabLayout() {
  return (
        <Tabs detachInactiveScreens={Platform.OS === "android" ? false : true} screenOptions={{ tabBarActiveTintColor: 'blue' }}>
          <Tabs.Screen name="chats" />
          <Tabs.Screen name="map" />
          <Tabs.Screen name="profile" />
        </Tabs>
  );
}
