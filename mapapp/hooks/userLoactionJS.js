import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const useLocation = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        let locationSubscription;

        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // Fetch initial location
            let loc = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });

            // Start watching for location changes
            locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000, // Update every 5 seconds
                    distanceInterval: 10, // Optional, 0 to get updates regardless of distance
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

        // Cleanup subscription on component unmount
        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, []);

    return { location, errorMsg };
};

export default useLocation;