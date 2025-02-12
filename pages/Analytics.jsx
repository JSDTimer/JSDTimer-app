import { useState } from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar, Pressable} from 'react-native';
import { iOSUIKit } from 'react-native-typography';
import Icon from 'react-native-vector-icons/MaterialIcons';
import defaultstyles from '../styles/default';
import { version } from '../global/globals';
import { useSessionState } from '../global/store';
import { Button as KtButton, Text as KtText, useTheme } from '@ui-kitten/components';
import { Session } from "../global/sessionsManager";


const AnalyticsNav = (props) => {
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


const Analytics = (props) => {
    let navigation = props.navigation;

    //Database stuff
    let db = useSessionState((state) => state.db);
    let sessionID = useSessionState((state) => state.sessionID);
    let changeSessionID = useSessionState((state) => state.changeSessionID);


    let currentSession = db.getArray("sessions")[sessionID - 1];
    let sessionObj = new Session(currentSession.sessionID, currentSession.analytics.LyticsData.data, currentSession.name);
    // console.log(currentSession);


    console.log(sessionObj.analytics.ao5());

    function sessionManagerClicked() {
        navigation.navigate("SessionManager");
    }


    return (
        <View style={defaultstyles.main}>
            <AnalyticsNav navigation={navigation}></AnalyticsNav>
            <Text style={[iOSUIKit.largeTitleEmphasizedWhite, styles.header]}>Current Session: { sessionID == 1 ? "Default": sessionID }</Text>
            <KtText style={[iOSUIKit.largeTitleEmphasizedWhite, styles.bigStat ]}>AO5: { sessionObj.analytics.ao5().toFixed(3) }</KtText>
            <SafeAreaView style={[styles.buttonsCont]}>
                <KtButton style={{width: "90%"}}onPress={sessionManagerClicked}>{evaProps => <Text {...evaProps} style={styles.buttonText}>Session Manager</Text>}</KtButton>
            </SafeAreaView>      
            <Text style={[styles.subText, styles.header]}>Version: { version }</Text>
        </View>
    )
}



export const SessionManager = (props) => {
    let navigation = props.navigation;


    //Database stuff
    let db = useSessionState((state) => state.db);
    let sessionID = useSessionState((state) => state.sessionID);
    let changeSessionID = useSessionState((state) => state.changeSessionID);

    console.log(db.getArray("sessions"));

    return (
        <View style={defaultstyles.main}>
            <AnalyticsNav navigation={navigation}></AnalyticsNav>
            <Text>Session Manager</Text>

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
    subText: {
        fontSize: 20,
        color: "#262525"
    },
    button: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 15,
        borderRadius: 50,
        width: "50%"
    },
    buttonPressed: {
        backgroundColor: "#FFFF00"
    },
    buttonsCont: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        textAlign: "center",
        color: "#000000",
        fontWeight: "bold"
    },
    bigStat: {
        margin: 20,
    }
});

export default Analytics;