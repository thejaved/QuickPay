import React, {FC, useCallback, useState, useRef} from 'react';

import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet, StatusBar, Animated} from 'react-native';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../config/colors';
import Header from '../components/Header';
import {Contact} from '../components/ContactCard';
import ContactsSection from '../components/ContactsSection';
import ExpenseCard, {ExpenseCardProps} from '../components/ExpenseCard';

interface Props {
  navigation: any;
}

const DashboardScreen: FC<Props> = ({navigation}) => {
  const scrollY = useRef<Animated.Value>(new Animated.Value(0)).current;
  const [contacts, setContacts] = useState<Contact[]>([]);

  const loadContacts = useCallback(() => {
    AsyncStorage.getItem('contacts')
      .then(raw => {
        if (raw) setContacts(JSON.parse(raw));
        else setContacts([]);
      })
      .catch(err => {
        console.warn('Failed to load contacts', err);
        setContacts([]);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [loadContacts]),
  );

  const renderExpense = useCallback(
    (
      title: string,
      icon: string,
      value: number,
      max: number,
      index: number,
    ) => {
      const props: ExpenseCardProps = {title, icon, value, max, index, scrollY};
      return <ExpenseCard key={title} {...props} />;
    },
    [scrollY],
  );

  return (
    <LinearGradient
      colors={[colors.bgLight, colors.bg]}
      style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <Header
        title="Dashboard"
        subtitle="Hello, Javed"
        onNotifications={() => navigation.navigate('Notifications')}
      />

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}>
        {renderExpense(
          'Expense Limit',
          'account-balance-wallet',
          10000,
          20000,
          0,
        )}
        {renderExpense(
          "This Month's Expense",
          'calendar-today',
          3450,
          10000,
          1,
        )}
        {renderExpense('Last 3 Months', 'date-range', 9200, 30000, 2)}

        <ContactsSection
          contacts={contacts}
          onViewAll={() => navigation.navigate('ContactScreen')}
          onPay={contact => navigation.navigate('PayScreen', {contact})}
        />

        <Animated.View style={{marginBottom: responsiveHeight(15)}} />
      </Animated.ScrollView>
    </LinearGradient>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {alignItems: 'center', paddingBottom: 40},
});
