import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../config/colors';
import fonts from '../config/fonts';

export type RootStackParamList = {
  Login: undefined;
  BottomTabs: undefined;
};

type LoginScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavProp>();

  const logoScale = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID',
      offlineAccess: false,
    });

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
  }, [logoScale, buttonOpacity]);

  const onGooglePress = async () => {
    try {
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
          <AntDesign
            name="google"
            size={responsiveFontSize(2.5)}
            color={colors.primary}
          />
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
    padding: responsiveWidth(6),
  },
  logo: {
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    marginBottom: responsiveHeight(4),
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: fonts.medium,
    color: colors.primary,
    marginBottom: responsiveHeight(1),
  },
  subtitle: {
    fontSize: responsiveFontSize(1.75),
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginBottom: responsiveHeight(5),
    lineHeight: responsiveFontSize(2.75),
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: responsiveHeight(3),
    height: responsiveHeight(6),
    width: responsiveWidth(80),
    paddingHorizontal: responsiveWidth(4),
  },
  googleText: {
    marginLeft: responsiveWidth(3),
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    color: '#3c4043',
    fontFamily: fonts.regular,
  },
});
