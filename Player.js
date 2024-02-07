import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Axios } from 'axios';

const Player = () => {
  const [sound, setSound] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [countryCode, setCountryCode] = useState(null);
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
      const countryCode = location ? await getCountryCodeAsync(location.latitude, location.longitude) : 'US'; 
      const localPopularSongs = await getLocalPopularSongs(countryCode);
      if (localPopularSongs.length > 0) {
        setCurrentSong(`${localPopularSongs[0].name} - ${localPopularSongs[0].singer}`);
      }
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
      setCurrentSong('');
    }
  };

  return <>
  <View style={styles.container}>
      <View style={styles.leftContent}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={isLoading ? null : isPlaying ? pauseSound : playSound}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.playButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.title}>Now Playing</Text>
        <Text style={styles.songText}>{currentSong || 'No song playing'}</Text>
        {isPlaying && (
          <TouchableOpacity style={styles.stopButton} onPress={stopSound}>
            <Text style={styles.stopButtonText}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>

    <View style={styles.container}>
      <View style={styles.leftContent}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={isLoading ? null : isPlaying ? pauseSound : playSound}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.playButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.title}>Now Playing</Text>
        <Text style={styles.songText}>{currentSong || 'No song playing'}</Text>
        {isPlaying && (
          <TouchableOpacity style={styles.stopButton} onPress={stopSound}>
            <Text style={styles.stopButtonText}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>

    <View style={styles.container}>
      <View style={styles.leftContent}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={isLoading ? null : isPlaying ? pauseSound : playSound}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.playButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.title}>Now Playing</Text>
        <Text style={styles.songText}>{currentSong || 'No song playing'}</Text>
        {isPlaying && (
          <TouchableOpacity style={styles.stopButton} onPress={stopSound}>
            <Text style={styles.stopButtonText}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>

    <View style={styles.container}>
      <View style={styles.leftContent}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={isLoading ? null : isPlaying ? pauseSound : playSound}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.playButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.title}>Now Playing</Text>
        <Text style={styles.songText}>{currentSong || 'No song playing'}</Text>
        {isPlaying && (
          <TouchableOpacity style={styles.stopButton} onPress={stopSound}>
            <Text style={styles.stopButtonText}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
    </>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#1E90FF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 20,
    elevation: 4, 
    top: 0,
    overflow: "scroll",
  },
  leftContent: {
    flex: 1,
    alignItems: 'center',
  },
  rightContent: {
    flex: 2,
    marginLeft: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  songText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  stopButton: {
    backgroundColor: '#DC143C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  stopButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Player;
