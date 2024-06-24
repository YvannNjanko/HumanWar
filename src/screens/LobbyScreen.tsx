import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { Party } from '../models/Party';

type RootStackParamList = {
  Lobby: {partyId: string};
  Game: {partyId: string};
};

type LobbyScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Lobby'
>;
type LobbyScreenRouteProp = RouteProp<RootStackParamList, 'Lobby'>;

type Props = {
  navigation: LobbyScreenNavigationProp;
  route: LobbyScreenRouteProp;
};

const LobbyScreen: React.FC<Props> = ({navigation, route}) => {
  const {partyId} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.partyIdText}>Party ID: {partyId}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          const partie = new Party()
          partie.setPartyToTrues(partyId)
          navigation.navigate('Game', {partyId});
        }}>
        <Text style={styles.buttonText}>Lancer la partie</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partyIdText: {
    fontSize: 18,
    marginBottom: 20,
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

export default LobbyScreen;
