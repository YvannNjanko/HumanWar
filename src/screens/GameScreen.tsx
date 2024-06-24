import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
  Button,
} from 'react-native';
import Svg, {Line, Text as SvgText} from 'react-native-svg';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {Player} from '../models/Player';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PositionRef = firestore().collection('Position');
const {width, height} = Dimensions.get('window');
const bonhomme1 = require('../../images/bonhomme1.png');

type RootStackParamList = {
  Game: { partyId: string };
  Session: undefined;
};

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

type GameScreenProps = {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
};

const GameScreen: React.FC<GameScreenProps> = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [mysteryNumber, setMysteryNumber] = useState('');
  const [eliminateNumber, setEliminateNumber] = useState('');
  const [step, setStep] = useState(1);
  const { partyId } = route.params;

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const playerString = await AsyncStorage.getItem('Player');
        if (playerString !== null) {
          const player = JSON.parse(playerString);
          setEmail(player.email);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmail();
  }, []);
  
  
  const xMid = width / 2;
  const yMid = height / 2;
  const xScale = width / 20; // Chaque unité sur l'axe des x
  const yScale = height / 20; // Chaque unité sur l'axe des y

  const [positions, setPositions] = useState<
    {x: number; y: number; repereX: number; repereY: number}[]
  >([]);

  const handlePress = (event: any) => {
    if (positions.length < 5) {
      const {locationX, locationY} = event.nativeEvent;
      const x = (locationX - xMid) / xScale;
      const y = (yMid - locationY) / yScale;

      setPositions(prevPositions => [
        ...prevPositions,
        {x: locationX, y: locationY, repereX: x, repereY: y},
      ]);
    }
  };

  const handleButtonPress = () => {
    console.log('Button Pressed');
    // Add your desired functionality here
  };

  // Fonction pour rendre les graduations sur l'axe des x
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
          strokeWidth="1"
        />,
      );
      if (i !== 0) {
        // Skip the origin
        lines.push(
          <SvgText
            key={`x-text-${i}`}
            x={xPos}
            y={yMid + 15}
            fontSize="10"
            fill="black"
            textAnchor="middle">
            {i}
          </SvgText>,
        );
      }
    }
    return lines;
  };

  // Fonction pour rendre les graduations sur l'axe des y
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
          strokeWidth="1"
        />,
      );
      if (i !== 0) {
        // Skip the origin
        lines.push(
          <SvgText
            key={`y-text-${i}`}
            x={xMid + 15}
            y={yPos + 3}
            fontSize="10"
            fill="black"
            textAnchor="middle">
            {i}
          </SvgText>,
        );
      }
    }
    return lines;
  };



  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
          {/* Axe des abscisses */}
          <Line
            x1="0"
            y1={yMid}
            x2={width}
            y2={yMid}
            stroke="black"
            strokeWidth="2"
          />
          {/* Axe des ordonnées */}
          <Line
            x1={xMid}
            y1="0"
            x2={xMid}
            y2={height}
            stroke="black"
            strokeWidth="2"
          />
          {/* Ajouter les graduations sur les axes */}
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
        <View style={styles.positionTextContainer}>
          {positions.map((position, index) => (
            <Text key={index} style={styles.positionText}>
              Image {index + 1} Position: ({position.repereX.toFixed(2)},{' '}
              {position.repereY.toFixed(2)})
            </Text>
          ))}
        </View>
        {positions.length === 5 && (
          <View style={styles.buttonContainer}>
            <Button
              title="Button"
              onPress={async () => {
                addPosition(positions);
              }}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

// ajoute un joueur a une partie
const addPosition = async (positions: {}) => {
  const email = await new Player().getPlayerEmail();
  console.log(email);
  try {
    PositionRef.add({
      [email.email]: positions,
    });
  } catch (error) {
    console.log(error);
  }
}

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
});

export default GameScreen;
