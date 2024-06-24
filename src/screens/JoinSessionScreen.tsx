import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Party } from '../models/Party';
import { Player } from '../models/Player';

type RootStackParamList = {
  JoinSession: undefined;
  SalleAttente: { partyId: string }; // Mettre à jour pour passer le partyId
};

type JoinSessionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'JoinSession'>;
type JoinSessionScreenRouteProp = RouteProp<RootStackParamList, 'JoinSession'>;

type Props = {
  navigation: JoinSessionScreenNavigationProp;
  route: JoinSessionScreenRouteProp;
};

type Session = {
  partyId: string;
  partyCreatorEmail: string;
};

const JoinSessionScreen: React.FC<Props> = ({ navigation }) => {
  const [parties, setParties] = useState<Session[]>([]);

  useEffect(() => {
    const fetchParties = async () => {
      const fetchedParties = await new Party().getParties();
      const formattedParties = fetchedParties.map((party: any) => ({
        partyId: party.partyId,
        partyCreatorEmail: party.partyCreatorEmail,
      }));
      setParties(formattedParties);
    };
    fetchParties();
  }, []);

  const renderItem = ({ item }: { item: Session }) => (
    <TouchableOpacity onPress={async() => {
      const party = new Party();
      const player = await new Player().getPlayerEmail();
      await party.addPlayer(player.email, item.partyId);
      navigation.navigate('SalleAttente', { partyId: item.partyId }); // Passer le partyId lors de la navigation
    }}>
      <View style={styles.item}>
        <Text style={styles.itemText}>{`ID: ${item.partyId}, Creator: ${item.partyCreatorEmail}`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rejoindre une Partie</Text>
      <FlatList
        data={parties}
        renderItem={renderItem}
        keyExtractor={(item) => item.partyId}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
});

export default JoinSessionScreen;
