import axios from 'axios';

const fetchEventsInArea = async (mapRef) => {
  if (mapRef) {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL_GEO;

      // Получаем границы видимой области карты
      const boundaries = await mapRef.getMapBoundaries();
      const { northEast, southWest } = boundaries;

      // Формируем данные для запроса
      const requestData = {
        min_latitude: southWest.latitude,
        max_latitude: northEast.latitude,
        min_longitude: southWest.longitude,
        max_longitude: northEast.longitude,
      };

      // Отправляем запрос на сервер
      const response = await axios.post(`${apiUrl}/api/v1/events/events_in_area/`, requestData);

      return response.data; // Возвращаем список событий
    } catch (error) {
      console.error("Ошибка при загрузке событий:", error);
      throw error; // Пробрасываем ошибку для обработки
    }
  } else {
    console.error("mapRef недоступен");
    return [];
  }
};

export default fetchEventsInArea;
