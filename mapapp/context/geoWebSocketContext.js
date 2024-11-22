import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './authContext';

const GeoWebSocketContext = createContext();

export const GeoWebSocketProvider = ({ children }) => {
    const [userGeos, setUserGeos] = useState([]);
    const [friendsGeos, setFriendsGeos] = useState(undefined);
    const { user, handleTokenRefresh } = useContext(AuthContext);
    // Создаем ref для WebSocket
    const geoSocketRef = useRef(null);
    const reconnectTimerRef = useRef(null);
    const setupGeoWebSocket = () => {
            const apiUrl = process.env.EXPO_PUBLIC_API_URL_GEO;

            // Создаем новый WebSocket и сохраняем его в geoSocketRef
            geoSocketRef.current = new WebSocket(`${apiUrl.replace('https', 'ws')}/api/v1/userGeo/ws?user_id=${user.id}`);

            // Устанавливаем обработчики событий для WebSocket
            geoSocketRef.current.onopen = () => {
                console.log('Geo WebSocket connected');
            };

            geoSocketRef.current.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if(message.error){
                        if(message.status_code == 401){
                            handleTokenRefresh();
                        }
                    } else {
                        console.log('message: ',message)
                        if (message.action === 'update_friend_geo') {
                            // Обновляем friendsGeos с учетом новых данных
                            setFriendsGeos((prevFriendsGeos) => {
                                if (!prevFriendsGeos) {
                                    // Если friendsGeos еще не инициализирован, создаем новый массив
                                    return [{ userId: message.user_id, geo: message.geo }];
                                }

                                // Проверяем, есть ли пользователь с таким user_id
                                const existingFriendIndex = prevFriendsGeos.findIndex(
                                    (friend) => friend.userId === message.user_id
                                );

                                if (existingFriendIndex !== -1) {
                                    // Если пользователь найден, обновляем его данные
                                    const updatedFriends = [...prevFriendsGeos];
                                    updatedFriends[existingFriendIndex] = {
                                        ...updatedFriends[existingFriendIndex],
                                        geo: message.geo,
                                    };
                                    return updatedFriends;
                                }

                                // Если пользователь не найден, добавляем нового
                                return [...prevFriendsGeos, { user_id: message.user_id, latitude: message.geo.latitude, longitude: message.geo.longitude }];
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message', error);
                }
            };

            geoSocketRef.current.onclose = () => {
                console.log('Geo WebSocket disconnected');
                attemptReconnect();
            };

    };

    useEffect(() => {
        if(user) {
            setupGeoWebSocket();
        }
        // Возвращаем функцию очистки, чтобы закрыть соединение при размонтировании компонента
        return () => {
            if (geoSocketRef.current) geoSocketRef.current.close();
        };
    }, [user]); // Указываем user.id в зависимостях, чтобы обновлять WebSocket при изменении пользователя


    const attemptReconnect = () => {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = setTimeout(() => {
            console.log('Attempting to reconnect to Geo WebSocket...');
            setupGeoWebSocket();
        }, 5000); // Пробуем подключиться снова через 5 секунд
    };


    // Функция обновления гео-данных пользователя
    const updateUserGeo = async (userId, geoData) => {
        // Проверяем, что WebSocket подключен
        if (geoSocketRef.current && geoSocketRef.current.readyState === WebSocket.OPEN) {
            console.log('updating user geo');
            const token = await AsyncStorage.getItem('authToken');
            geoSocketRef.current.send(JSON.stringify({
                token: token,
                action: 'update_geo',
                user_id: userId,
                geo: geoData,
            }));
        } else {
            console.log('Geo WebSocket is not connected');
        }
    };

    // Функция для запроса гео-данных пользователей
    const requestUserGeos = async () => {
        if (geoSocketRef.current && geoSocketRef.current.readyState === WebSocket.OPEN) {
            const token = await AsyncStorage.getItem('authToken');
            geoSocketRef.current.send(JSON.stringify({
                action: 'get_user_geos',
                token: token,
            }));
        } else {
            console.log('Geo WebSocket is not connected');
        }
    };

    return (
        <GeoWebSocketContext.Provider value={{ userGeos, updateUserGeo, requestUserGeos, friendsGeos, setFriendsGeos }}>
            {children}
        </GeoWebSocketContext.Provider>
    );
};

export const useGeoWebSocket = () => {
    return useContext(GeoWebSocketContext);
};
