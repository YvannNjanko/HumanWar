// SessionScreen.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Party } from '../models/Party';

type RootStackParamList = {
  Session: undefined;
  LobbyScreen: { partyId: string };
  SelectSession: undefined;
  Login: undefined;
  Rank: { partyId: string };
};

type SessionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Session'>;
type SessionScreenRouteProp = RouteProp<RootStackParamList, 'Session'>;

type Props = {
  navigation: SessionScreenNavigationProp;
  route: SessionScreenRouteProp;
};

const SessionScreen: React.FC<Props> = ({ navigation }) => {
  const addParty = async (): Promise<string | undefined> => {
    try {
      const playerString = await AsyncStorage.getItem('Player');
      if (playerString !== null) {
        const player = JSON.parse(playerString);
        const email = player.email;

        const party = new Party([email], email, false);
        const createdParty = await party.addParty();
        if (createdParty && createdParty.id) {
          return createdParty.id;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/choix.png')}
        style={styles.image}
      />

      <TouchableOpacity style={styles.button} onPress={async () => {
        const id = await addParty();
        if (id) {
          navigation.navigate('LobbyScreen', { partyId: id });
        }
      }}>
        <Text style={styles.buttonText}>Créer une Partie</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SelectSession')}>
        <Text style={styles.buttonText}>Rejoindre une Partie</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={async () => {
        await AsyncStorage.removeItem('Player');
        navigation.navigate('Login');
      }}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 450,
    height: 350,
    marginTop: -150,
    marginBottom: 0,
  },
  button: {
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SessionScreen;
