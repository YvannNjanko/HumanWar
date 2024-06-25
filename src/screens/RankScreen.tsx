import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

type ScoreData = {
  partyId: string;
  scores: { [key: string]: number };
};

const RankScreen: React.FC = () => {
  const [sessions, setSessions] = useState<ScoreData[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const sessionSnapshot = await firestore().collection('Ranks').get();
        const sessionData: ScoreData[] = sessionSnapshot.docs.map(doc => ({
          partyId: doc.id,
          scores: doc.data().scores || {},
        }));
        setSessions(sessionData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSessions();
  }, []);

  const renderItem = ({ item }: { item: [string, number] }) => (
    <View style={styles.item}>
      <Text style={styles.email}>{item[0].replace(/,/g, '.')}</Text>
      <Text style={styles.score}>{item[1]}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Classement des joueurs</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.partyId}
        renderItem={({ item }) => (
          <View style={styles.sessionContainer}>
            <Text style={styles.sessionTitle}>Session: {item.partyId}</Text>
            <FlatList
              data={Object.entries(item.scores).sort((a, b) => b[1] - a[1])}
              renderItem={renderItem}
              keyExtractor={(subItem) => subItem[0]}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sessionContainer: {
    marginBottom: 20,
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  email: {
    fontSize: 18,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RankScreen;
