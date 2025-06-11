import React, {FC} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import colors from '../config/colors';
import ContactCard, {Contact} from './ContactCard';
import fonts from '../config/fonts';

const CARD_WIDTH = responsiveWidth(90);
const VERTICAL_GUTTER = responsiveHeight(1.5);

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
            size={responsiveFontSize(2.5)}
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
    marginTop: responsiveHeight(3),
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
    fontSize: responsiveFontSize(2.5),
    fontFamily: fonts.medium,
    color: colors.primaryDark,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButtonText: {
    marginLeft: responsiveWidth(1),
    fontSize: responsiveFontSize(2),
    color: colors.primary,
    fontFamily: fonts.medium,
  },
  empty: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    paddingVertical: responsiveHeight(2.5),
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(1.75),
  },
});
