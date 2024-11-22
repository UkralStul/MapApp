import React, { useEffect, useState, useContext, useRef } from 'react';
import {View, ActivityIndicator, Image, GestureResponderEvent, Button, StyleSheet} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // Используем MapView из react-native-maps
import fetchEventsInArea from '../../../constants/fetchEventsInArea';
import { AuthContext } from '../../../context/authContext';
import { useGeoWebSocket } from '../../../context/geoWebSocketContext';
import useLocation from '../../../hooks/userLocation';
import FriendOnMap from '../../../components/FriendOnMap';
import EventCreationBottomSheetModal from "../../../components/EventCreationBottomSheetModal";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import fetchFriendsGeo from "@/constants/fetchFriendsGeo";
import userLocation from "../../../hooks/userLocation";

interface FriendGeo {
  user_id: string;
  latitude: number;
  longitude: number;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface EventMarker {
  id: string;
  latitude: number;
  longitude: number;
}

const MyMapComponent: React.FC = () => {
  const { location,initialLocation, errorMsg } = useLocation();
  const [mapRef, setMapRef] = useState<MapView | null>(null);
  const [markers, setMarkers] = useState<EventMarker[]>([]);
  const { user } = useContext(AuthContext);
  const { requestUserGeos, updateUserGeo, userGeos, friendsGeos, setFriendsGeos } = useGeoWebSocket();
  const eventCreationBottomSheetRef = useRef<BottomSheetModal>(null);
  const [eventLocation, setEventLocation] = useState<{ lat: number; lon: number } | null>(null);
  const friendsMarkerRefs = useRef<{ [key: string]: any }>({});
  useEffect(() => {
    if (location) {
      updateUserGeo(user.id, { latitude: location.latitude, longitude: location.longitude });
    }
  }, [location]);

  useEffect(() => {
    if (mapRef?.state.isReady) {
      handleRegionChangeComplete();
    }

  }, [mapRef]);

  useEffect(() => {
    if (initialLocation) {
      mapRef?.animateToRegion({
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [initialLocation]);


  useEffect(() => {
    const fetchFriendsGeosData = async () => {
      const friendsGeos = await fetchFriendsGeo();
      console.log('initial friends geos: ', friendsGeos);
      setFriendsGeos(friendsGeos);
    };
    fetchFriendsGeosData();
  }, []);


  const handleRegionChangeComplete = async () => {
  if (mapRef?.state.isReady) {
    try {
      const events = await fetchEventsInArea(mapRef);
      setMarkers(events); // Обновляем маркеры на карте
    } catch (error) {
      console.error("Ошибка при обновлении маркеров:", error);
    }
  }
};

  const createEvent = (lat: number, lon: number) => {
    setEventLocation({ lat, lon });
    eventCreationBottomSheetRef.current?.present();
  };



  return (
    <View style={{ flex: 1 }}>
        <MapView
          ref={(ref) => setMapRef(ref)}
          style={{ width: '100%', height: '100%' }}
          showsUserLocation={true} // Показываем текущую локацию пользователя

          onPress={(e) => {
            const centerLat = e.nativeEvent.coordinate.latitude;
            const centerLon = e.nativeEvent.coordinate.longitude;
            console.log('latitude: ', centerLat, 'longitude', centerLon);
          }}
          onLongPress={(e) => {
            const lat = e.nativeEvent.coordinate.latitude;
            const lon = e.nativeEvent.coordinate.longitude;
            createEvent(lat, lon);
          }}
          onRegionChangeComplete={handleRegionChangeComplete} // Обработчик завершения изменения региона
        >
          {/* Event markers */}
          {markers && markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }} // Используем координаты из маркера
              onPress={() => {
                // Обработчик нажатия
              }}
            >
                <Image
                  source={require('../../../assets/images/map-point-icon.png')}
                  style={{ width: 40, height: 40 }}
                />
            </Marker>
          ))}  
          {/* Friends Markers */}
          {friendsGeos && friendsGeos.map((friendGeo: FriendGeo) => (
            <Marker
              key={friendGeo.user_id}
              coordinate={{ latitude: friendGeo.latitude, longitude: friendGeo.longitude }}
              ref={(ref) => (friendsMarkerRefs.current[friendGeo.user_id] = ref)}
              onPress={() => {console.log(friendsMarkerRefs)}}
            >
                <FriendOnMap user_id={friendGeo.user_id} />
            </Marker>
          ))}
        </MapView>
      {eventLocation && (
        <EventCreationBottomSheetModal
          ref={eventCreationBottomSheetRef}
          lat={eventLocation.lat}
          lon={eventLocation.lon}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  avatarContainer: {
    width: 50, // Размер круга
    height: 50,
    borderRadius: 25, // Половина ширины и высоты для получения круга
    overflow: 'hidden', // Обрезаем изображение, чтобы оно не выходило за границы круга
    borderWidth: 2,
    borderColor: 'white', // Цвет границы
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default MyMapComponent;
