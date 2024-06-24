import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, TouchableWithoutFeedback, GestureResponderEvent, Image, LayoutChangeEvent } from 'react-native';
import Svg, { Line, Text, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
 
const bonhomme1 = require("../../images/bonhomme.png")

const Graph: React.FC = () => {
  const xMid = width / 2;
  const yMid = height / 2;
  const xScale = width / 20; // Chaque unité sur l'axe des x
  const yScale = height / 20; // Chaque unité sur l'axe des y

  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [circle, setCircle] = useState<{ cx: number; cy: number; r: number } | null>(null);

  const handlePress = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    const x = (locationX - xMid) / xScale;
    const y = (yMid - locationY) / yScale;

    console.log(`Coordinates: (${x.toFixed(2)}, ${y.toFixed(2)})`);

    const newCircle = { cx: x, cy: y, r: 0.5 };
    setCircle(newCircle);

    const imageXStart = imagePosition.x;
    const imageXEnd = imagePosition.x + imageSize.width / xScale;
    const imageYStart = imagePosition.y;
    const imageYEnd = imagePosition.y - imageSize.height / yScale;
    console.log('Y',imageYStart, imageYEnd)
    console.log('X',imageXStart, imageXEnd)
    console.log(estEntre(imageXStart, imageXEnd, x,imageYStart, imageYEnd, y) ? 'Image touchée' : 'Image non touchée');
  };
  
  function estEntre(nombre1:number, nombre2:number, nombre3:number, nombre4:number, nombre5:number, nombre6:number) {
    const estEntrePremierDeuxieme = nombre3 >= nombre1 && nombre3 <= nombre2;
    const estEntreCinquiemeQuatrieme = nombre6 >= nombre5 && nombre6 <= nombre4;
    return estEntrePremierDeuxieme && estEntreCinquiemeQuatrieme;
}

  const onImageLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    const imageX = (x - xMid) / xScale;
    const imageY = (yMid - y) / yScale;
    setImagePosition({ x: imageX, y: imageY });
    setImageSize({ width, height });
  };
  const onImageLayout2 = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    const imageX = (x - xMid) / xScale;
    const imageY = (yMid - y) / yScale;
    setImagePosition({ x: imageX, y: imageY });
    setImageSize({ width, height });
  };
  const onImageLayout3 = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    const imageX = (x - xMid) / xScale;
    const imageY = (yMid - y) / yScale;
    setImagePosition({ x: imageX, y: imageY });
    setImageSize({ width, height });
  };

  useEffect(() => {
    if (circle) {
      const timer = setTimeout(() => {
        setCircle(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [circle]);

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
          <Text
            key={`x-text-${i}`}
            x={xPos}
            y={yMid + 15}
            fontSize="10"
            fill="black"
            textAnchor="middle"
          >
            {i}
          </Text>
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
          <Text
            key={`y-text-${i}`}
            x={xMid + 15}
            y={yPos + 3}
            fontSize="10"
            fill="black"
            textAnchor="middle"
          >
            {i}
          </Text>
        );
      }
    }
    return lines;
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {/* Image en arrière-plan */}
        <Image
          source={bonhomme1}
          style={styles.image}
          onLayout={onImageLayout}
        />
        <Image
          source={bonhomme1}
          style={styles.image}
          onLayout={onImageLayout2}
        />
        <Image
          source={bonhomme1}
          style={styles.image}
          onLayout={onImageLayout3}
        />
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
          {/* Cercle rouge */}
          {circle && (
            <Circle
              cx={xMid + circle.cx * xScale}
              cy={yMid - circle.cy * yScale}
              r={circle.r * xScale}
              stroke="red"
              strokeWidth="2"
              fill="red"
            />
          )}
        </Svg>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 50, // set your desired width
    height: 150, // set your desired height
    position: 'absolute',
  },
});

export default Graph;
