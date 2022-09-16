import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Homepage from './components/homepage';
import Search from './components/search';
import Watchlist from './components/watchlist';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
    headerShown: false
  }}>
        <Stack.Screen name="Homepage" component={Homepage} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Watchlist" component={Watchlist} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

"this brown fox jumps over the (wall)"