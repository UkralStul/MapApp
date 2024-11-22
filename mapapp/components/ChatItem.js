import { Image } from 'expo-image'
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format, isToday, isThisYear } from 'date-fns';
const ChatItem = ({ item }) => {
  const navigation = useNavigation();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const avatarUri = `${apiUrl}/api/v1/images/avatar/${item.users[0].id}?t=${new Date().getTime()}`;

  const handlePress = () => {
    navigation.navigate('chat', { item });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return format(date, 'HH:mm'); // Показывает только время, если это сегодня
    } else if (isThisYear(date)) {
      return format(date, 'dd.MM'); // Показывает день и месяц, если это в этом году
    } else {
      return format(date, 'dd.MM.yyyy'); // Показывает полную дату, если не в этом году
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <Image
          source={{ uri: avatarUri }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <View style={styles.header}>
            <Text style={styles.name}>{item.users[0].username}</Text>
            <Text style={styles.date}>{formatDate(item.last_message_date)}</Text>
          </View>
          <Text style={styles.message}>{item.last_message_text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A5568', // серый цвет текста
  },
  date: {
    fontSize: 14,
    color: '#A0AEC0', // светло-серый цвет даты
  },
  message: {
    fontSize: 16,
    color: '#718096', // серый цвет текста сообщения
    marginTop: 4,
  },
});

export default ChatItem;
