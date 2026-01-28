import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { Avatar } from '../assets';

const EditProfile = () => {
  const navigation = useNavigation();
  const uid = FIREBASE_AUTH.currentUser?.uid;
  const userDocRef = uid ? doc(FIRESTORE_DB, 'users', uid) : null;
  const [user, setUser] = useState({});
  const [name, setName] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!userDocRef) return;
      const snap = await getDoc(userDocRef);
      const u = { id: uid, ...(snap.data() || {}) };
      setUser(u);
      setName(u.fullName || '');
      setPersonalInfo(u.description || '');
    };
    load();
  }, []);

  const saveInfo = () => {
    setDoc(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid), {
      // if name is null, then use the original name
      fullName: name,
      description: personalInfo,
    })
      .then(() => {
        navigation.goBack();
        // navigation.navigate('ProfileScreen');

        alert('Info saved');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <Image source={Avatar} style={styles.userImg} />

        <View className="relative border-[#00BCC9] rounded-xl items-center justify-center shadow-lg mt-4 pt-2">
          <KeyboardAvoidingView behavior="padding">
            <Text style={styles.userName}>Your Full Name</Text>

            <TextInput
              value={name}
              placeholder={user.fullName}
              autoCapitalize="none"
              onChangeText={(text) => setName(text === null ? user.fullName : text)}
              className="flex-row items-center rounded-3xl w-72 py-2 px-4 shadow-lg justify-center text-[#3C6072] bg-white text-[20px] font-semibold"
            />
            {/* <TextInput value={email} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)}
                        className="flex-row top-5 items-center rounded-3xl w-72 py-2 px-4 shadow-lg justify-center text-[#3C6072] bg-white text-[24px] font-semibold" >
                    </TextInput>
                    <TextInput value={password} placeholder='Password' secureTextEntry={true} autoCapitalize='none' onChangeText={(text) => setPassword(text)}
                        className="flex-row top-10 items-center rounded-3xl w-72 py-2 px-4 shadow-lg justify-center text-[#3C6072] bg-white text-[24px] font-semibold" >
                    </TextInput> */}
            <Text style={styles.userName}>About You</Text>
            <TextInput
              value={personalInfo}
              placeholder={user.description}
              multiline
              autoCapitalize="none"
              onChangeText={(text) => setPersonalInfo(text === null ? user.description : text)}
              className="flex-row items-center rounded-3xl h-40 w-72 py-2 px-4 shadow-lg justify-center text-[#3C6072] bg-white text-[20px] font-semibold"
            />
          </KeyboardAvoidingView>
        </View>
        <View style={styles.userBtnWrapper}>
          {/* <TouchableOpacity style={styles.userBtn} onPress={() => { navigation.goBack() }}> */}
          <TouchableOpacity style={styles.userBtn} onPress={saveInfo}>
            <Text style={styles.userBtnTxt}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

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
    marginTop: 20,
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
