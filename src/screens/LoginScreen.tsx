import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Player } from '../models/Player';


type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '196112412-rb22gkvktuol5nvsuv0bm987d52rdnrf.apps.googleusercontent.com', // Remplacez par votre propre ID client web
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      await auth().signInWithCredential(googleCredential);
      const player = new Player(userInfo.user.name, null, userInfo.user.email);
      await player.addPlayer(player);
      const stringifiedPlayer = JSON.stringify(player);
      AsyncStorage.setItem('Player', stringifiedPlayer).then(() => {
        console.log('Object stored successfully!');
      });
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.image}
      />
      
      <TouchableOpacity style={styles.button} onPress={signInWithGoogle}>
  <Icon name="google" size={20} color="red"/>
  <Text style={styles.buttonText}>Sign in With Google</Text>
</TouchableOpacity>

    </View>   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    justifyContent: 'center',
    width: 300,
    height: 180,
    marginTop: -160,
    marginBottom: 70,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    marginRight: 50,
  },
});

export default LoginScreen;
