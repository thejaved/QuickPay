import React, {FC, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../config/colors';
import fonts from '../config/fonts';

export interface Contact {
  name: string;
  mobile: string;
  email?: string;
  accountNumber?: string;
  ifsc?: string;
  upi?: string;
  remark?: string;
}

interface Props {
  contact: Contact;
  onPay: (contact: Contact) => void;
  style?: object;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const ContactCard: FC<Props> = ({contact, onPay, style}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, {toValue: 0.97, useNativeDriver: true}).start();
  const onPressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();

  return (
    <Animated.View style={[{transform: [{scale}]}, style]}>
      <Pressable
        style={styles.card}
        onPress={() => onPay(contact)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}>
        <LinearGradient
          colors={[colors.primaryLight, colors.primaryDark]}
          style={styles.avatar}>
          <Text style={styles.initials}>{getInitials(contact.name)}</Text>
        </LinearGradient>
        <View style={styles.info}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.mobile}>{contact.mobile}</Text>
        </View>
        <View style={styles.iconWrapper}>
          <AntDesign name="arrowright" size={18} color={colors.white} />
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default ContactCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderColor: colors.lightGray,
    borderWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  initials: {
    color: colors.white,
    fontFamily: fonts.bold,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.primaryDark,
    textTransform: 'capitalize',
  },
  mobile: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontFamily: fonts.regular,
  },
  iconWrapper: {
    backgroundColor: colors.primary,
    padding: 6,
    borderRadius: 12,
  },
});
