import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Scan from '../screens/ScanScreen';
import PayScreen from '../screens/PayScreen';
import BottomTabs from '../screens/BottomTabs';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import ContactScreen from '../screens/ContactScreen';

import type {RootStackParamList} from './types.ts';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="SplashScreen">
      <Stack.Screen name="Scan" component={Scan} />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="ContactScreen" component={ContactScreen} />
      <Stack.Screen name="PayScreen" component={PayScreen} />
    </Stack.Navigator>
  );
}

export default AppStack;
