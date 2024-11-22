import {Button, StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {useAuth} from "@/context/authContext";
import FriendOnMap from "@/components/FriendOnMap";



const profile = () => {
    const {logout} = useAuth();
    const handleLogout = () => {
        logout();
    }

  return (
    <View style={styles.container}>
        <Button title={'Logout'} onPress={handleLogout} />
        <FriendOnMap user_id={1} />
    </View>
  )
}

export default profile

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
})