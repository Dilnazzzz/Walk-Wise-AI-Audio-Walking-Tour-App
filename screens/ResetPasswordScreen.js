import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { FIREBASE_AUTH } from '../FirebaseConfig';
import { ForgotPasswordImage } from '../assets';

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="bg-[#d7eafd] flex-1 relative">
      <View className="flex-row px-6 mt-8 items-center justify-center space-x-2">
        <Text className="text-[#2A2B4B] text-3xl font-semibold ">Reset Password</Text>
      </View>

      <View className="relative border-[#00BCC9] rounded-xl items-center justify-center shadow-lg mt-8 pt-2 mb-10">
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          className="flex-row items-center rounded-3xl w-72 py-2 px-4 shadow-lg justify-center text-[#3C6072] bg-white text-[24px] font-semibold"
        />

        <TouchableOpacity
          onPress={async () => {
            try {
              if (!email) return Alert.alert('Email required');
              await sendPasswordResetEmail(FIREBASE_AUTH, email);
              Alert.alert('Check your inbox', 'Password reset email sent.');
              navigation.goBack();
            } catch (e) {
              Alert.alert('Reset failed', e?.message || String(e));
            }
          }}
          className="relative border-[#00BCC9] rounded-xl items-center justify-center shadow-lg space-x-2 pt-2 mt-4 flex-row"
        >
          <Animatable.View
            animation="pulse"
            pulse="ease-in-out"
            iterationCount="infinite"
            className="flex-row items-center rounded-3xl w-60 py-1 px-4 shadow-lg justify-center bg-[#00BCC9]"
          >
            <Text className="text-gray-50 text-[30px] font-semibold">Reset</Text>
          </Animatable.View>
        </TouchableOpacity>
      </View>

      <View className="flex-1 relative items-center justify-center top-40 pt-10">
        <Animatable.Image
          // animation="fadeIn"
          // easing="ease-in-out"
          source={ForgotPasswordImage}
          className="w-100 h-3/6"
        />
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
