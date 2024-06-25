import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
  Button,
  Alert,
} from 'react-native';
import Svg, { Line, Text as SvgText } from 'react-native-svg';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Player } from '../models/Player';

const PositionRef = firestore().collection('Position');
const { width, height } = Dimensions.get('window');
const bonhomme1 = require('../../images/bonhomme1.png');

type RootStackParamList = {
  Game: { partyId: string };
  Session: undefined;
  Play: { partyId: string };
};

type LocalScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;
type LocalScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

type LocalScreenProps = {
  navigation: LocalScreenNavigationProp;
  route: LocalScreenRouteProp;
};

const LocalScreen: React.FC<LocalScreenProps> = ({ route, navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [positions, setPositions] = useState<
    { x: number; y: number; repereX: number; repereY: number }[]
  >([]);
  const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
  const [checkingPositions, setCheckingPositions] = useState<boolean>(true);
  const [systemEmail, setSystemEmail] = useState<string>('');
  const [systemPositions, setSystemPositions] = useState<
    { x: number; y: number; repereX: number; repereY: number }[]
  >([]);
  const { partyId } = route.params;

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const playerString = await AsyncStorage.getItem('Player');
        if (playerString !== null) {
          const player = JSON.parse(playerString) as Player;
          setEmail(player.email.replace('.', ','));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmail();
  }, []);

  const checkPositions = useCallback(async () => {
    try {
      const docRef = PositionRef.doc(partyId);
      const doc = await docRef.get();

      if (doc.exists) {
        const data = doc.data();
        const playerEmails = Object.keys(data || {});
        if (playerEmails.length === 2) {
          setConfirmationVisible(true);
          setTimeout(() => {
            setConfirmationVisible(false);
            navigation.navigate('PlayLocalScreen', { partyId });
          }, 8000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [partyId, navigation]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (checkingPositions) {
        checkPositions();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [checkPositions, checkingPositions]);

  useEffect(() => {
    const generateSystemEmail = () => {
      const randomEmail = `system_${Math.random().toString(36).substring(7)}@example.com`.replace('.', ',');
      setSystemEmail(randomEmail);
    };

    generateSystemEmail();
  }, []);

  useEffect(() => {
    const generateSystemPositions = () => {
      const generatedPositions = [];
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const repereX = (x - width / 2) / (width / 20);
        const repereY = (height / 2 - y) / (height / 20);
        generatedPositions.push({ x, y, repereX, repereY });
      }
      setSystemPositions(generatedPositions);
    };

    if (systemEmail) {
      generateSystemPositions();
    }
  }, [systemEmail]);

  useEffect(() => {
    const addSystemPositions = async () => {
      if (systemPositions.length === 5) {
        try {
          const docRef = PositionRef.doc(partyId);
          const doc = await docRef.get();

          if (doc.exists) {
            const data = doc.data();
            const updatedData = {
              ...data,
              [systemEmail]: systemPositions,
            };
            await docRef.update(updatedData);
          } else {
            await docRef.set({
              [systemEmail]: systemPositions,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    addSystemPositions();
  }, [systemPositions, systemEmail, partyId]);

  const xMid = width / 2;
  const yMid = height / 2;
  const xScale = width / 20;
  const yScale = height / 20;

  const handlePress = (event: any) => {
    if (positions.length < 5) {
      const { locationX, locationY } = event.nativeEvent;
      const x = (locationX - xMid) / xScale;
      const y = (yMid - locationY) / yScale;

      setPositions((prevPositions) => [
        ...prevPositions,
        { x: locationX, y: locationY, repereX: x, repereY: y },
      ]);
    }
  };

  const addPosition = async () => {
    try {
      const docRef = PositionRef.doc(partyId);
      const doc = await docRef.get();

      if (doc.exists) {
        const data = doc.data();
        const updatedData = {
          ...data,
          [email]: positions,
        };
        await docRef.update(updatedData);
      } else {
        await docRef.set({
          [email]: positions,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderXAxisGraduations = () => {
    const lines = [];
    for (let i = -10; i <= 10; i++) {
      const xPos = xMid + i * xScale;
      lines.push(
        <Line
          key={`x-line-${i}`}
          x1={xPos}
          y1={yMid - 5}
          x2={xPos}
          y2={yMid + 5}
          stroke="black"
          strokeWidth={1}
        />
      );
      if (i !== 0) {
        lines.push(
          <SvgText
            key={`x-text-${i}`}
            x={xPos}
            y={yMid + 15}
            fontSize={10}
            fill="black"
            textAnchor="middle">
            {i}
          </SvgText>
        );
      }
    }
    return lines;
  };

  const renderYAxisGraduations = () => {
    const lines = [];
    for (let i = -10; i <= 10; i++) {
      const yPos = yMid - i * yScale;
      lines.push(
        <Line
          key={`y-line-${i}`}
          x1={xMid - 5}
          y1={yPos}
          x2={xMid + 5}
          y2={yPos}
          stroke="black"
          strokeWidth={1}
        />
      );
      if (i !== 0) {
        lines.push(
          <SvgText
            key={`y-text-${i}`}
            x={xMid + 15}
            y={yPos + 3}
            fontSize={10}
            fill="black"
            textAnchor="middle">
            {i}
          </SvgText>
        );
      }
    }
    return lines;
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
          <Line
            x1={0}
            y1={yMid}
            x2={width}
            y2={yMid}
            stroke="black"
            strokeWidth={2}
          />
          <Line
            x1={xMid}
            y1={0}
            x2={xMid}
            y2={height}
            stroke="black"
            strokeWidth={2}
          />
          {renderXAxisGraduations()}
          {renderYAxisGraduations()}
        </Svg>
        {positions.map((position, index) => (
          <View
            key={index}
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
        {systemPositions.map((position, index) => (
          <View key={`system-${index}`} style={[
            styles.box,
            {
              left: position.x - 50,
              top: position.y - 50,
              opacity: 0, // Masquer les images du système
            },
          ]}>
            <Image source={bonhomme1} style={styles.image} />
          </View>
        ))}
        <View style={styles.positionTextContainer}>
          {positions.map((position, index) => (
            <Text key={index} style={styles.positionText}>
              Image {index + 1} Position: ({position.repereX.toFixed(2)},{' '}
              {position.repereY.toFixed(2)})
            </Text>
          ))}
          {systemPositions.map((position, index) => (
            <Text key={`system-${index}`} style={styles.positionText}>
              Système {index + 1} Position: ({position.repereX.toFixed(2)},{' '}
              {position.repereY.toFixed(2)})
            </Text>
          ))}
        </View>
        {positions.length === 5 && (
          <View style={styles.buttonContainer}>
            <Button
              title="Valider"
              onPress={addPosition}
            />
          </View>
        )}
        {confirmationVisible && (
          <View style={styles.confirmationContainer}>
                        <Text style={styles.confirmationText}>Positions enregistrées!
               Redirection vers le jeu...</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  positionTextContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  positionText: {
    fontSize: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: width / 2 - 50,
  },
  confirmationContainer: {
    position: 'absolute',
    top: height / 2 - 50,
    left: width / 2 - 100,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
  },
  confirmationText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default LocalScreen;
