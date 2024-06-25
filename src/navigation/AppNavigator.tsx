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
import PlayScreen from '../screens/PlayScreen';
import RankScreen from '../screens/RankScreen';
import LocalScreen from '../screens/LocalScreen';


export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Session: undefined;
  SelectSession: undefined;
  Lobby: undefined;
  LobbyScreen: { partyId: string };
  LocalScreen: { partyId: string };
  SalleAttente: undefined;
  Game: { partyId: string };
  Rank: undefined;
  Play: undefined;
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
        <Stack.Screen name="Play" component={PlayScreen} />
        <Stack.Screen name="Rank" component={RankScreen} />
        <Stack.Screen name="LocalScreen" component={LocalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
