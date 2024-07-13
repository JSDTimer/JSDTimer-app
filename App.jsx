import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as cubesrambler from "cube-scramble.js";

/* User imports */
import defaultstyles from './styles/default';
import Nav from './components/nav';
import NewCube from './components/CubeAppFinal';
import Timer from './components/timer';
import CubeDropdown from './components/dropdown';

/* Pages */
import Settings from './pages/settings';

var Stack = createNativeStackNavigator();

//Main page
const Main = (props) => {
  const [scramble, setScramble] = useState([]);
  let cubeOptions = ["3x3", "2x2", "4x4", "5x5", "6x6", "7x7", "Pyraminx", "Megaminx", "Skewb", "Clock"];
  let [currentCubeType, setCurrentCubeType] = useState("3x3");

  let navigation = props.navigation;
  let route = props.route;

  function changeCurrentCube(selectedItem, index) {
    setCurrentCubeType(cubeOptions[index]);
  }

  let scrambleText;

  if (scramble.length) {
    scrambleText = <Text style={[defaultstyles.text, style.scramble, { flex: 1 }]}>{scramble.join(" ")}</Text>;
  } else {
    scrambleText = <Text style={[defaultstyles.text, style.scramble, { flex: 1 }]}>NO SCRAMBLE</Text>;
  }

  // Function to generate new scramble on screen press
  const handleScreenPress = () => {
    setScramble(cubesrambler.scramble(currentCubeType));
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View style={[defaultstyles.main, style.container]}>
        <Nav navigation={navigation} />
        <Text style={[defaultstyles.text, style.Title]}>{currentCubeType}</Text>
        {scrambleText}
        <Timer scramble={scramble} />
        <NewCube scramble={scramble} nav={navigation} cubeType={currentCubeType} />
        <CubeDropdown cubeOptions={cubeOptions} onSelect={changeCurrentCube} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const style = StyleSheet.create({
  scramble: {
    textAlign: "center",
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    fontSize: 15,
    fontWeight: "bold"
  },
  Title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
    color: "#CC165A"
  },
  container: {
    flexDirection: "column"
  }
});

export default Main;
