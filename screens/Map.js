import React, { useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { MapPlaceholder, NotFound } from '../assets';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
// import { FIREBASE_APP } from '../FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const MapScreen = ({ navigation }) => {
    const [saved, setSaved] = useState([]); // taskitems
    // const [chosen, setChosen] = useState("square");
    const [chosenn, setChosenn] = useState({});
    const [selectedPlaces, setSelectedPlaces] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
        // console.log(selectedPlaces)
        // setSaved([]);
        // getDocs(collection(FIRESTORE_DB, "saved")).then(docSnap => {
        //     let attractions = [];
        //     docSnap.forEach((doc) => {
        //         attractions.push({ ...doc.data() })
        //     });
        //     setSaved(attractions);

        //     // console.log("Saved Places", attractions);
        //     // console.log(attractions.length)
        //     // console.log(saved.length)

        // });
    }, []);

    // const FIRESTORE_DB = getFirestore(FIREBASE_APP);

    const updateSaved = async () => {
        // to get all the data 
        setSaved([]);
        setChosenn({});
        setSelectedPlaces([]);
        // console.log("updateSaved")
        getDocs(collection(FIRESTORE_DB, "saved")).then(docSnap => {
            let attractions = [];
            docSnap.forEach((doc) => {
                attractions.push({ ...doc.data() })
            });
            setSaved(attractions);
        });
        // console.log(saved)

        saved?.map((data, index) => {
            // console.log(data, index)
            setChosenn(chosenn => {return { ...chosenn, [data.place]: "square" }})});

        // console.log("Saved Places", attractions);
        // console.log(attractions.length)
        // console.log(saved.length)
        // console.log(chosenn)

        // const unique = [...new Set(saved.map(item => item.place))];
        // console.log(unique)
    }

    const selectPlace = (data) => {
        setSelectedPlaces(selectedPlaces => [...selectedPlaces, data.place]);
        // console.log(data.place)
        // console.log(selectedPlaces)
    }

    const unselectPlace = (data) => {
        // selectedPlaces.findIndex(index => index.name === 'data.place')
        let placesCopy = [...selectedPlaces];
        // placesCopy.splice(index, 1);
        placesCopy.splice(selectedPlaces.indexOf(data.place), 1)
        // console.log(index)
        setSelectedPlaces(placesCopy);
        // console.log(selectedPlaces)
    }

    const updateStatus =  (data, index) => {
        // console.log(data.place)
        // console.log(index)
        if (chosenn[data.place] === "check-square" ) {
            setChosenn(previousState => {return {...previousState, [data.place]:"square" }});

            // setChosen("square");
            unselectPlace(data);
            // console.log("unselected");
            // console.log(selectedPlaces);
        } else {
            // setChosen(chosen => ({ ...chosen, index: "check-square" }));
            // setChosenn({data: "check-square"})
            setChosenn(previousState => {return {...previousState, [data.place]:"check-square" }});
            // setChosen("check-square");
            selectPlace(data);
            // console.log("selected");
            // console.log(selectedPlaces)
        }
        // console.log(selectedPlaces)
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
                            {saved?.map((data, index) => {
                                return (
                                    <View key={index} className="items-center flex-row space-x-6">
                                        <Text className="flex-row items-center justify-center rounded-md py-2 px-2 text-#428288 text-[18px] font-bold" > {data.place} </Text>
                                        
                                        {/* <TouchableOpacity key={index} onPress={() => {
                                            // let selectedPlaces = [[]];
                                            // console.log(index)
                                            // setChosen(chosenn => ({ ...chosenn, index: "check-square" }));
                                            // console.log(chosenn)

                                            // if (selectedPlaces.includes(data.place)) {
                                            //     setChosen("square");
                                            //     // let placesCopy = [...selectedPlaces];
                                            //     // placesCopy.splice(index, 1);
                                            //     // setSelectedPlaces(placesCopy);
                                            //     // console.log(selectedPlaces)
                                            // } else {
                                            //     setChosen("check-square");
                                            //     setSelectedPlaces([...selectedPlaces, data.place]);
                                            //     console.log(selectedPlaces)
                                            // }
                                            setChosen(chosen === "square" ? "check-square" : "square");
                                            setSelectedPlaces([...selectedPlaces, data.place]);

                                            console.log(selectedPlaces)
                                            console.log(chosen)
                                            console.log(index) */}

                                            <TouchableOpacity onPress={() => updateStatus(data, index)} className="flex-row items-center justify-center">
                                            <Feather name={chosenn[data.place]} size={30} color="black" />
                                        </TouchableOpacity>
                                    </View>



                                    // setChosen({...chosen, index:"square"}),
                                    // <View key={index} className="items-center flex-row space-x-6">
                                    //     <TouchableOpacity onPress={() => updateStatus(data, index)} className="flex-row items-center justify-center">

                                    //         <Feather name={chosen[index]} size={30} color="black" />
                                    //         <Text className="flex-row items-center justify-center rounded-md py-2 px-2 text-#428288 text-[18px] font-bold" > {data.place} </Text>
                                    //     </TouchableOpacity>
                                    //     <TouchableOpacity className="flex-row items-center justify-center rounded-md py-2" >
                                    //         <Text className="text-#428288 text-[18px] font-bold" > {data.place} </Text>
                                    //     </TouchableOpacity>
                                    // </View>

                                )
                            })}
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