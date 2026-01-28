import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import { FIREBASE_AUTH } from '../FirebaseConfig';
import { HeroImage } from '../assets';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (_) {
      alert('Invalid email or password!');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    navigation.navigate('SignUpScreen');

    // setLoading(true);
    // try {
    //   const response = await createUserWithEmailAndPassword(auth, email, password);
    //   // console.log(response);
    //   alert("You are ready to sign in!")
    // } catch (error) {
    //   // console.log(error);
    //   alert("Please write your email and password! Then sign in!")
    // } finally {
    //   setLoading(false);
    // }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="bg-[#CCE5FD] flex-1 relative">
      <View className="flex-row px-6 mt-8 items-center justify-start space-x-2">
        <Text className="text-[#2A2B4B] text-3xl font-semibold">Walk Wise</Text>
      </View>

      <View className="px-6 mt-8 space-y-3">
        <Text className="text-[#3C6072] text-[42px]">Enjoy the trip with</Text>
        <Text className="text-[#00BCC9] text-[37px] font-bold">Meaningful Moments</Text>
        <Text className="text-[#3C6072] text-base">
          Use this app to explore the city with customized audio walking tours. Anywhere, anytime,
          and with anyone.
        </Text>
      </View>

      <View className="relative border-[#00BCC9] rounded-xl items-center justify-center shadow-lg mt-8 pt-2 ">
        <KeyboardAvoidingView behavior="padding">
          <TextInput
            value={email}
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
            className="flex-row items-center rounded-3xl w-72 py-2 px-4 shadow-lg justify-center text-[#3C6072] bg-white text-[24px] font-semibold"
          />
          <TextInput
            value={password}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
            className="flex-row top-5 items-center rounded-3xl w-72 py-2 px-4 shadow-lg justify-center text-[#3C6072] bg-white text-[24px] font-semibold"
          />

          {loading ? (
            <ActivityIndicator size="large" color="#00BCC9" />
          ) : (
            <>
              <TouchableOpacity
                className="flex-row items-center justify-center space-x-2 pt-6"
                onPress={() => {
                  navigation.navigate('ResetPasswordScreen');
                }}
              >
                <Text className="text-[#3C6072] text-[15px] font-bold">
                  {' '}
                  Forgot your password?{' '}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={signIn}
                className="relative border-[#00BCC9] rounded-xl items-center justify-center shadow-lg mt-4"
              >
                <Animatable.View
                  animation="pulse"
                  pulse="ease-in-out"
                  iterationCount="infinite"
                  className="flex-row items-center rounded-3xl w-60 py-1 px-4 shadow-lg justify-center bg-[#00BCC9]"
                >
                  <Text className="text-gray-50 text-[30px] font-semibold">Log In</Text>
                </Animatable.View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={signUp}
                className="flex-row items-center justify-center space-x-2 pt-2"
              >
                <Text className="text-[#2A2B4B] text-[20px] font-bold"> Create a new account </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity 
              onPress={() => {navigation.navigate('SignUpScreen')}}
              className="flex-row items-center justify-center space-x-2 pt-2">
                <Text className="text-[#2A2B4B] text-[20px] font-bold"> Create a new account </Text>
              </TouchableOpacity> */}
            </>
          )}
        </KeyboardAvoidingView>
      </View>

      <View className="flex-1 relative items-center justify-center">
        <Animatable.Image
          // animation="fadeIn"
          // easing="ease-in-out"
          source={HeroImage}
          className="w-full h-full top-5"
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
