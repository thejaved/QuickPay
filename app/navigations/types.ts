import {Contact} from '../screens/PayScreen';

export type RootStackParamList = {
  Scan: undefined;
  BottomTabs: undefined;
  LoginScreen: undefined;
  SplashScreen: undefined;
  ContactScreen: undefined;
  PayScreen: {contact: Contact};
};
