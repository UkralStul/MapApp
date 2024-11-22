import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import fetchEventData from '../constants/fetchEventData';

export default function EventItem({ id }) {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEventData = async () => {
      try {
        const data = await fetchEventData(id);
        setEventData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event data:', error);

      }
    };

    getEventData();
  }, [id]);

  return (
    <View>
      {loading ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 100 }}>
          <ActivityIndicator size="large" color="gray" />
        </View>
      ) : (
        eventData && (
          <View style={{ width: 200, height: 100, backgroundColor: 'gray' }}>
            <Text>{eventData.name}</Text>
            <Text>{eventData.description}</Text>
          </View>
        )
      )}
    </View>
  );
}
