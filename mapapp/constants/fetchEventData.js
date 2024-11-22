import axios from 'axios';

const fetchEventData = async (id) => {
    try {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL_GEO;
        const response = await axios.get(`${apiUrl}/event/events/${id}`);
        return response.data;

    } catch (error) {
        console.error('Error fetching event data:', error);
        throw error;
    }
};

export default fetchEventData;
