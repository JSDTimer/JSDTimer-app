import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import {NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as cubesrambler from "cube-scramble.js";

/* User imports */
import defaultstyles from './styles/default';
import Nav from './components/nav';
import NewCube from './components/CubeAppFinal';
import Timer from './components/timer';
import CubeDropdown from './components/dropdown';
import { navigationRef } from './global/rootNavigation';

/* Pages */
import Settings from './pages/settings';
import { StorageSettings} from'./pages/settings';

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
    scrambleText = <Text style={[defaultstyles.text, style.noScramble, { flex: 1 }]}>Click for a new scramble</Text>;
  }

  // Function to generate new scramble on screen press
  const handleScreenPress = () => {
    setScramble(cubesrambler.scramble(currentCubeType));
  };

  return (
      <View style={[defaultstyles.main, style.container]}>
        <Nav navigation={navigation} />
        <Text style={[defaultstyles.text, style.Title]}>{currentCubeType}</Text>
        <TouchableWithoutFeedback onPress={handleScreenPress}>
        {scrambleText}
        </TouchableWithoutFeedback>
        <Timer scramble={scramble} />
        <NewCube scramble={scramble} nav={navigation} cubeType={currentCubeType} />
        <View style={[style.ButtonsContainer]}>
          <CubeDropdown cubeOptions={cubeOptions} onSelect={changeCurrentCube} />
        </View>
      </View>
  );
};

const App = () => {

  return (
    <View style={defaultstyles.main}>
      <NavigationContainer ref={navigationRef}>
          <Stack.Navigator>
            <Stack.Screen name="Main" component={Main} options={{headerShown:false}}></Stack.Screen>
            <Stack.Screen name="Settings" component={Settings} options={{headerShown:false}}></Stack.Screen>
            <Stack.Screen name="StorageSettings" component={StorageSettings} options={{headerShown:false}}></Stack.Screen>
          </Stack.Navigator>
      </NavigationContainer>
    </View>
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
  noScramble: {
    color: "#262525",
    textAlign: "center",
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    fontSize: 15,
    fontWeight: "bold"
  },
  container: {
    flexDirection: "column"
  },
  ButtonsContainer: {
    paddingBottom: 80,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;
