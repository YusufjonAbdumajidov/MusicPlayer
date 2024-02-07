import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const Player = () => {
  const [sound, setSound] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState('');
  const [countryCode, setCountryCode] = useState(null);

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
      if (status !== 'granted') {
        console.error('Location permission denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const country = await getCountryCodeAsync(latitude, longitude);
      setCountryCode(country);
    } catch (error) {
      console.error('Error getting location', error);
    }
  };

  const getCountryCodeAsync = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      return data.countryCode;
    } catch (error) {
      console.error('Error getting country code', error);
      throw error;
    }
  };

  const getLocalPopularSongs = async (countryCode) => {
    const options = {
      method: 'GET',
      url: 'https://radio-world-50-000-radios-stations.p.rapidapi.com/v1/radios/getTopByCountry',
      params: {query: countryCode},
      headers: {
        'X-RapidAPI-Key': '8ccf971f26msh88e648e1f8bbc84p18514djsn69d575c9d5e4',
        'X-RapidAPI-Host': 'radio-world-50-000-radios-stations.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
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
      const countryCode = 'fr'; // You can replace this with actual country code based on user's location
      const localPopularSongs = await getLocalPopularSongs(countryCode);
      console.log('Local Popular Songs:', localPopularSongs);
      setCurrentSong('Sample Song');
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
      //setCurrentSong(''); // Clear the current song when stopped
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Music Player</Text> */}
      <View style={styles.songContainer}>
      <Text style={styles.songText}>{currentSong}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  songContainer: {
    display: "flex",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#39948b',
    padding: 12,
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