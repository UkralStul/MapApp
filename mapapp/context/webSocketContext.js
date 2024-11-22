import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Don't forget to import AsyncStorage

// Создаем контекст
const WebSocketContext = createContext();

// Провайдер контекста
export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const userIdRef = useRef(null);
    const reconnectTimerRef = useRef(null);

    const setupWebSocket = async () => {

        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        const token = await AsyncStorage.getItem('authToken');
        const ws = new WebSocket(`${apiUrl.replace('https', 'ws')}/api/v1/chat/ws?token=${token}`);

        ws.onopen = () => {
            console.log('WebSocket connected');
            if (userIdRef.current) {
                ws.send(JSON.stringify({ type: 'connect', userId: userIdRef.current }));
            }
        };

        ws.onmessage = (event) => {
            try {
              const message = JSON.parse(event.data); // Парсим сообщение
              console.log('получено сообщение', message);
              setMessages(message);// Добавляем новое сообщение в массив
            } catch (error) {
              console.error('Ошибка при разборе сообщения WebSocket', error);
            }
          };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            attemptReconnect();
        };

        setSocket(ws);
    };
    useEffect(() => {

        setupWebSocket();

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);
    // Зависимости могут быть изменены, если необходимо
    const attemptReconnect = () => {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = setTimeout(() => {
            console.log('Attempting to reconnect to Geo WebSocket...');
            setupWebSocket();
        }, 5000); // Пробуем подключиться снова через 5 секунд
    };

    const sendMessage = (chatId, messageText, receiverId) => {
        const message = {
          chat_id: chatId,         // ID of the chat (conversation)
          message: messageText,    // The actual message content
          receiver_id: receiverId  // The ID of the recipient
        };
      
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(message));  // Send the message object as a JSON string
        } else {
          Alert.alert('WebSocket is not connected');
        }
      };

    return (
        <WebSocketContext.Provider value={{ socket, messages, sendMessage, userIdRef }}>
            {children}
        </WebSocketContext.Provider>
    );
};

// Хук для использования контекста
export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
