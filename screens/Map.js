import React, { useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { MapPlaceholder, NotFound } from '../assets';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const MapScreen = ({ navigation }) => {
    const [saved, setSaved] = useState([]);
    const [chosen, setChosen] = useState("square");
    const [selectedPlaces, setSelectedPlaces] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);

    const updateSaved = () => {
        // to get all the data 
        setSaved([]);
        getDocs(collection(FIRESTORE_DB, "saved")).then(docSnap => {
            let attractions = [];
            docSnap.forEach((doc) => {
                attractions.push({ ...doc.data() })
            });
            setSaved(attractions);

            console.log("Saved Places", attractions);
            console.log(attractions.length)
            console.log(saved.length)
        });

        const unique = [...new Set(saved.map(item => item.place))];
        console.log(unique)
    }

    return (
        <SafeAreaView className="flex-1 bg-white relative">
            <ScrollView className="flex-1 px-4 py-4">
                <View className="relative bg-white shadow-lg" >
                    <Image source={MapPlaceholder} className="w-full h-72 object-cover rounded-2xl " />
                </View>
                <View className="flex-row items-center justify-between mt-4 mb-4">
                    <Text className="text-[#2C7379] text-[28px] font-bold" > Saved Attractions </Text>
                    <TouchableOpacity onPress={updateSaved} className="flex-row items-center justify-center px-4">
                        <Ionicons name="reload" size={28} color="black" />
                    </TouchableOpacity>
                </View>

                <View className=" space-y-2 bg-gray-100 rounded-2xl px-4 py-2">
                    {saved?.length > 0 ? (
                        <>
                            {saved?.map((data, i) => (
                                <View key={i} className="items-center flex-row space-x-6">
                                    <TouchableOpacity onPress={() => {
                                        setChosen(chosen === "square" ? "check-square" : "square");
                                        setSelectedPlaces([...selectedPlaces, data.place]);
                                    }} className="flex-row items-center justify-center">
                                        <Feather name={chosen} size={30} color="black" />
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-row items-center justify-center rounded-md py-2" >
                                        <Text className="text-#428288 text-[18px] font-bold" > {data.place} </Text>
                                    </TouchableOpacity>
                                </View>

                            ))}
                        </>
                    ) : (
                        <>
                            <View className="w-full h-[500px] items-center space-y-4 justify-center " >
                                <Image source={NotFound} className=" w-32 h-32 object-cover " />
                                <Text className="text-2xl text-[#428288] font-semibold mb-20" > Ooops...No Data Found</Text>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>

            <View className="absolute inset-x-0 bottom-0 flex-row items-center justify-center bg-white shadow-lg py-4">
                <TouchableOpacity onPress={() => navigation.navigate("TourScreen", { param: selectedPlaces })} className="flex-row items-center justify-center bg-[#06B2BE] rounded-md px-4 py-2 mt-4" >
                    <Text className="text-white text-[18px] font-bold" >Generate a Walking Tour </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>

    );
};

export default MapScreen;