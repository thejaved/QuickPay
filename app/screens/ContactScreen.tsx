// screens/ContactScreen.tsx
import React, {FC, useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Dimensions,
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
import colors from '../config/colors';
import Header from '../components/Header';
import ContactCard, {Contact} from '../components/ContactCard';

type RootStackParamList = {
  ContactScreen: undefined;
  PayScreen: {contact: Contact};
};
type NavProp = NativeStackNavigationProp<RootStackParamList, 'ContactScreen'>;

const {width, height} = Dimensions.get('window');
const FAB_SIZE = 56;
const CARD_WIDTH = width * 0.9;

// Define your form fields once
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

  // Load
  useEffect(() => {
    AsyncStorage.getItem('contacts')
      .then(str => str && setContacts(JSON.parse(str)))
      .catch(() => {});
  }, []);

  // Persist
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
        onPay={contact => navigation.navigate('PayScreen', {contact})}
        style={{width: CARD_WIDTH, alignSelf: 'center', marginVertical: 8}}
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
          <AntDesign name="plus" size={24} color="#fff" />
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
  listContent: {paddingVertical: 16, paddingBottom: FAB_SIZE + 32},
  separator: {height: 12},
  empty: {textAlign: 'center', marginTop: 32, color: '#888'},

  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
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
    width,
    maxHeight: height * 0.75,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalScroll: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },

  formContainer: {},
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 12,
  },
  formTitle: {fontSize: 18, fontWeight: '600', marginBottom: 16},
  inputGroup: {marginBottom: 12},
  inputLabel: {fontSize: 14, marginBottom: 4, color: colors.primaryDark},
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelText: {fontSize: 16, color: '#888', marginRight: 24},
  saveText: {fontSize: 16, color: colors.primary},
});
