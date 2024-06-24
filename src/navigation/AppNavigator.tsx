import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SessionScreen from '../screens/SessionScreen';


export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Session: undefined;
  SelectSession: undefined;
  Lobby: undefined;
  LobbyScreen: { partyId: string };
  SalleAttente: undefined;
  Game: { partyId: string };
  Rank: undefined;
};


const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Session" component={SessionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
