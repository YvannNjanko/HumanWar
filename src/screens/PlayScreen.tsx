import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const bonhomme1 = require('../../images/bonhomme1.png');

const PlayScreen: React.FC<{ route: { params: { partyId: string } } }> = ({ route }) => {
  const { partyId } = route.params;
  const [positions, setPositions] = useState<
    { email: string; positions: { x: number; y: number; repereX: number; repereY: number }[] }[]
  >([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');

  useEffect(() => {
    const fetchCurrentUserEmail = async () => {
      try {
        const playerString = await AsyncStorage.getItem('Player');
        if (playerString !== null) {
          const { email } = JSON.parse(playerString);
          setCurrentUserEmail(email.replace('.', ','));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentUserEmail();
  }, []);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const docRef = firestore().collection('Position').doc(partyId);
        const doc = await docRef.get();
        if (doc.exists) {
          const data = doc.data();
          const positionsData = Object.entries(data || {}).map(([email, positions]) => ({
            email,
            positions,
          }));
          setPositions(positionsData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPositions();
  }, [partyId]);

  return (
    <View style={styles.container}>
      {positions.map(({ email, positions: playerPositions }, index) => (
        email !== currentUserEmail && (
          <React.Fragment key={index}>
            {playerPositions.map((position, posIndex) => (
              <View
                key={posIndex}
                style={[
                  styles.box,
                  {
                    left: position.x - 50,
                    top: position.y - 50,
                  },
                ]}>
                <Image source={bonhomme1} style={styles.image} />
              </View>
            ))}
          </React.Fragment>
        )
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  box: {
    width: 100,
    height: 100,
    position: 'absolute',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default PlayScreen;
