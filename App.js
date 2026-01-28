import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import { TailwindProvider } from 'tailwindcss-react-native';

import { FIREBASE_AUTH } from './FirebaseConfig';
import Discover from './screens/Discover';
import EditProfile from './screens/EditProfile';
import HomeScreen from './screens/HomeScreen';
import ItemScreen from './screens/ItemScreen';
import MainContainer from './screens/MainContainer';
import Map from './screens/Map';
import Profile from './screens/Profile';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import SignUpScreen from './screens/SignUpScreen';
import TourScreen from './screens/TourScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(FIREBASE_AUTH, (nextUser) => {
      setUser(nextUser);
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  // useEffect(() => {
  //   onAuthStateChanged(FIREBASE_AUTH, (user) => {
  //     if (user) {
  //       // console.log('user', user);
  //       setUser(user);
  //     }
  //   });
  // }, [])

  if (initializing) {
    return (
      <TailwindProvider>
        <SafeAreaView className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#00BCC9" />
        </SafeAreaView>
      </TailwindProvider>
    );
  }

  return (
    <TailwindProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              <Stack.Screen name="MainContainer" component={MainContainer} />
              <Stack.Screen name="Discover" component={Discover} />
              <Stack.Screen name="Map" component={Map} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="ItemScreen" component={ItemScreen} />
              <Stack.Screen name="EditProfile" component={EditProfile} />
              <Stack.Screen name="TourScreen" component={TourScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="HomeScreen" component={HomeScreen} />
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
              <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </TailwindProvider>
  );
}
