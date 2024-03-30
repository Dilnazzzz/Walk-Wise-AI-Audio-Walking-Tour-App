import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { writeAudioToFile } from '../components/writeAudioToFile';
import { playFromPath } from '../components/playFromPath';
import * as Speech from 'expo-speech';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const TourScreen = ({ route }) => {
    const navigation = useNavigation();
    const data = route?.params?.param;
    const API_KEY = "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";
    const systemMessage = {
        "role": "system", "content": "Create a description of the places I want to visit, including its history, significance and any other interesting facts."
    }
    const systemMessage2 = {
        "role": "system", "content": "Create a short general description in 100 words of the walking tour based on the places I want to visit."
    }
    const systemMessage3 = {
        "role": "system", "content": "Create a very short title for the walking tour based on the places I want to visit. Remove quotation marks."
    }
    const systemMessage4 = {
        "role": "system", "content": "Create a guidance on how to get from one place to the other"
    }

    const [lastMessage, setLastMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [tourDescription, setTourDescription] = useState("");
    const [guidance, setGuidance] = useState("");

    const [playing, setPlaying] = useState({});

    const initialRegion = {
        latitude: 51.5074,
        longitude: -0.1272,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
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

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
        console.log(data);
        handleSend(unique)
        unique.map((data, index) => {
            setPlaying(playing => { return { ...playing, [data]: "play" } })
        });

    }, []);

    const unique = [...new Set(data)];
    const requestText = unique.toString()
    const [messages, setMessages] = useState([
        {
            message: "Hello, I'm ChatGPT! Ask me anything!",
            sentTime: "just now",
            sender: "ChatGPT"
        }
    ]);

    const handleSend = async (unique) => {
        setIsLoading(true);
        let message = unique.toString();
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user"
        };
        const newMessages = [...messages, newMessage];

        setMessages(newMessages);
        
        processMessageToChatGPT(newMessages); // get the last message aka each site dexcription 
        processMessageToChatGPT2(newMessages); // get the general tour description
        processMessageToChatGPT3(newMessages); // get the title of the tour
        await processMessageToChatGPT4(newMessages); // get the guidance for the tour 
    };

    const processMessageToChatGPT = async (chatMessages) => {
        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "ChatGPT") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.message }
        });
        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,  // The system message DEFINES the logic of our chatGPT
                ...apiMessages // The messages from our chat with ChatGPT
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
            }).then((data) => {
                return data.json();
            }).then((data) => {
                // console.log(data);
                setMessages([...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT"
                }]);
                setLastMessage(data.choices[0].message.content);
                console.log('last message', data.choices[0].message.content);
            });
        // setIsLoading(false);
    }

    const processMessageToChatGPT2 = async (chatMessages) => {
        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "ChatGPT") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.message }
        });
        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage2,  // The system message DEFINES the logic of our chatGPT
                ...apiMessages // The messages from our chat with ChatGPT
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
            }).then((data) => {
                return data.json();
            }).then((data) => {
                // console.log(data);
                setMessages([...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT"
                }]);
                setTourDescription(data.choices[0].message.content);
                console.log('tour description', data.choices[0].message.content);
            });
        // setIsLoading(false);
    }
    const processMessageToChatGPT3 = async (chatMessages) => {
        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "ChatGPT") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.message }
        });
        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage3,  // The system message DEFINES the logic of our chatGPT
                ...apiMessages // The messages from our chat with ChatGPT
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
            }).then((data) => {
                return data.json();
            }).then((data) => {
                // console.log(data);
                setMessages([...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT"
                }]);
                setTitle(data.choices[0].message.content);
                console.log('title', data.choices[0].message.content);
            });
        // setIsLoading(false);
    }

    const processMessageToChatGPT4 = async (chatMessages) => {
        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "ChatGPT") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.message }
        });
        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage4,  // The system message DEFINES the logic of our chatGPT
                ...apiMessages // The messages from our chat with ChatGPT
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
            }).then((data) => {
                return data.json();
            }).then((data) => {
                // console.log(data);
                setMessages([...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT"
                }]);
                setGuidance(data.choices[0].message.content);
                console.log('guidance', data.choices[0].message.content);
            });
        setIsLoading(false);
    }

    const playAudio = () => {
        const options = {
            voice: "com.apple.ttsbundle.siri_Nicky_en-US_compact"
        }
        const greeting = "Hello, I'm ChatGPT! Ask me anything!";
        Speech.speak(lastMessage, options);
        console.log(lastMessage);
    }

    const listAllVoiceOptions = async () => {
        let voices = await Speech.getAvailableVoicesAsync();
        console.log(voices);
    }

    const saveTour = async (unique) => {
        setDoc(doc(FIRESTORE_DB, "tours", title), {
            // userID: FIREBASE_AUTH.currentUser.uid,
            title: title,
            description: tourDescription,
            guidance: guidance,
        }).then(() => {
            alert("Tour has been saved! You can now view it on the profile page.");
        }).catch((error) => {
            alert(error.message);
        })
        return;
    }

    const changeStatus = (data, index) => {
        if (playing[data] === "play") {
            setPlaying(playing => { return { ...playing, [data]: "pause" } })
            playAudio()
        } else {
            setPlaying(playing => { return { ...playing, [data]: "play" } })
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-white relative">
            <ScrollView className="px-4 py-4">
                <View className="flex-1">
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
                    {isLoading ? <View className="flex-1 relative items-center justify-center top-20" >
                        <ActivityIndicator size="large" color="#0B646B" />
                    </View>
                        :
                        <View>
                            <View className="flex-row items-center justify-between mt-4 px-2">
                                {/* <Text className="text-[#2C7379] text-[28px] font-bold" > Your Tour is Ready 🤖 </Text> */}
                                <Text className="text-[#2C7379] text-[24px] font-bold" >{title}</Text>
                                <TouchableOpacity onPress={() => { alert(guidance) }} className="flex-row items-center justify-center px-4">
                                    <Feather name="map" size={24} color="black" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row items-center mt-4 px-2">
                                <Text className="text-[#8C9EA6] text-[16px] font-bold">{tourDescription}</Text>
                            </View>

                            {unique.map((data, index) => {
                                return (
                                    <View>
                                        <View key={index} className="items-center flex-row space-x-6">
                                            <Text className="mt-4 px-2 text-[#428288] text-[24px] font-bold">
                                                Stop {index + 1}: {data}
                                            </Text>
                                        </View>
                                        <View className=" mt-2 space-y-2 bg-gray-100 rounded-2xl px-4 py-4">
                                            <View className="items-center flex-row space-x-6">
                                                <TouchableOpacity onPress={() => changeStatus(data, index)} className="flex-row items-center justify-center">
                                                    <Feather name={playing[data]} size={24} color="black" />
                                                </TouchableOpacity>
                                                {/* <TouchableOpacity className="flex-row items-center justify-center">
                                                    <Feather name="pause" size={24} color="black" />
                                                </TouchableOpacity> */}
                                            </View>
                                        </View>
                                    </View>
                                )
                            })}

                            <View className="inset-x-0  flex-row items-center justify-center shadow-lg py-6 bottom-5">
                                <TouchableOpacity onPress={saveTour} className="flex-row items-center justify-center bg-[#06B2BE] rounded-md px-4 py-2 mt-4" >
                                    <Text className="text-white text-[18px] font-bold" >Save This Walking Tour</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }

                </View>
                {/* <View style={styles.container}>
                    <Text className="text-[16px] text-center pt-4"> These are the place you chose to visit: </Text>
                    <Text className="text-[16px] text-center pt-4"> {unique.map((step, index) => <Text key={index}>{step}{"\n"}</Text>)} </Text>
                    <Button className="text-[18px] text-center px-2" title="Submit" onPress={() => handleSend(unique)} />
                    <View>
                        <TouchableOpacity style={styles.play} onPress={playAudio}>
                            <Text> Play the audio</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
        marginTop: 50,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
        marginBottom: 30,
    },
    play: {
        width: 250,
        padding: 30,
        gap: 10,
        marginTop: 10,
        marginBottom: 10,
        borderWidth: 3,
        alignItems: "center",
        borderRadius: 10,
        boderColor: "lightgray",
    }
});

export default TourScreen;