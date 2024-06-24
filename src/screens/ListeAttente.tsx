import React, {useEffect, useState} from 'react';
import {View, Button, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {Party} from '../models/Party';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

type RootStackParamList = {
  ListeAttente: {partyId: string}; // Mettre à jour pour recevoir le partyId
};

type ListeAttenteScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ListeAttente'
>;
type ListeAttenteScreenRouteProp = RouteProp<
  RootStackParamList,
  'ListeAttente'
>;

type Props = {
  navigation: ListeAttenteScreenNavigationProp;
  route: ListeAttenteScreenRouteProp;
};

const ListeAttente: React.FC<Props> = ({navigation, route}) => {
  const [playersInGame, setPlayersInGame] = useState<string[]>([]);
  const [partyStatus, setSatus] = useState<Boolean>(false);
  
  useEffect(() => {
    const PartyRef = firestore().collection('Parties');
    const redirection = async () => {
      const partyId = route.params.partyId;
      PartyRef.where('partyId', '==', partyId).onSnapshot(doc => {
        if (!doc.empty) {
          console.log("rien")
          if (doc.docs[0].data().partyStatus) {
            console.log('yesss navigation');
            navigation.navigate('Game', { partyId: partyId })
          } else {
            console.log('nobooo navigation');
            // navigation.navigate('ListeAttente', { partyId: partyId })
          }
        }
      });
    };
    redirection();
  }, []);
  useEffect(() => {
    const fetchPlayersInGame = async () => {
      const partyId = route.params.partyId; // Récupérer le partyId depuis les paramètres de route
      const players = await new Party().getPlayersInParty(partyId); // Utiliser le partyId pour récupérer les joueurs
      setPlayersInGame(players);
    };
    fetchPlayersInGame();
  }, [route.params.partyId]); // S'abonner aux changements du partyId

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste d'attente</Text>
      <View style={styles.playersContainer}>
        {playersInGame.map((player, index) => (
          <Text key={index} style={styles.player}>
            {player}
          </Text>
        ))}
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  playersContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  player: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ListeAttente;
