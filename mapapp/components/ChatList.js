import React from 'react';
import { View } from 'react-native';
import ChatItem from './ChatItem';

const ChatList = ({ chats }) => {


  return (
    <View style={{flex: 1}}>
      {chats.toReversed().map((item, index) => (
        <ChatItem key={index} item={item} />
      ))}
    </View>
  );
};

export default ChatList;
