import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fetchEventsInArea from "@/constants/fetchEventsInArea";

const fetchFriendsGeo = async () => {
    try {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL_GEO;
        const token = await AsyncStorage.getItem('authToken');
        const response = await axios.get(`${apiUrl}/api/v1/userGeo/friendsGeo`, {
            params: { token }
        });
        return response.data;

    } catch (error) {
        console.error('Error fetching friends geo:', error);
        throw error;
    }
}


export default fetchFriendsGeo;