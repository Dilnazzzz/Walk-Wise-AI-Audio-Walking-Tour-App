import * as React from 'react';
import { View, Text, Button, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useLayoutEffect, useState } from 'react';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { Avatar } from '../assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Firestore, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { MapPlaceholder, NotFound } from '../assets';


const ProfileScreen = ({ navigation }) => {
    const id = FIREBASE_AUTH.currentUser.uid;
    const userDocRef = doc(FIRESTORE_DB, "users", id);
    const [user, setUser] = useState({});
    const [savedTours, setSavedTours] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);

    useEffect(() => {
        const getUser = async () => {
            const snap = await getDoc(userDocRef);
            setUser({ id, ...snap.data() })
        }
        getUser();
        console.log(user);

        getDocs(collection(FIRESTORE_DB, "tours")).then(docSnap => {
            let savedTours = [];
            docSnap.forEach((doc) => {
                savedTours.push({ ...doc.data() })
            });
            setSavedTours(attractions);
        });

    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView style={styles.container}
                contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                showsVerticalScrollIndicator={false}>
                <Image source={Avatar} style={styles.userImg} />
                <Text style={styles.userName}> Hi, {user.fullName}!  </Text>
                <Text style={styles.aboutUser}>
                    {user.description}
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


                <View className="mt-4 mb-4 flex-row realtive">
                    <Text className="text-[#2C7379] text-[28px] font-bold" > Your Saved Tours </Text>
                </View>
                <ScrollView horizontal={true} className="px-4">
                    {/* {savedTours?.length > 0 ? (
                        <>
                            {savedTours?.map((data, index) => {
                                return (
                                    <View key={index} className="items-center flex-row space-x-6">
                                        <Text className="flex-row items-center justify-center rounded-md py-2 px-2 text-#428288 text-[18px] font-bold" > {data.place} </Text>

                                        <TouchableOpacity
                                            className="rounded-md border border-gray-300 space-y-2 px-3 py-2 bg-white w-[182px] my-2">
                                            <Image source={{ uri: "https://static-00.iconduck.com/assets.00/location-not-found-icon-1784x2048-qxwrlukt.png" }} className="w-full h-40 rounded-md object-cover" />
                                            <Text className="text-[#428288] text-[18px] font-bold">
                                                data.title
                                            </Text>
                                        </TouchableOpacity>

                                    </View>
                                )
                            })}
                        </>
                    ) : (
                        <>
                            <View className="w-full h-[400px] items-center space-y-2 justify-center " >
                                <Image source={NotFound} className=" w-32 h-32 object-cover " />
                                <Text className="text-2xl text-[#428288] font-semibold mb-20" > Ooops...No Data Found</Text>
                            </View>
                        </>
                    )} */}


                    <TouchableOpacity
                        className="rounded-md border border-gray-300 space-y-2 px-3 py-2 bg-white w-[182px] my-2">
                        <Image source={{ uri: "https://static-00.iconduck.com/assets.00/location-not-found-icon-1784x2048-qxwrlukt.png" }} className="w-full h-40 rounded-md object-cover" />
                        <Text className="text-[#428288] text-[18px] font-bold">
                            Tour Title
                        </Text>
                        <View className="flex-row items-center space-x-1">
                            <FontAwesome5 name="map-marker-alt" size={20} color="#8597A2" />
                            <Text className="text-[#428288] text-[14px] font-bold">
                                Location
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="rounded-md border border-gray-300 space-y-2 px-3 py-2 bg-white w-[182px] my-2">
                        <Image source={{ uri: "https://static-00.iconduck.com/assets.00/location-not-found-icon-1784x2048-qxwrlukt.png" }} className="w-full h-40 rounded-md object-cover" />
                        <Text className="text-[#428288] text-[18px] font-bold">
                            Tour Title
                        </Text>
                        <View className="flex-row items-center space-x-1">
                            <FontAwesome5 name="map-marker-alt" size={20} color="#8597A2" />
                            <Text className="text-[#428288] text-[14px] font-bold">
                                Location
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="rounded-md border border-gray-300 space-y-2 px-3 py-2 bg-white w-[182px] my-2">
                        <Image source={{ uri: "https://static-00.iconduck.com/assets.00/location-not-found-icon-1784x2048-qxwrlukt.png" }} className="w-full h-40 rounded-md object-cover" />
                        <Text className="text-[#428288] text-[18px] font-bold">
                            Tour Title
                        </Text>
                        <View className="flex-row items-center space-x-1">
                            <FontAwesome5 name="map-marker-alt" size={20} color="#8597A2" />
                            <Text className="text-[#428288] text-[14px] font-bold">
                                Location
                            </Text>
                        </View>
                    </TouchableOpacity>

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