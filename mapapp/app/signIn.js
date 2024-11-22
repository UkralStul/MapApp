import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import {  useAuth } from '../context/authContext';
import {  useRouter } from 'expo-router';
import axios from 'axios';

export default function signIn() {

    const router = useRouter();
    const {login} = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = async () => {
        try {
            let responce = await login(username, password);
            if(!responce.success){
              Alert.alert('Invalid username or password');
            }
        } catch (error) {
          console.log('there is a error: ',error);
        }
    };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.circle}>
          <TextInput
            style={styles.input}
            placeholder="Логин"
            placeholderTextColor="#ffffff"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Пароль"
            placeholderTextColor="#ffffff"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Войти</Text>
        </TouchableOpacity>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    background: {
      flex: 1,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      borderRadius: 30,
      backgroundColor: '#BE2424',
      marginVertical: 10,
      marginHorizontal: 20,
      paddingVertical: 15,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    input: {
      width: '80%',
      backgroundColor: 'transparent',
      borderBottomWidth: 1,
      borderBottomColor: '#ffffff',
      color: '#ffffff',
      marginBottom: 20,
      paddingHorizontal: 10,
      fontSize: 16,
      paddingBottom: 20,
    },
    circle: {
      width: 300,
      height: 300,
      borderRadius: 150,
      borderWidth: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FF9E9E',
    },
    buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
  });