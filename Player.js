import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const Player = () => {
  const [sound, setSound] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [location, setLocation] = useState(null);
  const [currentSong, setCurrentSong] = useState('');

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

    
const options = {
  method: 'GET',
  url: 'https://spotify23.p.rapidapi.com/tracks/',
  params: {
    ids: '4WNcduiCmDNfmTEz7JvmLv'
  },
  headers: {
    'X-RapidAPI-Key': '8ccf971f26msh88e648e1f8bbc84p18514djsn69d575c9d5e4',
    'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
  }
};
    
    try {
      setLoading(true);
      const localPopularSongs = await axios.request(options);
      console.log('Local Popular Songs:', localPopularSongs.data);
    } catch (error) {
      console.error('Error fetching local popular songs', error);
      setLoading(false);
    }
  };


  // const getLocalPopularSongs = async () => {
  //   const options = {
  //     method: 'GET',
  //     url: 'https://deezerdevs-deezer.p.rapidapi.com/infos',
  //     headers: {
  //       'X-RapidAPI-Key': '8ccf971f26msh88e648e1f8bbc84p18514djsn69d575c9d5e4',
  //       'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
  //     }
  //   };
    
  //   try {
  //     setLoading(true);
  //     const localPopularSongs = await fetchLocalPopularSongs(location.latitude, location.longitude);
  //     console.log('Local Popular Songs:', localPopularSongs);
  //   } catch (error) {
  //     console.error('Error fetching local popular songs', error);
  //     setLoading(false);
  //   }
  // };

  const playSound = async () => {
    try {
      setLoading(true);
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/sample.mp3')
      );
      setSound(sound);
      await sound.playAsync();
      setPlaying(true);
      setCurrentSong('Sample Song'); // Set the name of the currently playing song
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
      setCurrentSong(''); // Clear the current song when stopped
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music Player</Text>
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