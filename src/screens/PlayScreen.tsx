import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const bonhomme1 = require('../../images/bonhomme1.png');
const redDot = require('../../images/red-dot.png'); // Image du point rouge

const PlayScreen: React.FC<{ route: { params: { partyId: string } } }> = ({ route }) => {
  const { partyId } = route.params;
  const [positions, setPositions] = useState<
    { email: string; positions: { x: number; y: number; repereX: number; repereY: number }[] }[]
  >([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [highlightedPosition, setHighlightedPosition] = useState<{ x: number; y: number } | null>(null);

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

  const handleImagePress = (position: { x: number; y: number }) => {
    // Mettre à jour l'état pour afficher le point rouge sur l'image touchée
    setHighlightedPosition(position);
    console.log('Image touched!');
  };

  return (
    <View style={styles.container}>
      {positions.map(({ email, positions: playerPositions }, index) => (
        email !== currentUserEmail && (
          <React.Fragment key={index}>
            {playerPositions.map((position, posIndex) => (
              <TouchableOpacity
                key={posIndex}
                onPress={() => handleImagePress(position)} // Appel de la fonction handleImagePress avec la position
                style={[
                  styles.box,
                  {
                    left: position.x - 50,
                    top: position.y - 50,
                  },
                ]}>
                <Image source={bonhomme1} style={styles.image} />
                {highlightedPosition && highlightedPosition.x === position.x && highlightedPosition.y === position.y && (
                  <Image source={redDot} style={styles.redDot} /> // Affichage conditionnel du point rouge
                )}
              </TouchableOpacity>
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
  redDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    top: '50%', // Centré verticalement sur l'image
    left: '50%', // Centré horizontalement sur l'image
    transform: [{ translateX: -5 }, { translateY: -5 }], // Centrage du point rouge
  },
});

export default PlayScreen;
