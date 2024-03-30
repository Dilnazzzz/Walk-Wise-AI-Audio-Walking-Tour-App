import React, { useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, TextInput } from 'react-native';
import { MapPlaceholder, NotFound } from '../assets';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';


const MapScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [saved, setSaved] = useState([]);
    const [chosenn, setChosenn] = useState({});
    const [selectedPlaces, setSelectedPlaces] = useState([])
    const initialRegion = {
        latitude: 51.5074,
        longitude: -0.1272,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
    }
    const [comment, setComment] = useState("");
    const durations = ["1-2 hours", "3-4 hours", "5-6 hours", "7-8 hours"];
    const activities = ["Museum", "Park", "Historical Site", "Shopping Mall", "Restaurant"];
    const accessability = ["Wheelchair Accessible", "Family Friendly", "Pet Friendly", "Elderly Friendly"];

    const tourSummary = {
        places: [],
        duration: "",
        activities: [],
        accessability: [],
        comment: ""
    }

    const markers = [
        {
            latitude: 51.5055,
            longitude: -0.0754,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
            name: "Tower Bridge"
        },
        {
            latitude: 51.5081,
            longitude: -0.0759,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
            name: "Tower of London"
        },
        {
            latitude: 51.5089,
            longitude: -0.1283,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
            name: "National Gallery"
        }];

    const [mapmarkers, setMapmarkers] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
        updateSaved();
    }, []);

    const updateSaved = async () => {
        setIsLoading(true);
        setSaved([]);
        setChosenn({});
        setSelectedPlaces([]);
        getDocs(collection(FIRESTORE_DB, "saved")).then(docSnap => {
            let attractions = [];
            docSnap.forEach((doc) => {
                attractions.push({ ...doc.data() })
            });
            setSaved(attractions);
        });

        saved?.map((data, index) => {
            setChosenn(chosenn => { return { ...chosenn, [data.place]: "square" } })
        });
        setInterval(() => {
            setIsLoading(false);
        }, 4000);
    }

    const selectPlace = (data) => {
        setSelectedPlaces(selectedPlaces => [...selectedPlaces, data.place]);
    }

    const unselectPlace = (data) => {
        let placesCopy = [...selectedPlaces];
        placesCopy.splice(selectedPlaces.indexOf(data.place), 1)
        setSelectedPlaces(placesCopy);
    }

    const updateStatus = (data, index) => {
        if (chosenn[data.place] === "check-square") {
            setChosenn(previousState => { return { ...previousState, [data.place]: "square" } });
            unselectPlace(data);
        } else {
            setChosenn(previousState => { return { ...previousState, [data.place]: "check-square" } });
            selectPlace(data);
        }
    }

    const showsummary = () => {
        tourSummary.comment = comment;
        tourSummary.places = selectedPlaces;
        // alert(tourSummary.data);
        console.log(selectedPlaces);
        console.log(tourSummary);
    }

    return (
        <SafeAreaView className="flex-1 bg-white relative">
            <ScrollView className=" flex-1 px-4 py-4">
                <View className="relative bg-white shadow-lg" >
                    <MapView className="w-full h-72 object-cover rounded-2xl" provider={PROVIDER_GOOGLE} initialRegion={initialRegion} showsUserLocation showsMyLocationButton>
                        {markers.map((marker, index) => (
                            <Marker key={index} coordinate={marker}>
                                <Callout>
                                    <View className="px-2 py-2">
                                        <Text className="text-[#2C7379] text-[18px] font-bold" > {marker.name} </Text>
                                    </View>
                                </Callout>
                            </Marker>
                        ))
                        }
                    </MapView>
                </View>

                <View className="flex-row items-center justify-between mt-4 mb-4">
                    <Text className="text-[#2C7379] text-[28px] font-bold" > Saved Attractions </Text>
                    <TouchableOpacity onPress={updateSaved} className="flex-row items-center justify-center px-4">
                        <Ionicons name="reload" size={28} color="black" />
                    </TouchableOpacity>
                </View>

                {isLoading ? <View className="flex-1 items-center justify-center top-20" >
                    <ActivityIndicator size="large" color="#0B646B" />

                </View> :
                    <View>
                        <View className=" space-y-2 bg-gray-100 rounded-2xl px-4 py-2">
                            {saved?.length > 0 ? (
                                <>
                                    {saved?.map((data, index) => {
                                        return (
                                            <View key={index} className="items-center flex-row space-x-6">
                                                <Text className="flex-row items-center justify-center rounded-md py-2 px-2 text-#428288 text-[18px] font-bold" > {data.place} </Text>

                                                <TouchableOpacity onPress={() => updateStatus(data, index)} className="flex-row items-center justify-center">
                                                    <Feather name={chosenn[data.place]} size={30} color="black" />
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
                            )}
                        </View>

                        <Text className="mt-6 text-[#428288] text-[24px] font-bold">
                            Customize Your Tour
                        </Text>
                        <View className="flex-row items-center space-x-2 mt-4">
                            <Text className="text-[#8C9EA6] text-[20px] font-bold">
                                Preferred Duration
                            </Text>
                        </View>
                        <View className="flex-row gap-2 items-center justify-start flex-wrap mt-4">
                            {durations.map((n) => (
                                <TouchableOpacity onPress={() => { tourSummary.duration = n }}
                                    // key={n.key}
                                    className="px-2 py-1 rounded-md bg-emerald-100"
                                >
                                    <Text>{n}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View className="flex-row items-center space-x-2 mt-4">
                            <Text className="text-[#8C9EA6] text-[20px] font-bold">
                                Desired Activities
                            </Text>
                        </View>
                        <View className="flex-row gap-2 items-center justify-start flex-wrap mt-4">
                            {activities.map((n) => (
                                <TouchableOpacity onPress={() => { tourSummary.activities.push(n) }}
                                    // key={n.key}
                                    className="px-2 py-1 rounded-md bg-emerald-100"
                                >
                                    <Text>{n}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View className="flex-row items-center space-x-2 mt-4">
                            <Text className="text-[#8C9EA6] text-[20px] font-bold">
                                Accessability Needs
                            </Text>
                        </View>
                        <View className="flex-row gap-2 items-center justify-start flex-wrap mt-4">
                            {accessability.map((n) => (
                                <TouchableOpacity onPress={() => { tourSummary.accessability.push(n) }}
                                    // key={n.key}
                                    className="px-2 py-1 rounded-md bg-emerald-100"
                                >
                                    <Text>{n}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View className="flex-row items-center space-x-2 mt-4">
                            <Text className="text-[#8C9EA6] text-[20px] font-bold">
                                Any other suggestions?
                            </Text>
                        </View>
                        <View className="flex-row gap-2 items-center justify-start flex-wrap mt-4">

                            <KeyboardAvoidingView behavior='padding' >
                                <TextInput value={comment} placeholder='Comment' autoCapitalize='none' onChangeText={(text) => setComment(text)}
                                    className="items-center rounded-md w-80 py-1 px-2 justify-center  bg-emerald-100 " >
                                </TextInput>
                            </KeyboardAvoidingView>
                        </View>
                        <View className="inset-x-0  flex-row items-center justify-center shadow-lg py-2">
                        <TouchableOpacity onPress={showsummary} className="flex-row items-center justify-center bg-[#06B2BE] rounded-md px-4 py-2 mt-4" >
                                <Text className="text-white text-[18px] font-bold" >Save your Preferences</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="inset-x-0  flex-row items-center justify-center shadow-lg py-6 bottom-5">
                        <TouchableOpacity onPress={() => navigation.navigate("TourScreen", { param: selectedPlaces })} className="flex-row items-center justify-center bg-[#06B2BE] rounded-md px-4 py-2 mt-4" >
                        {/* <TouchableOpacity onPress={() => navigation.navigate("TourScreen", { param: tourSummary })} className="flex-row items-center justify-center bg-[#06B2BE] rounded-md px-4 py-2 mt-4" > */}
                                <Text className="text-white text-[18px] font-bold" >Generate a Walking Tour</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </ScrollView>
        </SafeAreaView>
    );
};

export default MapScreen;