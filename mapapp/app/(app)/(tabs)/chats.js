import {View, ScrollView, ActivityIndicator, StyleSheet} from 'react-native';
import React, { useEffect, useState } from 'react';
import ChatList from '../../../components/ChatList';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useWebSocket} from "@/context/webSocketContext";


export default function Chats() {
  const [chats, setChats] = useState([]); 
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [loading, setLoading] = useState(true);
  const { messages: wsMessages, sendMessage } = useWebSocket();
  const fetchChats = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await axios.get(`${apiUrl}/api/v1/chat/getConversations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        //if(response.status === 401){
        //
        //}
        setChats(response.data);
        setLoading(false);
      } catch (error) {
        console.log('There is an error: ', error);
      }
    };
  useEffect(() => {
    fetchChats();
  }, [wsMessages]);

  return (
    <View className="flex-1">
      {loading ? (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" color="gray" />
        </View>
      ) : (
        <ScrollView>
          {chats? (<ChatList chats={chats} /> ):(
            <Text>нет чатов</Text>
          )}
        </ScrollView>
      )}
      
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
