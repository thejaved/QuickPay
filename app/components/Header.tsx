import React, {FC, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Path} from 'react-native-svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../config/colors';
import fonts from '../config/fonts';

const {width} = Dimensions.get('window');
const HEADER_HEIGHT = 100;
const CURVE_HEIGHT = 30;

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
                  size={24}
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
                  size={24}
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
        width={width}
        height={CURVE_HEIGHT}
        viewBox={`0 0 ${width} ${CURVE_HEIGHT}`}
        style={styles.curve}>
        <Path
          d={`
            M0,0
            C${width * 0.5},${CURVE_HEIGHT * 1.5} ${
            width * 0.5
          },${-CURVE_HEIGHT} ${width},0
            L${width},${CURVE_HEIGHT} L0,${CURVE_HEIGHT} Z
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
    width,
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
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  iconButton: {padding: 8},
  iconPlaceholder: {width: 40},
  textGroup: {flex: 1, alignItems: 'center'},
  title: {
    fontSize: 22,
    color: colors.white,
    fontFamily: fonts.medium,
  },
  subtitle: {
    marginTop: 4,
    color: colors.white,
    fontSize: 14,
    opacity: 0.9,
    fontFamily: fonts.regular,
  },
  curve: {
    position: 'absolute',
    top: HEADER_HEIGHT,
  },
});
