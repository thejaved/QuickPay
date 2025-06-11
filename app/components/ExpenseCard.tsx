import React, {FC, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import colors from '../config/colors';
import fonts from '../config/fonts';

export const CARD_WIDTH = responsiveWidth(90);
export const CARD_HEIGHT = responsiveHeight(20);

export interface ExpenseCardProps {
  title: string;
  icon: string;
  value: number;
  max: number;
  index: number;
  scrollY: Animated.Value;
}

const ExpenseCard: FC<ExpenseCardProps> = ({
  title,
  icon,
  value,
  max,
  index,
  scrollY,
}) => {
  const tilt = useRef(new Animated.Value(0)).current;
  const fillAnim = useRef(new Animated.Value(0)).current;
  const countAnim = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: (value / max) * 100,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    countAnim.addListener(({value: v}) => setDisplayValue(Math.floor(v)));
    Animated.timing(countAnim, {
      toValue: value,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => countAnim.removeAllListeners();
  }, [fillAnim, countAnim, value, max]);

  const onPressIn = () =>
    Animated.timing(tilt, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  const onPressOut = () =>
    Animated.timing(tilt, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();

  const translateY = scrollY.interpolate({
    inputRange: [-1, 0, CARD_HEIGHT * index, CARD_HEIGHT * (index + 2)],
    outputRange: [0, 0, 0, -responsiveHeight(4)],
  });

  const tiltInterpolate = tilt.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-5deg'],
  });

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {transform: [{translateY}, {rotate: tiltInterpolate} as any]},
      ]}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
        <View style={styles.iconHeader}>
          <View style={styles.iconCircle}>
            <MaterialIcons
              name={icon}
              size={responsiveFontSize(3)}
              color={colors.white}
            />
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.barBackground}>
          <Animated.View style={[styles.barFillContainer, {width: fillWidth}]}>
            <LinearGradient
              colors={[colors.primaryLight, colors.primary]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.barFill}
            />
          </Animated.View>
        </View>

        <Text style={styles.value}>₹{displayValue.toLocaleString()}</Text>
      </Pressable>
    </Animated.View>
  );
};

export default ExpenseCard;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: colors.white,
    borderRadius: responsiveWidth(5),
    padding: responsiveWidth(4),
    marginVertical: responsiveHeight(1.5),
    borderColor: colors.lightGray,
    borderWidth: 1,
  },
  iconHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  iconCircle: {
    width: responsiveWidth(13),
    height: responsiveWidth(13),
    borderRadius: responsiveWidth(6.5),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '600',
    color: colors.primaryDark,
    marginTop: responsiveHeight(1.5),
    fontFamily: fonts.regular,
  },
  barBackground: {
    marginTop: responsiveHeight(1.5),
    width: '100%',
    height: responsiveHeight(1.5),
    backgroundColor: '#eee',
    borderRadius: responsiveHeight(0.75),
    overflow: 'hidden',
  },
  barFillContainer: {
    height: '100%',
  },
  barFill: {
    flex: 1,
    borderRadius: responsiveHeight(0.75),
  },
  value: {
    position: 'absolute',
    top: responsiveHeight(2),
    right: responsiveWidth(4),
    fontSize: responsiveFontSize(3.5),
    color: colors.secondary,
    fontFamily: fonts.medium,
  },
});
