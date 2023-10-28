import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View } from 'react-native';
import { TailwindProvider } from 'tailwindcss-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { User, onAuthStateChanged } from 'firebase/auth';

import HomeScreen from './screens/HomeScreen';
import Discover from './screens/Discover';
import ItemScreen from './screens/ItemScreen';
import Profile from './screens/Profile';
import Map from './screens/Map';
import MainContainer from './screens/MainContainer';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      // console.log('user', user);
      setUser(user);
    });
  }, [])

  return (
    <TailwindProvider>
      {/* <HomeScreen/> */}
      <NavigationContainer>
        <Stack.Navigator>
          {user ? (<><Stack.Screen name="MainContainer" component={MainContainer} />
            {/* // <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}
            {/* <Stack.Screen name="MainContainer" component={MainContainer} /> */}
            <Stack.Screen name="Discover" component={Discover} />
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ItemScreen" component={ItemScreen} />
            </>)
            :
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
          }
          

        </Stack.Navigator>
      </NavigationContainer>
    </TailwindProvider>

  );
}

