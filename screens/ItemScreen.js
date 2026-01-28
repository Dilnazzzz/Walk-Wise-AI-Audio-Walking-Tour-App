import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useLayoutEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';

import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
import { slugify } from '../utils/slugify';

const ItemScreen = ({ route }) => {
  const navigation = useNavigation();
  const data = route?.params?.item;
  const name = data?.name;
  const [status, setStatus] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    const id = slugify(name);
    getDoc(doc(FIRESTORE_DB, 'saved', id))
      .then((docSnap) => {
        if (docSnap.exists()) {
          // console.log(docSnap.data());
          setStatus('heart');
        } else {
          // console.log("Document does not exist")
          setStatus('hearto');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const save = () => {
    // if it is saved already, unsave
    if (status === 'heart') {
      setStatus('hearto');
      deleteDoc(doc(FIRESTORE_DB, 'saved', slugify(name)))
        .then(() => {
          alert('Deleted!');
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      if (!FIREBASE_AUTH.currentUser?.uid) {
        alert('Please log in to save places.');
        return;
      }
      setStatus('heart');
      setDoc(doc(FIRESTORE_DB, 'saved', slugify(name)), {
        userID: FIREBASE_AUTH.currentUser.uid,
        place: name,
      })
        .then(() => {
          alert('Saved!');
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="relative bg-white shadow-lg">
          <Image
            source={{
              uri: data?.photo?.images?.large?.url
                ? data?.photo?.images?.large?.url
                : 'https://static-00.iconduck.com/assets.00/location-not-found-icon-1784x2048-qxwrlukt.png',
            }}
            className="w-full h-72 object-cover rounded-2xl "
          />
          <View className="absolute flex-row inset-x-0 top-5 justify-end px-6">
            <TouchableOpacity
              onPress={save}
              className="w-10 h-10 rounded-md items-center justify-center bg-[#06B2BE]"
            >
              {/* <FontAwesome5 name="heartbeat" size={24} color="#fff" /> */}
              <AntDesign name={status} size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View className="absolute flex-row inset-x-0 bottom-5 justify-end px-6">
            <View className="px-2 py-1 rounded-md bg-teal-100">
              <Text>{data?.open_now_text}</Text>
            </View>
          </View>
        </View>
        <View className="mt-6">
          <Text className="text-[#428288] text-[24px] font-bold">{data?.name}</Text>
          <View className="flex-row items-center space-x-2 mt-2">
            <FontAwesome name="map-marker" size={25} color="#8C9EA6" />
            <Text className="text-[#8C9EA6] text-[20px] font-bold">{data?.location_string}</Text>
          </View>
        </View>

        {data?.description && (
          <Text className="mt-4 tracking-wide text-[16px] font-semibold text-[#97A6AF]">
            {data?.description}
          </Text>
        )}
        {data?.subcategory && (
          <View className="flex-row gap-2 items-center justify-start flex-wrap mt-4">
            {data?.subcategory.map((n) => (
              <TouchableOpacity key={n.key} className="px-2 py-1 rounded-md bg-emerald-100">
                <Text>{n.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className=" space-y-2 mt-4 bg-gray-100 rounded-2xl px-4 py-2">
          {data?.phone && (
            <View className="items-center flex-row space-x-6">
              <FontAwesome name="phone" size={24} color="#428288" />
              <Text className="text-lg">{data?.phone}</Text>
            </View>
          )}
          {data?.email && (
            <View className="items-center flex-row space-x-6">
              <FontAwesome name="envelope" size={24} color="#428288" />
              <Text className="text-lg">{data?.email}</Text>
            </View>
          )}
          {data?.address && (
            <View className="items-center flex-row space-x-6">
              <FontAwesome name="map-pin" size={24} color="#428288" />
              <Text className="text-lg">{data?.address}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemScreen;
