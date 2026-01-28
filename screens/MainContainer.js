import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useLayoutEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Discover from './Discover';
import Map from './Map';
import Profile from './Profile';

const discoverName = 'Discover';
const mapName = 'Map';
const profileName = 'Profile';

const Tab = createBottomTabNavigator();

function MainContainer() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Tab.Navigator
      initialRouteName={discoverName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          const rn = route.name;
          if (rn === discoverName) {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (rn === mapName) {
            iconName = focused ? 'map' : 'map-outline';
          } else if (rn === profileName) {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0B646B',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: { fontSize: 10 },
        tabBarStyle: { padding: 10, height: 80 },
      })}
    >
      <Tab.Screen name={discoverName} component={Discover} />
      <Tab.Screen name={mapName} component={Map} />
      <Tab.Screen name={profileName} component={Profile} />
    </Tab.Navigator>
  );
}

export default MainContainer;
