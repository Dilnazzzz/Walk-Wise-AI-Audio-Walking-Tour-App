import { FontAwesome5 } from '@expo/vector-icons';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import * as React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { Avatar, NotFound } from '../assets';

const ProfileScreen = ({ navigation }) => {
  const uid = FIREBASE_AUTH.currentUser?.uid;
  const userDocRef = uid ? doc(FIRESTORE_DB, 'users', uid) : null;
  const [user, setUser] = useState({});
  const [savedTours, setSavedTours] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      if (userDocRef) {
        const snap = await getDoc(userDocRef);
        setUser({ id: uid, ...(snap.data() || {}) });
      }
      if (uid) {
        const q = query(
          collection(FIRESTORE_DB, 'users', uid, 'tours'),
          orderBy('createdAt', 'desc'),
        );
        const docSnap = await getDocs(q);
        const tours = [];
        docSnap.forEach((d) => tours.push({ id: d.id, ...d.data() }));
        setSavedTours(tours);
      }
    };
    load();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <Image source={Avatar} style={styles.userImg} />
        <Text style={styles.userName}> Hi, {user.fullName}! </Text>
        <Text style={styles.aboutUser}>{user.description}</Text>
        <View style={styles.userBtnWrapper}>
          <TouchableOpacity
            style={styles.userBtn}
            onPress={() => {
              navigation.navigate('EditProfile');
            }}
          >
            <Text style={styles.userBtnTxt}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.userBtn} onPress={() => FIREBASE_AUTH.signOut()}>
            <Text style={styles.userBtnTxt}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-4 mb-4 flex-row realtive">
          <Text className="text-[#2C7379] text-[28px] font-bold"> Your Saved Tours </Text>
        </View>
        <ScrollView horizontal className="px-4">
          {savedTours?.length > 0 ? (
            <>
              {savedTours.map((t, index) => (
                <TouchableOpacity
                  key={t.id || index}
                  className="rounded-md border border-gray-300 space-y-2 px-3 py-2 bg-white w-[220px] my-2 mr-3"
                >
                  <Image
                    source={{
                      uri: 'https://static-00.iconduck.com/assets.00/location-not-found-icon-1784x2048-qxwrlukt.png',
                    }}
                    className="w-full h-40 rounded-md object-cover"
                  />
                  <Text className="text-[#428288] text-[18px] font-bold">{t.title}</Text>
                  <View className="flex-row items-center space-x-1">
                    <FontAwesome5 name="map-marker-alt" size={20} color="#8597A2" />
                    <Text className="text-[#428288] text-[14px] font-bold">Your Tour</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <>
              <View className="w-full h-[200px] items-center space-y-2 justify-center ">
                <Image source={NotFound} className=" w-20 h-20 object-cover " />
                <Text className="text-lg text-[#428288] font-semibold">No Saved Tours Yet</Text>
              </View>
            </>
          )}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#2e64e5',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#2e64e5',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
