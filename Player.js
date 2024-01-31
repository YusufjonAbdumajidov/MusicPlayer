import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { View, Text, TouchableOpacity } from 'react-native';
import song from "./assets/sample.mp3"

const Player = () => {
  const [sound, setSound] = useState();

  useEffect(() => {
    return () => {
      sound && sound.unloadAsync();
    };
  }, [sound]);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/sample.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  };

  return (
    <View>
      <Text>Music Player</Text>
      <TouchableOpacity onPress={playSound}>
        <Text>Play Music</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Player;