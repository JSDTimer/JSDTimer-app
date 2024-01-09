import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { iOSUIKit } from 'react-native-typography'
import * as cubesrambler from "cube-scramble.js"

/* User imports */
import defaultstyles from './styles/default';
import { navigationRef } from './global/rootNavigation';
import Nav from './components/nav';
import Cube from './components/cube'
import Timer from './components/timer'


/* Pages */
import Settings from './pages/settings';



var Stack = createNativeStackNavigator();

//Main page
const Main = (props) => {
  const [scramble, setscramble] = useState(cubesrambler.scramble("3x3"))
  let [reset, setReset] = useState(false)

  let navigation = props.navigation;
  let route = props.route;

  return (
    <View style={[defaultstyles.main, style.container]}>
      <Nav navigation={navigation} funcr={setReset}></Nav>
      <Text style={[defaultstyles.text, style.scramble, {flex: 1}]}>{scramble.join(" ")}</Text>
      {/* <Timer onPress={() => setscramble(cubesrambler.scramble("3x3"))}></Timer> */}
      <Text style={[defaultstyles.h1, defaultstyles.text, iOSUIKit.largeTitleEmphasizedWhite, defaultstyles.header, {flex: 1}]} onPress={() => setscramble(cubesrambler.scramble("3x3"))}>0:00:00</Text>
      <Cube scramble={scramble} reset={reset} nav={navigation}></Cube>
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
    fontSize: 15
  },
  container: {
    flexDirection: "column"
  },
})


export default App;
