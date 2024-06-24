import React from 'react';
import { Button, SafeAreaView, StyleSheet } from 'react-native';
import Graph from './src/screens/Graph';
import DraggableImage from './src/screens/Positions';
import AppNavigator from './src/navigation/AppNavigator';


function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      {/* <AppNavigator/> */}
       {/* <Graph /> */}
      <DraggableImage/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:'black'
  },
});

export default App;