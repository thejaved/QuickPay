import React, {FC} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../config/colors';
import ContactCard, {Contact} from './ContactCard';
import fonts from '../config/fonts';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.9; // same as expense cards
const VERTICAL_GUTTER = 12;

interface Props {
  contacts: Contact[];
  onViewAll: () => void;
  onPay: (contact: Contact) => void;
}

const ContactsSection: FC<Props> = ({contacts, onViewAll, onPay}) => {
  const inline = contacts.slice(0, 6);

  const renderItem = ({item}: ListRenderItemInfo<Contact>) => (
    <ContactCard
      contact={item}
      onPay={onPay}
      style={{width: CARD_WIDTH, marginVertical: VERTICAL_GUTTER / 2}}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Contacts ({contacts.length})</Text>
        <TouchableOpacity onPress={onViewAll} style={styles.headerButton}>
          <MaterialIcons
            name="add-circle-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.headerButtonText}>
            {contacts.length > inline.length ? 'View All' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>

      {inline.length === 0 ? (
        <Text style={styles.empty}>
          No contacts yet. Tap “Add” to create one.
        </Text>
      ) : (
        <FlatList
          data={inline}
          keyExtractor={item => item.mobile}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: VERTICAL_GUTTER}}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

export default ContactsSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    alignItems: 'center',
  },
  headerRow: {
    width: CARD_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VERTICAL_GUTTER,
  },
  header: {
    fontSize: 20,
    fontFamily: fonts.medium,
    color: colors.primaryDark,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButtonText: {
    marginLeft: 4,
    color: colors.primary,
    fontFamily: fonts.medium,
  },
  empty: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
    fontFamily: fonts.regular,
  },
});
