import React, {useState} from 'react';
import {Button, Image, Platform, StyleSheet, Text, View} from 'react-native';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const URL = 'https://google.com';

const CheckSSL = ({
  userInfo,
  setIsLogin,
  setUserInfo,
}: {
  userInfo: FirebaseAuthTypes.UserCredential | null | undefined;
  setIsLogin: any;
  setUserInfo: any;
}) => {
  const [validationMsg, setValidationMsg] = useState('Waiting');
  const [validationStatus, setValidationStatus] = useState('');
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setIsLogin(false);
      setUserInfo(null);
    } catch (error) {
      console.error(error);
    }
  };
  const onConnectPress = () => {
    fetch(URL)
      .then(res => {
        console.log('**************');
        console.log(res);
        console.log('**************');
        setValidationMsg('Valid certificate, connected.');
        setValidationStatus('success');
      })
      .catch(() => {
        setValidationMsg('Certificate does not match, connection refused');
        setValidationStatus('failed');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.auth}>
        {userInfo?.user?.photoURL && (
          <Image
            style={styles.image}
            source={{uri: userInfo?.user?.photoURL ?? undefined}}
            borderRadius={40}
          />
        )}
        <Text style={styles.title}>{userInfo?.user?.displayName}</Text>
      </View>
      <Text style={styles.title}>React Native SSL Pinning</Text>
      <Text style={styles.title}>({Platform.OS.toUpperCase()})</Text>
      <Text style={styles.header}>Certificate status:</Text>
      <Text
        style={[
          styles.status,
          validationStatus === 'success' && styles.success,
          validationStatus === 'failed' && styles.failed,
        ]}>
        {validationMsg}
      </Text>
      <View style={styles.btnContainer}>
        <Button title={`Test ${URL}`} onPress={onConnectPress} />
      </View>
      <View style={styles.signOut}>
        <Button title="Sign Out" onPress={signOut} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  auth: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  image: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    paddingTop: 46,
    fontSize: 18,
    textAlign: 'center',
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  success: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  failed: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  btnContainer: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 4,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  signOut: {
    marginTop: 50,
  },
});

export default CheckSSL;
