// screens/ProfileScreen.tsx
import React, {FC} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import fonts from '../config/fonts';
import colors from '../config/colors';

const {width} = Dimensions.get('window');
const AVATAR_SIZE = 100;
const CARD_WIDTH = width * 0.9;

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
    <TouchableOpacity style={styles.optionRow}>
      <MaterialIcons name={item.icon} size={24} color={colors.primaryDark} />
      <Text style={styles.optionLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primaryLight, colors.primaryDark]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>
            {user.name
              .split(' ')
              .map(p => p[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </LinearGradient>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="edit" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="settings" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={OPTIONS}
        keyExtractor={item => item.key}
        renderItem={renderOption}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bgLight},

  header: {
    alignItems: 'center',
    paddingVertical: 32,
    elevation: 4,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  initials: {
    fontSize: 36,
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  name: {
    fontSize: 22,
    color: colors.white,
    fontFamily: fonts.semibold,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    fontFamily: fonts.regular,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    elevation: 2,
  },
  actionText: {
    marginLeft: 8,
    color: colors.primary,
    fontFamily: fonts.medium,
    fontSize: 16,
  },

  list: {
    paddingHorizontal: (width - CARD_WIDTH) / 2,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionLabel: {
    marginLeft: 16,
    fontSize: 16,
    color: colors.primaryDark,
    fontFamily: fonts.regular,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});
