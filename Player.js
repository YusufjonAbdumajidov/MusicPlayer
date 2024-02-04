import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

const Player = () => {
  const [sound, setSound] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocationAsync();
  }, []);

  useEffect(() => {
    return () => {
      sound && sound.unloadAsync();
    };
  }, [sound]);

  const getLocationAsync = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
      } else {
        console.error('Location permission denied');
      }
    } catch (error) {
      console.error('Error getting location', error);
    }
  };

  const getLocalPopularSongs = async () => {
    // Implement your logic to fetch local popular songs based on location
    // This could involve making an API call to a service that provides local music recommendations
    // For simplicity, let's assume a hypothetical function that fetches local popular songs
    try {
      setLoading(true);
      // Replace the following line with your actual API call
      const localPopularSongs = await fetchLocalPopularSongs(location.latitude, location.longitude);
      console.log('Local Popular Songs:', localPopularSongs);
    } catch (error) {
      console.error('Error fetching local popular songs', error);
      setLoading(false);
    }
  };

  const playSound = async () => {
    try {
      setLoading(true);
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/sample.mp3')
      );
      setSound(sound);
      await sound.playAsync();
      setPlaying(true);
      getLocalPopularSongs();
    } catch (error) {
      console.error("Error loading or playing sound", error);
      setLoading(false);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setPlaying(false);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setPlaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music Player</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={isLoading ? null : isPlaying ? pauseSound : playSound}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        )}
      </TouchableOpacity>
      {isPlaying && (
        <TouchableOpacity style={styles.button} onPress={stopSound}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Player;