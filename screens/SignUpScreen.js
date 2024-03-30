import { View, Text, SafeAreaView, Image, TouchableOpacity, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { NotFound } from '../assets';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { SignUpImage } from '../assets';
import { ForgotPasswordImage } from '../assets';
import { doc, setDoc } from 'firebase/firestore';


const SignUpScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(null);
    const [personalInfo, setPersonalInfo] = useState(null);
    const auth = FIREBASE_AUTH;

    const signUp = async () => {
        setLoading(true);
        // if sign up is successful, go to home screen
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            // console.log(response);
            saveInfo();
            alert("Account has been created. You are ready to sign in!");
        } catch (error) {
            console.log(error);
            alert("Please write your email and password!")
        } finally {
            setLoading(false);
        }
    }

    const saveInfo = () => {
        setDoc(doc(FIRESTORE_DB, "users", FIREBASE_AUTH.currentUser.uid), {
            // userID: FIREBASE_AUTH.currentUser.uid,
            fullName: name,
            description: personalInfo
        }).then(() => {
        }).catch((error) => {
            alert(error.message);
        })
        return;
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);

    return (
        <SafeAreaView className="bg-[#CCE5FD] flex-1 relative">
            <View className="flex-row px-6 mt-8 items-center justify-center space-x-2">
                <Text className="text-[#2A2B4B] text-3xl font-semibold ">
                    Sign Up
                </Text>
            </View>

            <View className="relative border-[#00BCC9] rounded-xl items-center justify-center shadow-lg mt-4 pt-2">
                <KeyboardAvoidingView behavior='padding' >
                    <TextInput value={name} placeholder='Name' autoCapitalize='none' onChangeText={(text) => setName(text)}
                        className="flex-row items-center rounded-3xl w-72 py-2 px-4 shadow-lg justify-center text-[#3C6072] bg-white text-[24px] font-semibold" >
                    </TextInput>
                    <TextInput value={email} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)}
                        className="flex-row top-5 items-center rounded-3xl w-72 py-2 px-4 shadow-lg justify-center text-[#3C6072] bg-white text-[24px] font-semibold" >
                    </TextInput>
                    <TextInput value={password} placeholder='Password' secureTextEntry={true} autoCapitalize='none' onChangeText={(text) => setPassword(text)}
                        className="flex-row top-10 items-center rounded-3xl w-72 py-2 px-4 shadow-lg justify-center text-[#3C6072] bg-white text-[24px] font-semibold" >
                    </TextInput>
                    <TextInput value={personalInfo} placeholder='About Me' multiline={true} autoCapitalize='none' onChangeText={(text) => setPersonalInfo(text)}
                        className="flex-row top-10 mt-5 items-center rounded-3xl h-40 w-72 py-2 px-4 shadow-lg justify-center text-[#3C6072] bg-white text-[24px] font-semibold" >
                    </TextInput>
                </KeyboardAvoidingView>

                {loading ? (
                    <ActivityIndicator size="large" color="#00BCC9" />
                ) : (
                    <>
                        <TouchableOpacity
                            onPress={signUp}
                            className="relative border-[#00BCC9] rounded-xl items-center justify-center shadow-lg space-x-2 top-10 pt-2 mt-5 flex-row">
                            <Animatable.View
                                animation={"pulse"}
                                pulse="ease-in-out"
                                iterationCount={"infinite"}
                                className="flex-row items-center rounded-3xl w-60 py-1 px-4 shadow-lg justify-center bg-[#00BCC9]">
                                <Text className="text-gray-50 text-[30px] font-semibold">
                                    Sign Up
                                </Text>
                            </Animatable.View>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <View className="flex-1 relative items-center justify-center top-10 mt-2 pt-8">
                <Animatable.Image
                    // animation="fadeIn"
                    // easing="ease-in-out"
                    source={SignUpImage}
                    className="w-full h-full" />

            </View>
        </SafeAreaView>
    )
}

export default SignUpScreen;