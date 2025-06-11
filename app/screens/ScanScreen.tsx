import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

import colors from '../config/colors';
import Header from '../components/Header';

const ScanScreen: FC<any> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.text}>Camera temporarily disabled</Text>
      </View>
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  placeholder: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  text: {
    color: colors.white,
    fontSize: responsiveFontSize(2.5),
    textAlign: 'center',
  },
});
