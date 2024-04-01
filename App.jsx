import React, {useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as cubesrambler from "cube-scramble.js"

/* User imports */
import defaultstyles from './styles/default';
import { navigationRef } from './global/rootNavigation';
import Nav from './components/nav';
import NewCube from './components/CubeAppFinal'
import Timer from './components/timer'
import JSDButton from './components/JSDButton';
import CubeDropdown from './components/dropdown';


/* Pages */
import Settings from './pages/settings';



var Stack = createNativeStackNavigator();

//Main page
const Main = (props) => {
  const [scramble, setscramble] = useState([])
  let [reset, setReset] = useState(false)
  let cubeOptions = ["3x3", "2x2", "4x4", "5x5", "6x6", "7x7", "Pyraminx", "Megaminx", "Skewb", "Clock"]
  let [currentCubeType, setCurrentCubeType] = useState("3x3");

  let navigation = props.navigation;
  let route = props.route;

  function changeCurrentCube(selectedItem, index) {
    setCurrentCubeType(cubeOptions[index])
  }

  let scrambleText;

  if(scramble.length) {
    scrambleText = <Text style={[defaultstyles.text, style.scramble, {flex: 1}]}>{scramble.join(" ")}</Text>
  } else {
    scrambleText = <Text style={[defaultstyles.text, style.scramble, {flex: 1}]}>NO SCRAMBLE</Text>
  }

  return (
    <View style={[defaultstyles.main, style.container]}>
      <Nav navigation={navigation} ></Nav>
      <Text style={[defaultstyles.text, style.Title]}>{currentCubeType}</Text>
      {scrambleText}
      <Timer scramble={scramble}></Timer>
      <NewCube scramble={scramble} reset={reset} nav={navigation} cubeType={currentCubeType}></NewCube>
      <CubeDropdown cubeOptions={cubeOptions} onSelect={changeCurrentCube}></CubeDropdown>
      <JSDButton onPress={() => setscramble(cubesrambler.scramble(currentCubeType))} text="New Scramble 🎉"></JSDButton>
    </View>
  )
}




const App = () => {
  return (
    <View style={defaultstyles.main}>
      <NavigationContainer ref={navigationRef}>
          <Stack.Navigator>
            <Stack.Screen name="Main" component={Main} options={{headerShown:false}}></Stack.Screen>
            <Stack.Screen name="Settings" component={Settings} options={{headerShown:false}}></Stack.Screen>
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
  container: {
    flexDirection: "column"
  },
})


export default App;
