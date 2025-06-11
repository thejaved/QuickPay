import React, {FC} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import fonts from '../config/fonts';
import colors from '../config/colors';

const AVATAR_SIZE = responsiveWidth(25);
const CARD_WIDTH = responsiveWidth(90);

const user = {
  name: 'Javed Khan',
  email: 'javed@example.com',
};

const OPTIONS = [
  {key: 'settings', icon: 'settings', label: 'Account Settings'},
  {key: 'help', icon: 'help-outline', label: 'Help & Support'},
  {key: 'logout', icon: 'logout', label: 'Log Out'},
] as const;

export default function ProfileScreen() {
  const renderOption = ({item}: {item: (typeof OPTIONS)[number]}) => (
    <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
      <MaterialIcons
        name={item.icon}
        size={responsiveFontSize(2.5)}
        color={colors.primaryDark}
      />
      <Text style={styles.optionLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  const initials = user.name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primaryLight, colors.primaryDark]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </LinearGradient>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <MaterialIcons
            name="edit"
            size={responsiveFontSize(2.25)}
            color={colors.primary}
          />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <MaterialIcons
            name="settings"
            size={responsiveFontSize(2.25)}
            color={colors.primary}
          />
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={OPTIONS}
        keyExtractor={item => item.key}
        renderItem={renderOption}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        style={{flex: 1}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bgLight},
  header: {
    alignItems: 'center',
    paddingVertical: responsiveHeight(5),
    elevation: 4,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(2),
  },
  initials: {
    fontSize: responsiveFontSize(4),
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  name: {
    fontSize: responsiveFontSize(3),
    color: colors.white,
    fontFamily: fonts.semibold,
    marginBottom: responsiveHeight(0.5),
  },
  email: {
    fontSize: responsiveFontSize(2),
    color: colors.white,
    opacity: 0.9,
    fontFamily: fonts.regular,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: responsiveHeight(3),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: responsiveWidth(10),
    elevation: 2,
  },
  actionText: {
    marginLeft: responsiveWidth(2),
    color: colors.primary,
    fontFamily: fonts.medium,
    fontSize: responsiveFontSize(2),
  },
  list: {
    paddingHorizontal: (responsiveWidth(100) - CARD_WIDTH) / 2,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
  },
  optionLabel: {
    marginLeft: responsiveWidth(4),
    fontSize: responsiveFontSize(2.25),
    color: colors.primaryDark,
    fontFamily: fonts.regular,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eee',
    marginHorizontal: responsiveWidth(4),
  },
});
