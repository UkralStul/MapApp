import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

// Интерфейс для типизации данных о локации
interface LocationData {
  latitude: number;
  longitude: number;
}

const useLocation = () => {
  // Типизируем состояние location как объект с координатами
  const [location, setLocation] = useState<LocationData | null>(null);
  const [initialLocation, setInitialLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | undefined;

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Получаем начальную локацию
      let loc = await Location.getCurrentPositionAsync({});
      setInitialLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });


      // Подписка на изменения локации
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Обновление каждые 5 секунд
          distanceInterval: 10, // Обновление при изменении позиции на 10 метров
        },
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          });
        }
      );
    };

    getLocation();

    // Очистка подписки при размонтировании компонента
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return { location, initialLocation, errorMsg };
};

export default useLocation;
