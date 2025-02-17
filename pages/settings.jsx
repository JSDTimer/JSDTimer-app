import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar ,Platform, ScrollView, Pressable, Button, FlatList} from 'react-native';
import { Button as KtButton, Text as KtText, useTheme } from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { iOSUIKit } from 'react-native-typography';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

/* User imports */
import defaultstyles from '../styles/default';
import { version } from '../global/globals';
import { useSessionState } from '../global/store'
import { clearEverything } from '../global/database';
import { themes } from '../Themes/themeManager';


const SettingsNav = (props) => {
    let navigation = props.navigation;
    let currentTheme = useTheme();
    
    return (
        <SafeAreaView style={styles.container}>
        {Platform.OS === 'android' ? (
            <StatusBar
                animated={true}
                barStyle="dark-content"
                backgroundColor={defaultstyles.main.backgroundColor}
                hidden = {false}
                translucent={true}
            >
            </StatusBar>) :  
            <StatusBar
                animated={true}
                barStyle="dark-content"
                hidden = {false}
            >
            </StatusBar>}
            <Icon name="arrow-back" size={35} color={currentTheme["color-primary-500"]} style={styles.icon} onPress={() => { navigation.goBack()}}></Icon>
        </SafeAreaView>
    )
}

const Settings = (props) => {
    let [versionString, _] = useState(version);
    let navigation = props.navigation;
    let currentTheme = useTheme();

    function navigateToStorage() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate("StorageSettings");
    }

    function navigateToThemes() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate("Themes");
    }

    return (
        <View style={defaultstyles.main}>
            <SettingsNav navigation={navigation}></SettingsNav>
            <Text style={[iOSUIKit.largeTitleEmphasizedWhite, styles.header]}>Settings</Text>
            <View style={styles.parentview}>
                <ScrollView style={styles.scrollview}>
                    <View style={[styles.settingsContainer]}>
                        <Pressable onPress={navigateToThemes}><View style={[styles.settingsChild, styles.settingPressable]}><Icon name="animation" size={30} color={currentTheme["color-primary-500"]} style={styles.iconNext}></Icon><Text style={[defaultstyles.text, styles.settingsTitle]}>Themes</Text></View></Pressable>
                        <Pressable onPress={navigateToStorage}><View style={[styles.settingsChild, styles.settingPressable]}><Icon name="apps" size={30} color={currentTheme["color-primary-500"]} style={styles.iconNext}></Icon><Text style={[defaultstyles.text, styles.settingsTitle]}>Cube</Text></View></Pressable>
                        <Pressable onPress={navigateToStorage}><View style={[styles.settingsChild, styles.settingPressable]}><Icon name="backup-table" size={30} color={currentTheme["color-primary-500"]} style={styles.iconNext}></Icon><Text style={[defaultstyles.text, styles.settingsTitle]}>Storage</Text></View></Pressable>
                        <Pressable onPress={navigateToStorage}><View style={[styles.settingsChild, styles.settingPressable]}><Icon name="app-settings-alt" size={30} color={currentTheme["color-primary-500"]} style={styles.iconNext}></Icon><Text style={[defaultstyles.text, styles.settingsTitle]}>Settings</Text></View></Pressable>   
                    </View>
                </ScrollView>
            </View>
            <View style={[{display: "flex", flexDirection: "row", margin: 20, justifyContent: "center"}]}>
                <Text style={{color: "rgb(255, 255, 255)", textAlign: "center"}}>© </Text>
                <Text style={{color: currentTheme["color-primary-500"], textAlign: "center"}}>JSD </Text>
                <Text style={{color: "rgb(255, 255, 255)", textAlign: "center"}}>Timer</Text>
            </View>
        </View>
    )
}



export const StorageSettings = (props) => {
    let navigation = props.navigation;
    let db = useSessionState((state) => state.db);
    let changeSessionID = useSessionState((state) => state.changeSessionID);


    function clearStorage() {
        clearEverything();
    }


    return (
        <View style={defaultstyles.main}>
            <SettingsNav navigation={navigation}></SettingsNav>
            <View style={[styles.storageContainer, defaultstyles.main]}>
                <Text style={[defaultstyles.text, styles.settingsTitle, {marginBottom: 50}]}>Storage Settings</Text>
                <Pressable style={[styles.storageButton]} onPress={clearStorage}><Text style={[defaultstyles.text, styles.settingsTitle]}>Clear Storage</Text></Pressable>
            </View>
        </View>
    )
}

const ThemeBlock = (props) => {
    let { displayTheme } = props;
    let navigation = props.navigation;
    let db = useSessionState((state) => state.db);
    let theme = useSessionState((state) => state.theme);
    let changeTheme = useSessionState((state) => state.changeTheme);


    let currentThemeObj = themes[displayTheme];

    function blockPressed() {
        db.setString("Theme", displayTheme);
        changeTheme(displayTheme);
        navigation.navigate("Main");
    }

    return (
        <Pressable onPress={blockPressed}>
            <View style={[styles.themeBlock]}>
                <LinearGradient
                    colors={[currentThemeObj["color-primary-200"], currentThemeObj["color-primary-500"], currentThemeObj["color-primary-900"]]}
                    style={{padding: 35, alignItems: 'center', borderRadius: 40,}}
                >
                </LinearGradient>
                {/* Change this later make the styling better and more organized honestly change ALL THE STYLING FOR EVERY COMPONENT but later*/}
                <Text style={[defaultstyles.text, {fontSize: 25, fontWeight: "bold", padding: 20, color: theme === displayTheme ? "green": "white"}]}>{ displayTheme }</Text>
            </View>
        </Pressable>
    )
}

export const Themes = (props) => {
    let navigation = props.navigation;


    let data = Object.keys(themes);


    return (
        <View style={defaultstyles.main}>
            <SettingsNav navigation={navigation}></SettingsNav>
            <Text style={[defaultstyles.text, iOSUIKit.largeTitleEmphasizedWhite, {margin: 30}]}>Themes</Text>
            <FlatList
            data={data}
            numColumns={1}
            horizontal={false}
            renderItem={({item}) => <ThemeBlock navigation={navigation} displayTheme={item}></ThemeBlock>}
            ></FlatList>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    header: {
        margin: 30,
    },
    icon: {
        margin: 30,
        marginTop: 60
    },
    iconNext: {
        marginLeft: 10,
        marginRight: 10,
    },
    scrollview: {
        width: "90%",
    },
    parentview: {
        justifyContent: "center",
        alignItems: "center",
    },
    switch: {
        borderRadius: 20,
    },
    settingsContainer: {
       backgroundColor: "rgba(100, 100, 100, 0.3)",
       borderRadius: 15, 
    },
    settingsChild: {
        padding: 10,
        paddingTop: 15,
        paddingBottom: 15,
        borderTopWidth: 1,
        //backgroundColor: "rgba(52, 52, 52, 0.8)"
    },
    settingPressable: {
        flexDirection: "row"
    },
    settingsTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    settingsText: {
        fontSize: 15,
        fontWeight: "bold",
    },
    storageContainer: {
        flexDirection: "column",
        alignItems: "center"
    },
    storageButton: {
        alignItems: "center",
        margin: 30,
        justifyContent: "center",
        width: "50%",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: "red",
    },
    themeBlock: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "rgba(100, 100, 100, 0.3)",
        borderRadius: 10,
        height: "auto",
        width: "100%",
        marginTop: 10,
        padding: 20,
    },
})

export default Settings;