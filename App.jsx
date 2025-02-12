import React, { useState } from 'react';
import { View, SafeAreaView ,Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import {NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, useTheme  } from '@ui-kitten/components';
import { themes, ThemeContext } from './Themes/themeManager';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as cubesrambler from "cube-scramble.js";

/* User imports */
import defaultstyles from './styles/default';
import Nav from './components/nav';
import NewCube from './components/CubeAppFinal';
import Timer from './components/timer';
import CubeDropdown from './components/dropdown';
import { navigationRef } from './global/rootNavigation';
import { useSessionState } from './global/store';
import { Session } from "./global/sessionsManager";

/* Pages */
import Settings from './pages/settings';
//@ts-ignore -weird bug from my IDE (remove this later if you want)
import Analytics from './pages/analytics';
//@ts-ignore
import { SessionManager } from './pages/analytics';
import { StorageSettings} from'./pages/settings';

var Stack = createNativeStackNavigator();

//Main page
const Main = (props) => {
  const [scramble, setScramble] = useState([]);
  let currentTheme = useTheme();
  let cubeOptions = ["3x3", "2x2", "4x4", "5x5", "6x6", "7x7", "Pyraminx", "Megaminx", "Skewb", "Clock"];
  let [currentCubeType, setCurrentCubeType] = useState("3x3");
  let db = useSessionState((state) => state.db);
  let sessionID = useSessionState((state) => state.sessionID);
  let ao5 = useSessionState((state) => state.ao5);

  let currentSession = db.getArray("sessions")[sessionID - 1];
  let sessionObj = new Session(currentSession.sessionID, currentSession.analytics.LyticsData.data, currentSession.name);

  let navigation = props.navigation;
  let route = props.route;

  function changeCurrentCube(_, index) {
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
    setScramble(cubesrambler.scramble(currentCubeType.toLowerCase()));
  };

  return (
      <SafeAreaView style={[defaultstyles.main, style.container]}>
        <Nav navigation={navigation} />
        <Text style={[defaultstyles.text, style.Title, {color: currentTheme["color-primary-500"]}]}>{currentCubeType}</Text>
        <TouchableWithoutFeedback onPress={handleScreenPress}>
          {scrambleText}
        </TouchableWithoutFeedback>
        <Timer scramble={scramble} />
        <NewCube scramble={scramble} nav={navigation} cubeType={currentCubeType} />
        <View style={[style.ButtonsContainer]}>
          <CubeDropdown cubeOptions={cubeOptions} onSelect={changeCurrentCube} />
        </View>
        <View style={[style.statsCont]}>
          <View style={[style.stats]}>
            <Text style={[style.statsTitle]}>AO5</Text>
            <Text style={[style.statsText]}>{ ao5.toFixed(3) != 0? ao5.toFixed(3): 0 }</Text>
          </View>
          <View style={[style.stats]}>
            <Text style={[style.statsTitle]}>MEAN</Text>
            <Text style={[style.statsText]}>-</Text>
          </View>
          <View style={[style.stats]}>
            <Text style={[style.statsTitle]}>BEST</Text>
            <Text style={[style.statsText]}>-</Text>
          </View>
          <View style={[style.stats]}>
            <Text style={[style.statsTitle]}>LAST</Text>
            <Text style={[style.statsText]}>{ sessionObj.analytics.last().toFixed(3) != 0? sessionObj.analytics.last().toFixed(3): 0 }</Text>
          </View>
        </View>
      </SafeAreaView>
  );
};

const App = () => {
  let [theme, setTheme] = useState("defaultTheme");
  //Database stuff
  let db = useSessionState((state) => state.db);

  //This method can be used when you import the ThemeContext in other components
  function toggleTheme(selectedTheme) {
    setTheme(selectedTheme);
  }

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <ApplicationProvider {...eva} theme={{...eva.dark, ...themes[theme]}}>
        <IconRegistry icons={EvaIconsPack}/>
        <SafeAreaView style={defaultstyles.main}>
          <NavigationContainer ref={navigationRef}>
              <Stack.Navigator>
                <Stack.Screen name="Main" component={Main} options={{headerShown:false}}></Stack.Screen>
                <Stack.Screen name="Analytics" component={Analytics} options={{headerShown:false}}></Stack.Screen>
                <Stack.Screen name="Settings" component={Settings} options={{headerShown:false}}></Stack.Screen>

                {/* Sub Pages for Settings */}
                <Stack.Screen name="StorageSettings" component={StorageSettings} options={{headerShown:false}}></Stack.Screen>

                {/* Sub Pages for Analytics */}
                <Stack.Screen name="SessionManager" component={SessionManager} options={{headerShown:false}}></Stack.Screen>
              </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </ApplicationProvider>
    </ThemeContext.Provider>
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
    paddingBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsCont: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgb(53, 53, 53)",
    margin: 30,
    height: 80,
    borderRadius: 10
  },
  stats: {
    margin: 10,
  },
  statsTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFFFFF"
  },
  statsText: {
    color: "#FFFFFF",
    textAlign: "center",
    paddingTop: 5,
  }
});

export default App;
