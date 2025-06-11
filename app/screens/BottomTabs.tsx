import React, {FC, useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import colors from '../config/colors';
import DashboardScreen from './DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';

type RootStackParamList = {
  Dashboard: undefined;
  Scan: undefined;
  Profile: undefined;
};

type BottomTabsNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

const TAB_BAR_HEIGHT = responsiveHeight(8);
const SCAN_BUTTON_SIZE = responsiveWidth(18);
const SCREEN_WIDTH = responsiveWidth(100);

const TABS = ['Dashboard', 'Scan', 'Profile'] as const;
type Tab = (typeof TABS)[number];

const ICONS: Record<
  Tab,
  {lib: typeof AntDesign | typeof MaterialIcons; name: string}
> = {
  Dashboard: {lib: MaterialIcons, name: 'dashboard'},
  Scan: {lib: MaterialIcons, name: 'qr-code-scanner'},
  Profile: {lib: AntDesign, name: 'user'},
};

const BottomTabs: FC = () => {
  const navigation = useNavigation<BottomTabsNavProp>();
  const [selected, setSelected] = useState<Tab>('Dashboard');
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const onPressScan = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    navigation.navigate('Scan');
  };

  const renderScreen = () => {
    switch (selected) {
      case 'Dashboard':
        return <DashboardScreen navigation={navigation} />;
      case 'Scan':
        return <View style={styles.center} />;
      case 'Profile':
        return <ProfileScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}

      <LinearGradient
        colors={[colors.white, '#f0f0f0']}
        style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          {TABS.map(tab => {
            const {lib: Icon, name} = ICONS[tab];
            if (tab === 'Scan') {
              return (
                <Animated.View
                  key="scan"
                  style={[
                    styles.scanWrapper,
                    {transform: [{scale: bounceAnim}]},
                  ]}>
                  <TouchableOpacity onPress={onPressScan} activeOpacity={0.8}>
                    <View style={styles.scanButton}>
                      <Icon
                        name={name}
                        size={responsiveFontSize(4)}
                        color={colors.white}
                      />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            }

            const focused = selected === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={styles.tabButton}
                onPress={() => setSelected(tab)}
                activeOpacity={0.7}>
                <Icon
                  name={name}
                  size={
                    focused ? responsiveFontSize(3.5) : responsiveFontSize(3)
                  }
                  color={focused ? colors.primary : '#aaa'}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH,
    height: TAB_BAR_HEIGHT,
  },
  tabBar: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanWrapper: {
    position: 'absolute',
    top: -SCAN_BUTTON_SIZE / 2,
    left: responsiveWidth((100 - 18) / 2),
    zIndex: 10,
  },
  scanButton: {
    width: SCAN_BUTTON_SIZE,
    height: SCAN_BUTTON_SIZE,
    borderRadius: SCAN_BUTTON_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {elevation: 8},
    }),
  },
});
