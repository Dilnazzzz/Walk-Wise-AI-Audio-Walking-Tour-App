import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Pressable } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { writeAudioToFile } from '../components/writeAudioToFile';
import { playFromPath } from '../components/playFromPath';
import * as Speech from 'expo-speech';

// Audio.setAudioModeAsync({
//     allowsRecordingIOS: false,
//     staysActiveInBackground: false,
//     playsInSilentModeIOS: true,
//     shouldDuckAndroid: true,
//     playThroughEarpieceAndroid: false,
// });

const TourScreen = ({ route }) => {
    const navigation = useNavigation();
    const data = route?.params?.param;
    // console.log(route);
    // console.log(data);
    const API_KEY = "sk-KEY";
    const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
        "role": "system", "content": "Create a walking tour of the places you want to visit."
    }
    const [lastMessage, setLastMessage] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);

    const unique = [...new Set(data)];
    // console.log(unique)

    const requestText = unique.toString()
    // console.log(requestText)

    const [messages, setMessages] = useState([
        {
            message: "Hello, I'm ChatGPT! Ask me anything!",
            sentTime: "just now",
            sender: "ChatGPT"
        }
    ]);

    const handleSend = async (unique) => {
        let message = unique.toString();
        // console.log(message);
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user"
        };
        const newMessages = [...messages, newMessage];

        setMessages(newMessages);
        // console.log(messages);

        // Initial system message to determine ChatGPT functionality
        // How it responds, how it talks, etc.
        await processMessageToChatGPT(newMessages);
    };
    // const [urlPath, setUrlPath] = useState("");
    // const listFiles = async () => {
    //     try {
    //         const result = await FileSystem.readAsStringAsync(FileSystem.documentDirectory);
    //         if (result.length > 0) {
    //             const filename = result[0];
    //             const path = FileSystem.documentDirectory + filename;
    //             setUrlPath(path);
    //         }
    //     }
    //     catch (error) {
    //         console.log(error);
    //     }
    // }

    // const handleSubmit = async () => {
    //     if (unique.length = 0) return;
    //     try {
    //         // fetch the audio blob from the server
    //         const audioBlob = await fetchAudio(unique);
    //         const reader = new FileReader()
    //         reader.onload = async (e) => {
    //             if (e.target && typeof e.target.result === 'string') {
    //                 // create a temporary file that we can play
    //                 const audioData = e.target.result.split(",")[1];
    //                 const path = await writeAudioToFile(audioData);
    //                 // play the audio
    //                 setUrlPath(path);
    //                 await playFromPath(path);
    //                 destroyRecognizing()
    //             }
    //         };
    //         reader.readAsDataURL(audioBlob);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

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

        // Get the request body set up with the model we plan to use
        // and the messages which we formatted above. We add a system message in the front to'
        // determine how we want chatGPT to act. 
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
                console.log(data);
                setMessages([...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT"
                }]);
                setLastMessage(data.choices[0].message.content);
                console.log(data.choices[0].message.content);
            });
        alert("Now play the audio!")
    }

    const playAudio = () => {
        const options = {
            voice: "com.apple.ttsbundle.siri_Nicky_en-US_compact"
        }
        const greeting = "Hello, I'm ChatGPT! Ask me anything!";
        Speech.speak(lastMessage, options);
        console.log(lastMessage);
        // Speech.speak(greeting, options);
    }

    const listAllVoiceOptions = async () => {
        let voices = await Speech.getAvailableVoicesAsync();
        console.log(voices);
    }

    // useEffect( () => {listAllVoiceOptions()}); 

    return (
        <View style={styles.container}>
            <Text style={styles.title}>This is what AI has generated 🤖</Text>
            <Text className="text-[20px] text-center text-[#0B646B] font-bold px-2" >Press the play button to listen to your audio walking tour</Text>
            <Text className="text-[16px] text-center pt-4"> These are the place you chose to visit: </Text>
            <Text className="text-[16px] text-center pt-4"> {unique.map((step, index) => <Text key={index}>{step}{"\n"}</Text>)} </Text>
            {/* <Button className="text-[18px] text-center px-2" title="Submit" onPress={() => { handleSubmit() }} /> */}
            <Button className="text-[18px] text-center px-2" title="Submit" onPress={() => handleSend(unique)} />

            <TouchableOpacity style={styles.play} onPress={playAudio}>
                <Text> Play the audio</Text>

            </TouchableOpacity>
            {/* <Button className="text-[18px] text-center px-2" title="Play the audio again" onPress={async () => { await playFromPath(urlPath); }} /> */}
            <Button className="text-[18px] text-center px-2" title="Play the audio again" />
        </View>
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
        width: "90%",
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