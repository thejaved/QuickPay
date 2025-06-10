import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../config/colors';
import fonts from '../config/fonts';

// Navigation param list
export type RootStackParamList = {
  Login: undefined;
  BottomTabs: undefined;
};

type LoginScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const {width} = Dimensions.get('window');
const LOGO_SIZE = width * 0.4;
const BUTTON_HEIGHT = 50;
const BUTTON_RADIUS = BUTTON_HEIGHT / 2;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavProp>();

  // Animation refs
  const logoScale = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID',
      offlineAccess: false,
    });

    // Animate logo and button
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoScale, buttonOpacity, navigation]);

  const onGooglePress = async () => {
    try {
      //   await GoogleSignin.hasPlayServices();
      //   const res = await GoogleSignin.signIn();

      //   console.log('res', res);
      // TODO: Send idToken to backend
      navigation.reset({index: 0, routes: [{name: 'BottomTabs'}]});
    } catch (err: any) {
      switch (err.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.warn('User cancelled Google sign-in');
          break;
        case statusCodes.IN_PROGRESS:
          console.warn('Google sign-in in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.warn('Play services not available');
          break;
        default:
          console.error(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
        animated
      />

      <Animated.Image
        source={require('../assets/images/logo.png')}
        style={[styles.logo, {transform: [{scale: logoScale}]}]}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to QuickPay</Text>
      <Text style={styles.subtitle}>Fast. Secure. Everywhere.</Text>

      <Animated.View style={{opacity: buttonOpacity}}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={onGooglePress}
          activeOpacity={0.7}>
          <AntDesign name="google" size={24} color={colors.primary} />
          <Text style={styles.googleText}>Login with Google</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.medium,
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: BUTTON_RADIUS,
    height: BUTTON_HEIGHT,
    width: width * 0.8,
    paddingHorizontal: 16,
  },
  googleText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#3c4043',
    fontFamily: fonts.regular,
  },
});
