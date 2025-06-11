import React, {FC, useState, useRef, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import colors from '../config/colors';
import fonts from '../config/fonts';
import Header from '../components/Header';

export interface Contact {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  accountNumber?: string;
  ifsc?: string;
  upi?: string;
  remark?: string;
}

type RootStackParamList = {
  ContactScreen: undefined;
  PayScreen: {contact: Contact};
};
type Props = NativeStackScreenProps<RootStackParamList, 'PayScreen'>;

const AVATAR_SIZE = responsiveWidth(18);
const ICON_SIZE = responsiveFontSize(2.5);

const methods = ['Bank', 'UPI'] as const;

type Method = (typeof methods)[number];

const FieldRow: FC<{icon: string; children: React.ReactNode; style?: any}> = ({
  icon,
  children,
  style,
}) => (
  <View style={[styles.inputRow, style]}>
    <MaterialIcons name={icon} size={ICON_SIZE} color={colors.primary} />
    {children}
  </View>
);

const PayScreen: FC<Props> = ({route, navigation}) => {
  const {contact} = route.params;
  const [method, setMethod] = useState<Method>('Bank');
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const scale = useRef(new Animated.Value(1)).current;

  const initials = useMemo(
    () => contact.name.match(/\b\w/g)?.slice(0, 2).join('').toUpperCase(),
    [contact.name],
  );

  const animate = (toValue: number) =>
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      friction: 3,
    }).start();

  const handlePay = () => {
    if (!amount) return Alert.alert('Enter an amount');
    Alert.alert(`Paid ₹${amount} via ${method} to ${contact.name}`);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Pay Contact" onBack={() => navigation.goBack()} />
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.mobile}>{contact.mobile}</Text>
      </View>

      <View style={styles.form}>
        <TouchableOpacity
          onPress={() => setOpen(o => !o)}
          activeOpacity={0.8}
          style={styles.dropdown}>
          <Text style={styles.dropdownText}>{method}</Text>
          <MaterialIcons
            name={open ? 'arrow-drop-up' : 'arrow-drop-down'}
            size={ICON_SIZE}
            color="#666"
          />
        </TouchableOpacity>
        {open && (
          <View style={styles.menu}>
            {methods.map(m => (
              <TouchableOpacity
                key={m}
                onPress={() => {
                  setMethod(m);
                  setOpen(false);
                }}
                style={styles.menuItem}>
                <Text style={styles.menuText}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {method === 'UPI' ? (
          <FieldRow icon="account-balance-wallet">
            <TextInput
              style={styles.input}
              value={contact.upi ?? ''}
              editable={false}
              placeholder="No UPI ID"
              placeholderTextColor="#888"
            />
          </FieldRow>
        ) : (
          <>
            <FieldRow icon="account-balance">
              <TextInput
                style={styles.input}
                value={contact.accountNumber ?? ''}
                editable={false}
                placeholder="No account"
                placeholderTextColor="#888"
              />
            </FieldRow>
            <FieldRow icon="info">
              <TextInput
                style={styles.input}
                value={contact.ifsc ?? ''}
                editable={false}
                placeholder="No IFSC"
                placeholderTextColor="#888"
              />
            </FieldRow>
          </>
        )}

        <FieldRow icon="attach-money">
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholderTextColor="#888"
          />
        </FieldRow>

        <FieldRow icon="note" style={styles.textAreaRow}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Remark (optional)"
            value={note}
            onChangeText={setNote}
            multiline
            placeholderTextColor="#888"
          />
        </FieldRow>
      </View>

      <Animated.View style={[styles.buttonWrap, {transform: [{scale}]}]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={() => animate(0.95)}
          onPressOut={() => animate(1)}
          onPress={handlePay}>
          <LinearGradient
            colors={[colors.primaryDark, colors.primary]}
            style={styles.button}>
            <Text style={styles.buttonText}>Pay Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default PayScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bgLight},
  profile: {alignItems: 'center', marginTop: responsiveHeight(2)},
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(1),
    elevation: 3,
  },
  initials: {
    fontSize: responsiveFontSize(4),
    color: colors.white,
    fontFamily: fonts.bold,
  },
  name: {
    fontSize: responsiveFontSize(2.25),
    fontFamily: fonts.medium,
    color: colors.primaryDark,
  },
  mobile: {
    fontSize: responsiveFontSize(1.75),
    fontFamily: fonts.regular,
    color: '#666',
    marginTop: responsiveHeight(0.5),
  },
  form: {paddingHorizontal: responsiveWidth(4), marginTop: responsiveHeight(2)},
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: responsiveWidth(2),
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(1.5),
  },
  dropdownText: {
    flex: 1,
    fontSize: responsiveFontSize(2),
    color: colors.primaryDark,
    fontFamily: fonts.regular,
  },
  menu: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
    marginBottom: responsiveHeight(1.5),
  },
  menuItem: {padding: responsiveWidth(3)},
  menuText: {
    fontSize: responsiveFontSize(2),
    color: colors.primaryDark,
    fontFamily: fonts.regular,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: responsiveWidth(2),
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(1.5),
    elevation: 1,
  },
  textAreaRow: {alignItems: 'flex-start'},
  input: {
    flex: 1,
    marginLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(2),
    fontFamily: fonts.regular,
    color: '#333',
  },
  textArea: {height: responsiveHeight(10), textAlignVertical: 'top'},
  buttonWrap: {
    marginTop: 'auto',
    marginHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(4),
  },
  button: {
    paddingVertical: responsiveHeight(1.5),
    borderRadius: responsiveWidth(2),
    alignItems: 'center',
    elevation: 6,
  },
  buttonText: {
    color: colors.white,
    fontSize: responsiveFontSize(2.25),
    fontFamily: fonts.medium,
  },
});
