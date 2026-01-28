import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';

const TourScreen = ({ route }) => {
  const navigation = useNavigation();
  const data = route?.params?.stops || [];
  const PROXY_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const [lastMessage, setLastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [tourDescription, setTourDescription] = useState('');
  const [guidance, setGuidance] = useState('');

  const [playing, setPlaying] = useState({});

  const initialRegion = {
    latitude: 51.5074,
    longitude: -0.1272,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };
  const markers = [
    {
      latitude: 51.5055,
      longitude: -0.0754,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      name: 'Tower Bridge',
    },
    {
      latitude: 51.5081,
      longitude: -0.0759,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      name: 'Tower of London',
    },
    {
      latitude: 51.5089,
      longitude: -0.1283,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      name: 'National Gallery',
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    handleSend(unique);
    // initialize play/pause state for each stop in a single state update
    setPlaying(unique.reduce((acc, name) => ({ ...acc, [name]: 'play' }), {}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unique = [...new Set(data)];

  const handleSend = async (unique) => {
    if (!PROXY_BASE_URL) {
      Alert.alert(
        'Configuration error',
        'Missing EXPO_PUBLIC_API_BASE_URL. Please configure the serverless proxy.',
      );
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${PROXY_BASE_URL}/api/generateTour`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stops: unique }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to generate tour');
      setTitle((json?.title || '').replaceAll('"', ''));
      setTourDescription(json?.overview || '');
      setGuidance(json?.guidance || '');
      setLastMessage(json?.overview || '');
    } catch (e) {
      Alert.alert('Generation failed', e?.message || String(e));
    } finally {
      setIsLoading(false);
    }
  };

  // generation is handled by serverless endpoint `/api/generateTour`

  // removed 4 nearly-identical functions in favor of requestChatCompletion helper

  const playAudio = () => {
    const options = {
      voice: 'com.apple.ttsbundle.siri_Nicky_en-US_compact',
    };
    Speech.speak(lastMessage, options);
  };

  const saveTour = async () => {
    if (!title) {
      Alert.alert('Nothing to save yet', 'Please generate a tour first.');
      return;
    }
    const uid = FIREBASE_AUTH.currentUser?.uid;
    if (!uid) {
      Alert.alert('Login required', 'Please log in to save tours to your profile.');
      return;
    }
    await addDoc(collection(FIRESTORE_DB, 'users', uid, 'tours'), {
      userID: uid,
      title,
      description: tourDescription,
      guidance,
      createdAt: serverTimestamp(),
    })
      .then(() => {
        Alert.alert('Saved', 'Tour has been saved to your profile.');
      })
      .catch((error) => {
        Alert.alert('Save failed', error.message);
      });
  };

  const changeStatus = (data, index) => {
    if (playing[data] === 'play') {
      setPlaying((playing) => {
        return { ...playing, [data]: 'pause' };
      });
      playAudio();
    } else {
      setPlaying((playing) => {
        return { ...playing, [data]: 'play' };
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <ScrollView className="px-4 py-4">
        <View className="flex-1">
          <View className="relative bg-white shadow-lg">
            <MapView
              className="w-full h-72 object-cover rounded-2xl"
              provider={PROVIDER_GOOGLE}
              initialRegion={initialRegion}
              showsUserLocation
              showsMyLocationButton
            >
              {markers.map((marker, index) => (
                <Marker key={index} coordinate={marker}>
                  <Callout>
                    <View className="px-2 py-2">
                      <Text className="text-[#2C7379] text-[18px] font-bold"> {marker.name} </Text>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>
          </View>
          {isLoading ? (
            <View className="flex-1 relative items-center justify-center top-20">
              <ActivityIndicator size="large" color="#0B646B" />
            </View>
          ) : (
            <View>
              <View className="flex-row items-center justify-between mt-4 px-2">
                {/* <Text className="text-[#2C7379] text-[28px] font-bold" > Your Tour is Ready 🤖 </Text> */}
                <Text className="text-[#2C7379] text-[24px] font-bold">{title}</Text>
                <TouchableOpacity
                  onPress={() => {
                    alert(guidance);
                  }}
                  className="flex-row items-center justify-center px-4"
                >
                  <Feather name="map" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center mt-4 px-2">
                <Text className="text-[#8C9EA6] text-[16px] font-bold">{tourDescription}</Text>
              </View>

              {unique.map((data, index) => {
                return (
                  <View>
                    <View key={index} className="items-center flex-row space-x-6">
                      <Text className="mt-4 px-2 text-[#428288] text-[24px] font-bold">
                        Stop {index + 1}: {data}
                      </Text>
                    </View>
                    <View className=" mt-2 space-y-2 bg-gray-100 rounded-2xl px-4 py-4">
                      <View className="items-center flex-row space-x-6">
                        <TouchableOpacity
                          onPress={() => changeStatus(data, index)}
                          className="flex-row items-center justify-center"
                        >
                          <Feather name={playing[data]} size={24} color="black" />
                        </TouchableOpacity>
                        {/* <TouchableOpacity className="flex-row items-center justify-center">
                                                    <Feather name="pause" size={24} color="black" />
                                                </TouchableOpacity> */}
                      </View>
                    </View>
                  </View>
                );
              })}

              <View className="inset-x-0  flex-row items-center justify-center shadow-lg py-6 bottom-5">
                <TouchableOpacity
                  onPress={saveTour}
                  className="flex-row items-center justify-center bg-[#06B2BE] rounded-md px-4 py-2 mt-4"
                >
                  <Text className="text-white text-[18px] font-bold">Save This Walking Tour</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        {/* <View style={styles.container}>
                    <Text className="text-[16px] text-center pt-4"> These are the place you chose to visit: </Text>
                    <Text className="text-[16px] text-center pt-4"> {unique.map((step, index) => <Text key={index}>{step}{"\n"}</Text>)} </Text>
                    <Button className="text-[18px] text-center px-2" title="Submit" onPress={() => handleSend(unique)} />
                    <View>
                        <TouchableOpacity style={styles.play} onPress={playAudio}>
                            <Text> Play the audio</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TourScreen;
