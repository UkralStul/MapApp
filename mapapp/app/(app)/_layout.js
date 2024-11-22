import React from 'react'
import { Slot, Stack } from 'expo-router'
import { WebSocketProvider } from '../../context/webSocketContext';
import { GeoWebSocketProvider } from '../../context/geoWebSocketContext';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";


export default function TabLayout() {
  return (
    <WebSocketProvider>
      <GeoWebSocketProvider>
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="chat" options={{ presentation: 'modal' }} />
        </Stack>
      </GeoWebSocketProvider>
    </WebSocketProvider>
  );
}