import React from 'react';
import {View, Text, Image, ScrollView, TextInput, StyleSheet} from 'react-native';
import { iOSUIKit } from 'react-native-typography'

/* User imports */
import defaultstyles from './styles/default';
import Nav from './components/nav';

const App = () => {
  return (
    <View style={defaultstyles.main}>
      <Nav></Nav>
      <Text style={[defaultstyles.h1, defaultstyles.text, iOSUIKit.largeTitleEmphasize, defaultstyles.header]}>3:14:15</Text>
    </View>
  );
};

export default App;
