import axios, { AxiosResponse } from 'axios';


const createEvent = async (
  name: string,
  description: string,
  latitude: number,
  longitude: number,
  created_by: string,
): Promise<AxiosResponse> => {
  try {
    console.log({
        name,
        description,
        latitude,
        longitude,
        created_by,
      })
    const apiUrl = process.env.EXPO_PUBLIC_API_URL_GEO;
    const response = await axios.post(`${apiUrl}/api/v1/events/`, {
        name,
        description,
        latitude,
        longitude,
        created_by,
    });
    console.log(response.status);
    return response; // Returns the response
  } catch (error) {
    console.error('Error fetching event data:', error);
    throw error;
  }
};

export default createEvent;
