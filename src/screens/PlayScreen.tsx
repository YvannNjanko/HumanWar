import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Rank } from '../models/Rank';

const { width, height } = Dimensions.get('window');
const bonhomme1 = require('../../images/bonhomme1.png');

const PlayScreen: React.FC<{ route: { params: { partyId: string } } }> = ({ route }) => {
  const { partyId } = route.params;
  const [positions, setPositions] = useState<
    { email: string; positions: { x: number; y: number; repereX: number; repereY: number }[] }[]
  >([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [visiblePositions, setVisiblePositions] = useState<{ x: number; y: number }[]>([]);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>('');
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
      setVisiblePositions((prevPositions) => [...prevPositions, position]);

      const currentScore = await rank.getPlayerScores();
      const newScore = (currentScore[currentUserEmail] || 0) + 1;
      await rank.updatePlayerScore(currentUserEmail, newScore);

      if (newScore >= 5) {
        await rank.updateGameStatus(true, currentUserEmail);
        Alert.alert('You win!');
        setTimeout(() => {
          navigation.navigate('Session');
        }, 2000);
      }
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

export default PlayScreen;
