import React, {FC, useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import colors from '../config/colors';
import Header from '../components/Header';
import ContactCard, {Contact} from '../components/ContactCard';

// Navigation stack params
type RootStackParamList = {
  ContactScreen: undefined;
  PayScreen: {contact: Contact};
};
type NavProp = NativeStackNavigationProp<RootStackParamList, 'ContactScreen'>;

const FAB_SIZE = responsiveWidth(14);
const CARD_WIDTH = responsiveWidth(90);

// Form fields definition
const fields: Array<{
  key: keyof Omit<Contact, 'id'>;
  label: string;
  keyboard?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
}> = [
  {key: 'name', label: 'Name'},
  {key: 'mobile', label: 'Mobile', keyboard: 'phone-pad'},
  {key: 'email', label: 'Email', keyboard: 'email-address'},
  {key: 'accountNumber', label: 'Account Number', keyboard: 'numeric'},
  {key: 'ifsc', label: 'IFSC Code'},
  {key: 'upi', label: 'UPI ID'},
  {key: 'remark', label: 'Remark'},
];

interface ContactFormProps {
  onCancel: () => void;
  onSubmit: (data: Omit<Contact, 'id'>) => void;
}

const ContactForm: FC<ContactFormProps> = ({onCancel, onSubmit}) => {
  const [form, setForm] = useState<Omit<Contact, 'id'>>({
    name: '',
    mobile: '',
    email: '',
    accountNumber: '',
    ifsc: '',
    upi: '',
    remark: '',
  });

  return (
    <View style={styles.formContainer}>
      <View style={styles.handle} />
      <Text style={styles.formTitle}>Add Contact</Text>
      {fields.map(f => (
        <View key={f.key} style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{f.label}</Text>
          <TextInput
            style={styles.input}
            placeholder={f.label}
            keyboardType={f.keyboard}
            value={form[f.key] as string}
            onChangeText={text => setForm(prev => ({...prev, [f.key]: text}))}
          />
        </View>
      ))}
      <View style={styles.formActions}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => form.name && form.mobile && onSubmit(form)}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ContactScreen: FC = () => {
  const navigation = useNavigation<NavProp>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const bounce = useRef(new Animated.Value(1)).current;

  // Load contacts on mount
  useEffect(() => {
    AsyncStorage.getItem('contacts')
      .then(str => str && setContacts(JSON.parse(str)))
      .catch(() => {});
  }, []);

  // Persist contacts on change
  useEffect(() => {
    AsyncStorage.setItem('contacts', JSON.stringify(contacts)).catch(() => {});
  }, [contacts]);

  const handleAdd = (data: Omit<Contact, 'id'>) => {
    setContacts(prev => [{id: Date.now().toString(), ...data}, ...prev]);
    setModalVisible(false);
  };

  const toggleModal = () => {
    Animated.sequence([
      Animated.timing(bounce, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bounce, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setModalVisible(v => !v);
  };

  const renderItem = useCallback(
    ({item}: {item: Contact}) => (
      <ContactCard
        contact={item}
        onPay={c => navigation.navigate('PayScreen', {contact: c})}
        style={{
          width: CARD_WIDTH,
          alignSelf: 'center',
          marginVertical: responsiveHeight(1),
        }}
      />
    ),
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Contacts" onBack={() => navigation.goBack()} />

      <FlatList
        data={contacts}
        keyExtractor={(c: any) => c.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>No contacts yet. Tap + to add.</Text>
        }
      />

      <Animated.View style={[styles.fab, {transform: [{scale: bounce}]}]}>
        <TouchableOpacity onPress={toggleModal}>
          <AntDesign name="plus" size={responsiveFontSize(3)} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.backdrop} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalWrapper}>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <ContactForm onCancel={toggleModal} onSubmit={handleAdd} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  listContent: {
    paddingVertical: responsiveHeight(2),
    paddingBottom: FAB_SIZE + responsiveHeight(4),
  },
  separator: {height: responsiveHeight(1.5)},
  empty: {
    textAlign: 'center',
    marginTop: responsiveHeight(4),
    color: '#888',
    fontSize: responsiveFontSize(2),
  },

  fab: {
    position: 'absolute',
    bottom: responsiveHeight(4),
    right: responsiveWidth(6),
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalWrapper: {
    position: 'absolute',
    bottom: 0,
    width: responsiveWidth(100),
    maxHeight: responsiveHeight(75),
    backgroundColor: colors.white,
    borderTopLeftRadius: responsiveWidth(4),
    borderTopRightRadius: responsiveWidth(4),
  },
  modalScroll: {
    paddingHorizontal: responsiveWidth(6),
    paddingTop: responsiveHeight(1.5),
    paddingBottom: responsiveHeight(3),
  },

  formContainer: {},
  handle: {
    width: responsiveWidth(10),
    height: responsiveHeight(0.75),
    borderRadius: responsiveHeight(0.375),
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: responsiveHeight(1.5),
  },
  formTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '600',
    marginBottom: responsiveHeight(2),
  },
  inputGroup: {marginBottom: responsiveHeight(1.5)},
  inputLabel: {
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveHeight(0.5),
    color: colors.primaryDark,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: responsiveWidth(2),
    padding: responsiveWidth(3),
    backgroundColor: '#fafafa',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: responsiveHeight(2),
  },
  cancelText: {
    fontSize: responsiveFontSize(2.25),
    color: '#888',
    marginRight: responsiveWidth(6),
  },
  saveText: {fontSize: responsiveFontSize(2.25), color: colors.primary},
});
