import React, {useEffect} from 'react';
import {Stack, useRouter, useSegments} from 'expo-router';
import {Slot} from "expo-router";
import {View} from 'react-native';

import {AuthContextProvider, useAuth} from '../context/authContext';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";

const MainLayout = () => {
    const {isAuthenticated} = useAuth();
    const segments = useSegments();
    const router = useRouter();


    useEffect(() => {
        if (typeof isAuthenticated == 'undefined') return;
        const inApp = segments[0] == '(app)';
        if (isAuthenticated && !inApp) {
            router.replace('/(tabs)/map');
        } else if (!isAuthenticated) {
            router.replace('signIn');
        }
    }, [isAuthenticated])

    return <Slot/>
}


export default function _layout() {
    return (
<GestureHandlerRootView style={{flex: 1}}>
          <BottomSheetModalProvider>
                <AuthContextProvider>
                    <MainLayout/>
                </AuthContextProvider>
</BottomSheetModalProvider>
      </GestureHandlerRootView>

    )
}