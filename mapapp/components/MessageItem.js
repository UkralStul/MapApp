import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';

export default function MessageItem({ content }) {
  console.log(content)
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const avatarUri = `${apiUrl}/api/v1/images/avatar/${content.sender.id}`;
  return (
    <View style={[styles.container, content.isSender ? styles.justifyEnd : styles.justifyStart]}>
      {!content.isSender && (
        <Image
          source={{ uri: avatarUri }} // 'https://via.placeholder.com/150'
          style={styles.avatar}
        />
      )}
      <View style={[styles.messageBox, content.isSender ? styles.senderBackground : styles.receiverBackground]}>
        <Text style={styles.messageText}>{content.content}</Text>
        <Text style={styles.timestamp}>{content.timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  messageBox: {
    padding: 8,
    borderRadius: 8,
    maxWidth: '80%',
  },
  senderBackground: {
    backgroundColor: '#A7F3D0', // светло-зеленый
  },
  receiverBackground: {
    backgroundColor: '#FFFFFF', // белый
  },
  messageText: {
    fontSize: 16,
    color: '#000000', // черный
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280', // серый
    textAlign: 'right',
    marginTop: 4,
  },
});
