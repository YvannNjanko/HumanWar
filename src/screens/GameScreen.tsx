import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Graph from './Graph';
import DraggableImages from './Positions';

type RootStackParamList = {
  Game: { partyId: string };
  Session: undefined;
};

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

type GameScreenProps = {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
};

const GameScreen: React.FC<GameScreenProps> = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [mysteryNumber, setMysteryNumber] = useState('');
  const [eliminateNumber, setEliminateNumber] = useState('');
  const [step, setStep] = useState(1);
  const { partyId } = route.params;

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const playerString = await AsyncStorage.getItem('Player');
        if (playerString !== null) {
          const player = JSON.parse(playerString);
          setEmail(player.email);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmail();
  }, []);


  return (
    <DraggableImages/>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
  },
});

export default GameScreen;
