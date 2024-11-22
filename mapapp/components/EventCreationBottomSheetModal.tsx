import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import React, {forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetSpringConfigs
} from '@gorhom/bottom-sheet';
import createEvent from "@/constants/createEvent";
import {AuthContext} from "@/context/authContext";


interface EventCreationProps {
  lat: number;
  lon: number;
}
const EventCreationBottomSheetModal = React.memo(forwardRef<BottomSheetModal, EventCreationProps>((props, ref) => {
  const { lat, lon } = props;
  const nameRef = useRef('');
  const descriptionRef = useRef('');
  const { user } = useContext(AuthContext);
   const handleNameChange = (text: string) => {
    nameRef.current = text;
  };

  const handleDescriptionChange = (text: string) => {
    descriptionRef.current = text;
  };
  const handleCreateEvent = async () => {
      if (user) {
        try {
          await createEvent(nameRef.current, descriptionRef.current, lat, lon, user.id);
          Alert.alert('Событие создано');
          if (ref && 'current' in ref && ref.current) {
            ref.current.dismiss();
          }
        } catch (error) {
          console.error('Failed to create event:', error);
        }
      } else {
        console.error('User not authenticated');
      }
    };
  const snapPoints = useMemo(() => ['25%', '60%'], []);

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 200,
  });

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      animationConfigs={animationConfigs}
      backdropComponent={renderBackdrop}
      android_keyboardInputMode={'adjustResize'}
      keyboardBehavior={'extend'}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.containerHeadline}>Создание события</Text>
        <Text style={styles.inputText}>Название события</Text>
        <BottomSheetTextInput
            style={styles.input}
            placeholder="Введите название"
            maxLength={30}
            onChangeText={handleNameChange}
        />
        <Text style={styles.inputText}>Описание события</Text>
        <BottomSheetTextInput
          style={styles.input}
          placeholder="Опишите событие"
          multiline={true}
          numberOfLines={1}
          onChangeText={handleDescriptionChange}
        />
        <TouchableOpacity onPress={() => handleCreateEvent()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>   Создать событие   </Text>
          </View>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
}));

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
  },
  containerHeadline: {
    fontSize: 20,
    fontWeight: '600',
    padding: 10,
  },
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    width: '80%',
    padding: 8,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
  },
  inputText: {
    fontSize: 14,
    alignSelf: 'flex-start',
    paddingLeft: '10%',
  },
  button: {
    width: 'auto',
    height: 50,
    backgroundColor: '#001169',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventCreationBottomSheetModal;
