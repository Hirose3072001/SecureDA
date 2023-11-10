import React, {useEffect, useState} from 'react';
import {Alert, Button, Platform, StyleSheet, View} from 'react-native';
import JailMonkey from 'jail-monkey';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import CheckSSL from './CheckSSL';
import RNExitApp from 'react-native-exit-app';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';

const App = () => {
  useKeepAwake();
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] =
    useState<FirebaseAuthTypes.UserCredential | null>();
  GoogleSignin.configure({
    webClientId:
      '161535266672-9jrf3g6ac1h53t5q9c9mkb0doop1nndc.apps.googleusercontent.com',
  });
  const signInWithGoogle = async () => {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in
      .then(user => {
        console.log('user', user);
        if (user.user.email) {
          setIsLogin(true);
          setUserInfo(user);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  useEffect(() => {
    if (Platform.OS === 'android' && JailMonkey.isJailBroken()) {
      return Alert.alert(
        'Root Device is Detected',
        'You cannot use this app, bye 👋',
        [
          {
            text: 'Ok',
            onPress: () => RNExitApp.exitApp(),
          },
        ],
      );
    }
  }, []);
  return (
    <View style={styles.view}>
      {isLogin ? (
        <CheckSSL
          userInfo={userInfo}
          setIsLogin={setIsLogin}
          setUserInfo={setUserInfo}
        />
      ) : (
        <Button title="Sign in with Google" onPress={signInWithGoogle} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default App;
