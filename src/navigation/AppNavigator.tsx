import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SessionScreen from '../screens/SessionScreen';
import LobbyScreen from '../screens/LobbyScreen';
import ListeAttente from '../screens/ListeAttente';
import JoinSessionScreen from '../screens/JoinSessionScreen';
import GameScreen from '../screens/GameScreen';


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
        <Stack.Screen name="LobbyScreen" component={LobbyScreen} />
        <Stack.Screen name="SalleAttente" component={ListeAttente} />
        <Stack.Screen name="SelectSession" component={JoinSessionScreen} />
        <Stack.Screen name="Game" component={GameScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
