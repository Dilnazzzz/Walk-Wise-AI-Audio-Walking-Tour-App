import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';


export default function ProfileScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Profile Screen</Text>
            <Button onPress={() => FIREBASE_AUTH.signOut()} title = "Logout" />
        </View>
    );
}