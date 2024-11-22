import React, { useEffect, useContext, useState, createContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const checkAuthState = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (token) {
                    const response = await verifyToken(token);
                    if (response.status === 200) {
                        setUser(response.data.user);
                        setIsAuthenticated(true);
                    } else {
                        await handleTokenRefresh();
                    }
                } else {
                    setIsAuthenticated(false);
                    console.log('There is no token in storage');
                }
            } catch (error) {
                console.error('Failed to check auth state', error);
                setIsAuthenticated(false);
            }
        };

        checkAuthState();
    }, []);

    const updateUser = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                const response = await verifyToken(token);
                
                if (response.status === 200) {
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                } else {
                    await handleTokenRefresh();
                }
            } else {
                setIsAuthenticated(false);
                console.log('There is no token in storage');
            }
        } catch (error) {
            console.error('Failed to check auth state', error);
            setIsAuthenticated(false);
        }
    };

    const verifyToken = async (token) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/verifyToken?token=${token}`);
            if (response.status === 200) {
                return response; // Token is valid
            } else if (response.status === 401) {
                // Token is expired, try to refresh
                const refreshed = await handleTokenRefresh();
                return refreshed ? await verifyToken(refreshed) : { status: 401 };
            }
        } catch (error) {
            console.error('Token verification failed', error);
            return { status: 401 };
        }
    };
    
    const handleTokenRefresh = async () => {
        try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
                const response = await axios.post(`${apiUrl}/auth/refresh?refresh_token=${refreshToken}`);
                if (response.status === 200) {
                    await AsyncStorage.setItem('authToken', response.data.access_token);
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                    return response.data.access_token; // Return the new access token
                } else {
                    setIsAuthenticated(false);
                    return null;
                }
            }
        } catch (error) {
            console.error('Failed to refresh token', error);
            setIsAuthenticated(false);
        }
    };
    

    const login = async (username, password) => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            const response = await axios.post(`${apiUrl}/auth/token`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                await AsyncStorage.setItem('authToken', response.data.access_token);
                await AsyncStorage.setItem('refreshToken', response.data.refresh_token);
                setUser(response.data.user);
                setIsAuthenticated(true);
                return { success: true, data: response };
            } else {
                return { success: false, data: response };
            }
        } catch (error) {
            console.error('Login failed', error);
            return { success: false, data: error.response };
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('refreshToken');
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Failed to logout', error);
        }
    };

    const register = async (email, password, username) => {
        try {
            const response = await axios.post(`${apiUrl}/user/create`, { email, password, username });
            if (response.status === 201) {
                await login(email, password); // Automatically login after registration
                return { success: true, data: response };
            }
        } catch (error) {
            console.error('Registration failed', error);
            return { success: false, data: error.response };
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateUser, handleTokenRefresh }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error('useAuth must be wrapped inside AuthContextProvider');
    }
    return value;
};
