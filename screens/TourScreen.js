import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

const TourScreen = ({ route }) => {
    const navigation = useNavigation();
    const data = route?.params?.param;
    console.log(route);
    console.log(data);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);

    const unique = [...new Set(data)];
    console.log(unique)

    const handleSubmit = async () => {
        if (unique.length = 0) return;
        try {
            // fetch the audio blob from the server
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>This is what AI has generated 🤖</Text>
            <Text className="text-[20px] text-center text-[#0B646B] font-bold px-2" >Press the play button to listen to your audio walking tour</Text>
            <Text className="text-[16px] text-center pt-4"> These are the place you chose to visit: </Text>
            <Text className="text-[16px] text-center pt-4"> {unique.map((step) => <Text>{step}{"\n"}</Text>)} </Text>
            <TouchableOpacity style={styles.play}>
                <Text> Play the audio</Text>

            </TouchableOpacity>
            <Button className="text-[18px] text-center px-2" title="Play the audio again" onPress={() => { }} />
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