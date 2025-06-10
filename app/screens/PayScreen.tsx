// screens/PayScreen.tsx
import React, {FC, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../config/colors';
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

const {width} = Dimensions.get('window');
const AVATAR_SIZE = 80;

const PayScreen: FC<Props> = ({route, navigation}) => {
  const {contact} = route.params;
  const [method, setMethod] = useState<'Bank' | 'UPI'>('Bank');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const btnScale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(btnScale, {toValue: 0.95, useNativeDriver: true}).start();
  const onPressOut = () =>
    Animated.spring(btnScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();

  const handlePay = () => {
    if (!amount) return Alert.alert('Enter an amount');
    Alert.alert(`Paid ₹${amount} via ${method} to ${contact.name}`);
    navigation.goBack();
  };

  const initials = contact.name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Pay Contact" onBack={() => navigation.goBack()} />

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.mobile}>{contact.mobile}</Text>
      </View>

      <View style={styles.form}>
        {/* Method selector */}
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={[styles.inputRow, styles.dropdownInput]}
            onPress={() => setDropdownOpen(o => !o)}
            activeOpacity={0.8}>
            <Text style={styles.inputText}>{method}</Text>
            <MaterialIcons
              name={dropdownOpen ? 'arrow-drop-up' : 'arrow-drop-down'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
          {dropdownOpen && (
            <View style={styles.dropdownMenu}>
              {['Bank', 'UPI'].map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.inputRow, styles.dropdownItem]}
                  onPress={() => {
                    setMethod(m as any);
                    setDropdownOpen(false);
                  }}
                  activeOpacity={0.8}>
                  <Text style={styles.inputText}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Conditional fields */}
        {method === 'UPI' && (
          <View style={[styles.inputRow, styles.inputField]}>
            <MaterialIcons
              name="account-balance-wallet"
              size={24}
              color={colors.primary}
            />
            <TextInput
              style={styles.input}
              value={contact.upi || ''}
              editable={false}
              placeholder="No UPI ID"
              placeholderTextColor="#888"
            />
          </View>
        )}
        {method === 'Bank' && (
          <>
            <View style={[styles.inputRow, styles.inputField]}>
              <MaterialIcons
                name="account-balance"
                size={24}
                color={colors.primary}
              />
              <TextInput
                style={styles.input}
                value={contact.accountNumber || ''}
                editable={false}
                placeholder="No account number"
                placeholderTextColor="#888"
              />
            </View>
            <View style={[styles.inputRow, styles.inputField]}>
              <MaterialIcons name="info" size={24} color={colors.primary} />
              <TextInput
                style={styles.input}
                value={contact.ifsc || ''}
                editable={false}
                placeholder="No IFSC"
                placeholderTextColor="#888"
              />
            </View>
          </>
        )}

        {/* Amount Input */}
        <View style={[styles.inputRow, styles.inputField]}>
          <MaterialIcons name="attach-money" size={24} color={colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholderTextColor="#888"
          />
        </View>

        {/* Remark Input */}
        <View style={[styles.inputRow, styles.inputField, styles.textAreaRow]}>
          <MaterialIcons name="note" size={24} color={colors.primary} />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Remark (optional)"
            value={note}
            onChangeText={setNote}
            multiline
            placeholderTextColor="#888"
          />
        </View>
      </View>

      {/* Pay Button */}
      <Animated.View
        style={[styles.payContainer, {transform: [{scale: btnScale}]}]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={handlePay}>
          <LinearGradient
            colors={[colors.primaryDark, colors.primary]}
            style={styles.payButton}>
            <Text style={styles.payText}>Pay Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bgLight},

  profileCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    alignItems: 'center',
    paddingTop: AVATAR_SIZE / 2 + 16,
    paddingBottom: 24,
    elevation: 2,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -AVATAR_SIZE / 2,
    elevation: 3,
  },
  initials: {
    color: colors.white,
    fontSize: 28,
    fontFamily: 'Montserrat-Bold',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Montserrat-Medium',
    color: colors.primaryDark,
    marginTop: 8,
  },
  mobile: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666',
    marginTop: 4,
  },

  form: {
    marginTop: 24,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  dropdownWrapper: {
    marginBottom: 16,
    zIndex: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    elevation: 1,
  },
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  inputText: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: colors.primaryDark,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 20,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: colors.primaryDark,
  },

  inputField: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 12,
  },
  textAreaRow: {
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  payContainer: {
    marginTop: 'auto',
    marginHorizontal: 16,
    marginBottom: 32,
  },
  payButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  payText: {
    color: colors.white,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
});

export default PayScreen;
