import React, {useRef, useState} from 'react';
import {View, Image, PanResponder, StyleSheet} from 'react-native';

const bonhomme1 = require('../../images/bonhomme1.png');

const DraggableImage = () => {
  const [position, setPosition] = useState({x: 0, y: 0});
  const [move, setMove] = useState(true);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        console.log('Position x:', gestureState.dx, 'y:', gestureState.dy);
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
