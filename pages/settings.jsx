import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar ,Platform, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { iOSUIKit } from 'react-native-typography'

/* User imports */
import defaultstyles from '../styles/default';


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
            <Icon name="arrow-back" size={35} color="#FFFFFF" style={styles.icon} onPress={() => { navigation.navigate("Main")}}></Icon>
        </SafeAreaView>
    )
}

const Settings = (props) => {
    let navigation = props.navigation;

    return (
        <View style={defaultstyles.main}>
            <SettingsNav navigation={navigation}></SettingsNav>
            <ScrollView>
                <Text style={[iOSUIKit.footnoteEmphasizedWhite, styles.header]}>THIS THE SETTINGS PAGE</Text>
            </ScrollView>
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
})

export default Settings;