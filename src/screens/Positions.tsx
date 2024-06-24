import React, { useRef, useState } from 'react';
import { View, Image, PanResponder, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, { Line, Text as SvgText } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const bonhomme1 = require('../../images/bonhomme1.png');

const DraggableImage: React.FC = () => {
  const xMid = width / 2;
  const yMid = height / 2;
  const xScale = width / 20; // Chaque unité sur l'axe des x
  const yScale = height / 20; // Chaque unité sur l'axe des y

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [reperePosition, setReperePosition] = useState({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const newPosX = gestureState.dx;
        const newPosY = gestureState.dy;
        const xRepere = (xMid + newPosX - xMid) / xScale;
        const yRepere = (yMid - (yMid + newPosY)) / yScale;
        setPosition({ x: newPosX, y: newPosY });
        setReperePosition({ x: xRepere, y: yRepere });
      },
      onPanResponderRelease: () => {
        // Optionally, reset the position here
      },
    })
  ).current;

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
        />
      );
      if (i !== 0) { // Skip the origin
        lines.push(
          <SvgText
            key={`x-text-${i}`}
            x={xPos}
            y={yMid + 15}
            fontSize="10"
            fill="black"
            textAnchor="middle"
          >
            {i}
          </SvgText>
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
        />
      );
      if (i !== 0) { // Skip the origin
        lines.push(
          <SvgText
            key={`y-text-${i}`}
            x={xMid + 15}
            y={yPos + 3}
            fontSize="10"
            fill="black"
            textAnchor="middle"
          >
            {i}
          </SvgText>
        );
      }
    }
    return lines;
  };

  return (
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
      <View
        {...panResponder.panHandlers}
        style={[
          styles.box,
          {
            transform: [{ translateX: position.x }, { translateY: position.y }],
          },
        ]}
      >
        <Image source={bonhomme1} style={styles.image} />
      </View>
      <View style={styles.positionTextContainer}>
        <Text style={styles.positionText}>
          Position: ({reperePosition.x.toFixed(2)}, {reperePosition.y.toFixed(2)})
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 100,
    height: 100,
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
});

export default DraggableImage;
