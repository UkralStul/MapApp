import React from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function StartPage() {
  const router = useRouter();
  
  return (
    <View style={styles.activityIndicator}>
      <ActivityIndicator size="large" color="gray" />
    </View>
  );
}


const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
