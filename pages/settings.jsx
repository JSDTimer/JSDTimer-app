import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar ,Platform, ScrollView, Pressable, Button} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { iOSUIKit } from 'react-native-typography';

/* User imports */
import defaultstyles from '../styles/default';
import { version } from '../global/globals';
import { useSessionState } from '../global/store'
import { clearEverything } from '../global/database';


const SettingsNav = (props) => {
    let navigation = props.navigation;

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
            <Icon name="arrow-back" size={35} color="#CC165A" style={styles.icon} onPress={() => { navigation.goBack()}}></Icon>
        </SafeAreaView>
    )
}

const Settings = (props) => {
    let [versionString, _] = useState(version);
    let navigation = props.navigation;

    function navigateToStorage() {
        navigation.navigate("StorageSettings");
    }

    return (
        <View style={defaultstyles.main}>
            <SettingsNav navigation={navigation}></SettingsNav>
            <Text style={[iOSUIKit.largeTitleEmphasizedWhite, styles.header]}>Settings</Text>
            <View style={styles.parentview}>
                <ScrollView style={styles.scrollview}>
                    <View style={[styles.settingsContainer]}>
                        <Pressable onPress={navigateToStorage}><View style={[styles.settingsChild, styles.settingPressable]}><Icon name="animation" size={30} color="#CC165A" style={styles.iconNext}></Icon><Text style={[defaultstyles.text, styles.settingsTitle]}>Themes</Text></View></Pressable>
                        <Pressable onPress={navigateToStorage}><View style={[styles.settingsChild, styles.settingPressable]}><Icon name="apps" size={30} color="#CC165A" style={styles.iconNext}></Icon><Text style={[defaultstyles.text, styles.settingsTitle]}>Cube</Text></View></Pressable>
                        <Pressable onPress={navigateToStorage}><View style={[styles.settingsChild, styles.settingPressable]}><Icon name="backup-table" size={30} color="#CC165A" style={styles.iconNext}></Icon><Text style={[defaultstyles.text, styles.settingsTitle]}>Storage</Text></View></Pressable>
                        <Pressable onPress={navigateToStorage}><View style={[styles.settingsChild, styles.settingPressable]}><Icon name="app-settings-alt" size={30} color="#CC165A" style={styles.iconNext}></Icon><Text style={[defaultstyles.text, styles.settingsTitle]}>Settings</Text></View></Pressable>
                    </View>
                </ScrollView>
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
    }
})

export default Settings;