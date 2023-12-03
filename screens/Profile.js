import * as React from 'react';
import { View, Text, Button, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useLayoutEffect, useState } from 'react';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { Avatar } from '../assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';


const ProfileScreen = ({ navigation }) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView style={styles.container}
                contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                showsVerticalScrollIndicator={false}>
                <Image source={Avatar} style={styles.userImg} />
                <Text style={styles.userName}> Dilnaz Baltabayeva </Text>
                <Text style={styles.aboutUser}>
                    No details added about the user.
                </Text>
                <View style={styles.userBtnWrapper}>
                    <TouchableOpacity style={styles.userBtn} onPress={() => {
                        navigation.navigate('EditProfile');
                    }}>
                        <Text style={styles.userBtnTxt}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userBtn} onPress={() => FIREBASE_AUTH.signOut()}>
                        <Text style={styles.userBtnTxt}>Logout</Text>
                    </TouchableOpacity>
                </View>
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
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
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