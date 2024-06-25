import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Rank } from '../models/Rank';

const { width, height } = Dimensions.get('window');
const bonhomme1 = require('../../images/bonhomme1.png');

const PlayLocalScreen: React.FC<{ route: { params: { partyId: string } } }> = ({ route }) => {
  const { partyId } = route.params;
  const [positions, setPositions] = useState<
    { email: string; positions: { x: number; y: number; repereX: number; repereY: number }[] }[]
  >([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [visiblePositions, setVisiblePositions] = useState<{ x: number; y: number }[]>([]);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>('');
  const [currentRound, setCurrentRound] = useState<number>(1); // Round actuel (1 pour joueur, 2 pour système)
  const navigation = useNavigation();
  const rank = new Rank(partyId);

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

  useEffect(() => {
    const checkGameStatus = async () => {
      try {
        const isGameFinished = await rank.getGameStatus();
        const gameWinner = await rank.getGameWinner();
        setGameFinished(isGameFinished);
        setWinner(gameWinner);
        if (isGameFinished) {
          if (gameWinner !== currentUserEmail) {
            Alert.alert('You lose!');
          }
          setTimeout(() => {
            navigation.navigate('Session');
          }, 2000);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const interval = setInterval(checkGameStatus, 2000);
    return () => clearInterval(interval);
  }, [rank, navigation, currentUserEmail]);

  const handleImagePress = async (position: { x: number; y: number }) => {
    try {
      // Vérifier si le joueur a touché une image de l'adversaire
      const isOpponentImage = positions.some(
        (player) => player.email !== currentUserEmail && player.positions.some(
          (pos) => pos.x === position.x && pos.y === position.y
        )
      );

      if (isOpponentImage) {
        // Si oui, signaler et passer au tour du système
        setVisiblePositions((prevPositions) => [...prevPositions, position]);
        Alert.alert('You hit opponent!');
      } else {
        Alert.alert('You missed!');
      }
      setCurrentRound(2); // Tour du système
      setTimeout(handleSystemTurn, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSystemTurn = async () => {
    try {
      // Générer des coordonnées aléatoires pour le système
      const randomX = Math.floor(Math.random() * width);
      const randomY = Math.floor(Math.random() * height);

      // Vérifier si le système touche une image du joueur
      const isPlayerImage = positions.some(
        (player) => player.email === currentUserEmail && player.positions.some(
          (pos) => pos.x === randomX && pos.y === randomY
        )
      );

      if (isPlayerImage) {
        // Si oui, signaler et passer au tour du joueur
        Alert.alert('System hit you!');
      } else {
        Alert.alert('System missed!');
      }

      // Mettre à jour les positions visibles pour afficher les interactions
      setVisiblePositions((prevPositions) => [...prevPositions, { x: randomX, y: randomY }]);
      setCurrentRound(1); // Tour du joueur
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {positions.map(({ email, positions: playerPositions }, index) => (
        email !== currentUserEmail && (
          <React.Fragment key={index}>
            {playerPositions.map((position, posIndex) => {
              const isVisible = visiblePositions.some(
                (visiblePos) => visiblePos.x === position.x && visiblePos.y === position.y
              );
              return (
                <TouchableOpacity
                  key={posIndex}
                  onPress={() => handleImagePress(position)}
                  style={[
                    styles.box,
                    {
                      left: position.x - 50,
                      top: position.y - 50,
                      opacity: isVisible ? 1 : 0,
                    },
                  ]}>
                  <Image source={bonhomme1} style={styles.image} />
                </TouchableOpacity>
              );
            })}
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

export default PlayLocalScreen;
