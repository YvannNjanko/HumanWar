import React, {useRef, useState} from 'react';
import {View, Image, PanResponder, StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const bonhomme1 = require('../../images/bonhomme1.png');

const DraggableImage = () => {
  const xMid = width / 2;
  const yMid = height / 2;
  const xScale = width / 20; // Chaque unité sur l'axe des x
  const yScale = height / 20;

  const convertToReperePosition = (
    x: number,
    y: number,
    xMid: number,
    yMid: number,
    xScale: number,
    yScale: number,
  ): object => {
    const xRepere = (x - xMid) / xScale;
    const yRepere = (yMid - y) / yScale;

    return {xRepere, yRepere};
  };

  const [position, setPosition] = useState({x: 0, y: 0});
  const [move, setMove] = useState(true);
  const [truc,setTruc] = useState({xRepere:0, yRepere:0});

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
          let truc = convertToReperePosition(
              gestureState.dx,
              gestureState.dy,
              xMid,
              yMid,
              xScale,
              yScale,
            );
            console.log(truc);
        if (move) {
          setPosition({
            x: gestureState.dx,
            y: gestureState.dy,
          });
        }
      },
      onPanResponderRelease: () => {
        // Optionally, reset the position here
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <View
        {...panResponder.panHandlers}
        style={[
          styles.box,
          {
            transform: [{translateX: position.x}, {translateY: position.y}],
          },
        ]}>
        <Image source={bonhomme1} style={styles.image} />
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
});

export default DraggableImage;
