import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar ,Platform, ScrollView, Switch} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { iOSUIKit } from 'react-native-typography';

/* User imports */
import defaultstyles from '../styles/default';
import { version } from '../global/globals';


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

    return (
        <View style={defaultstyles.main}>
            <SettingsNav navigation={navigation}></SettingsNav>
            <Text style={[iOSUIKit.largeTitleEmphasizedWhite, styles.header]}>Settings</Text>
            <View style={styles.parentview}>
                <ScrollView style={styles.scrollview}>
                    <View style={[styles.settingsContainer]}>
                        <View style={[styles.settingsChild]}><Text style={defaultstyles.text}>General Settings</Text></View>
                        <View style={[styles.settingsChild]}><Text style={defaultstyles.text}>Cube Settings</Text></View>
                        <View style={[styles.settingsChild]}><Text style={defaultstyles.text}>Theme</Text></View>
                        <View style={[styles.settingsChild]}><Text style={defaultstyles.text}>Settings</Text></View>
                    </View>
                </ScrollView>
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
    scrollview: {
        width: "90%",
    },
    parentview: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    switch: {
        borderRadius: 20,
    },
    settingsContainer: {
       backgroundColor: "rgba(100, 100, 100, 0.3)",
       borderRadius: 20, 
    },
    settingsChild: {
        padding: 10,
        paddingTop: 15,
        paddingBottom: 15,
        borderTopWidth: 1,
        //backgroundColor: "rgba(52, 52, 52, 0.8)"
    }
})

export default Settings;