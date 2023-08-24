import React, {useState} from 'react';
import {View, Text, Image, ScrollView, TextInput, StyleSheet} from 'react-native';
import { iOSUIKit } from 'react-native-typography'
import * as cubesrambler from "cube-scramble.js"

/* User imports */
import defaultstyles from './styles/default';
import Nav from './components/nav';
import Cube from './components/cube'



const App = () => {
  const [scramble, setscramble] = useState(cubesrambler.scramble("3x3"))


  return (
    <View style={defaultstyles.main}>
      <Nav></Nav>
      <Text style={[defaultstyles.text, style.scramble]}>{scramble.join(" ")}</Text>
      <Text style={[defaultstyles.h1, defaultstyles.text, iOSUIKit.largeTitleEmphasize, defaultstyles.header]} onPress={() => setscramble(cubesrambler.scramble("3x3"))}>3:14:15</Text>
      <Cube scramble={scramble}></Cube>
    </View>
  );
};


const style = StyleSheet.create({
  scramble: {
    textAlign: "center",
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    fontSize: 15
  }
})

console.log(cubesrambler.scramble("3x3"))

export default App;
