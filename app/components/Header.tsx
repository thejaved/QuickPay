import React, {FC, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Path} from 'react-native-svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import colors from '../config/colors';
import fonts from '../config/fonts';

const HEADER_HEIGHT = responsiveHeight(12.5);
const CURVE_HEIGHT = responsiveHeight(4);
const WIDTH = responsiveWidth(100);

export interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onNotifications?: () => void;
}

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const Header: FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  onNotifications,
}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [anim]);

  const startX = anim.interpolate({inputRange: [0, 1], outputRange: [0, 1]});
  const endX = anim.interpolate({inputRange: [0, 1], outputRange: [1, 0]});

  return (
    <View style={styles.wrapper}>
      <AnimatedGradient
        colors={[colors.primaryLight, colors.primaryDark]}
        start={{x: startX, y: 0}}
        end={{x: endX, y: 1}}
        style={styles.gradient}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.inner}>
            {onBack ? (
              <TouchableOpacity onPress={onBack} style={styles.iconButton}>
                <MaterialIcons
                  name="arrow-back"
                  size={responsiveHeight(3)}
                  color={colors.white}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.iconPlaceholder} />
            )}

            <View style={styles.textGroup}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            {onNotifications ? (
              <TouchableOpacity
                onPress={onNotifications}
                style={styles.iconButton}>
                <MaterialIcons
                  name="notifications"
                  size={responsiveHeight(3)}
                  color={colors.white}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.iconPlaceholder} />
            )}
          </View>
        </SafeAreaView>
      </AnimatedGradient>

      <Svg
        width={WIDTH}
        height={CURVE_HEIGHT}
        viewBox={`0 0 ${WIDTH} ${CURVE_HEIGHT}`}
        style={styles.curve}>
        <Path
          d={`
            M0,0
            C${WIDTH * 0.5},${CURVE_HEIGHT * 1.5} ${
            WIDTH * 0.5
          },${-CURVE_HEIGHT} ${WIDTH},0
            L${WIDTH},${CURVE_HEIGHT} L0,${CURVE_HEIGHT} Z
          `}
          fill={colors.bg}
        />
      </Svg>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  wrapper: {backgroundColor: 'transparent'},
  gradient: {
    width: WIDTH,
    height: HEADER_HEIGHT + CURVE_HEIGHT / 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  safe: {flex: 1},
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: HEADER_HEIGHT,
    paddingHorizontal: responsiveWidth(4),
    justifyContent: 'space-between',
  },
  iconButton: {padding: responsiveWidth(2)},
  iconPlaceholder: {width: responsiveWidth(10)},
  textGroup: {flex: 1, alignItems: 'center', marginTop: responsiveHeight(2)},
  title: {
    fontSize: responsiveFontSize(2.5),
    color: colors.white,
    fontFamily: fonts.medium,
  },
  subtitle: {
    marginTop: responsiveHeight(1),
    color: colors.white,
    fontSize: responsiveFontSize(1.5),
    opacity: 0.9,
    fontFamily: fonts.regular,
  },
  curve: {
    position: 'absolute',
    top: HEADER_HEIGHT,
  },
});
