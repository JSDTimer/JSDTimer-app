import { useState } from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView} from 'react-native';
import { iOSUIKit } from 'react-native-typography';
import Icon from 'react-native-vector-icons/MaterialIcons';
import defaultstyles from '../styles/default';
import { version } from '../global/globals';
import { useSessionState } from '../global/store';
import { CartesianChart, Line } from "victory-native";
import { useFont, matchFont } from "@shopify/react-native-skia";
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
    let currentTheme = useTheme();

    //Database stuff
    let db = useSessionState((state) => state.db);
    let sessionID = useSessionState((state) => state.sessionID);
    let changeSessionID = useSessionState((state) => state.changeSessionID);
    let ao5 = useSessionState((state) => state.ao5);
    let ao12 = useSessionState((state) => state.ao12);
    let mean = useSessionState((state) => state.mean);
    let solves = useSessionState((state) => state.solves);
    let graphData = useSessionState((state) => state.graphData);


    let currentSession = db.getArray("sessions")[sessionID - 1];
    let sessionObj = new Session(currentSession.sessionID, currentSession.analytics.LyticsData.data, currentSession.name);

    //Replace this later with useFont
    let fontFamily = Platform.select({ ios: "Helvetica", default: "sans-serif" });

    let fontStyle = {
        fontFamily,
        fontSize: 15,
        fontWeight: "bold",
      };
    let font = matchFont(fontStyle);


    console.log(graphData);

    function sessionManagerClicked() {
        navigation.navigate("SessionManager");
    }

    function sessionCreationClicked() {
        navigation.navigate("SessionCreator");
    }


    return (
        <View style={defaultstyles.main}>
            <AnalyticsNav navigation={navigation}></AnalyticsNav>
            <Text style={[iOSUIKit.largeTitleEmphasizedWhite, styles.header]}>Current Session: { sessionID == 1 ? "Default": sessionID }</Text>
            <ScrollView>
                <View style={[{display: "flex", flexDirection: "row"}]}>
                    <View style={[styles.basicStats, {width: "45%"}]}>
                        <View style={[styles.section]}>
                            <KtText style={[iOSUIKit.largeTitleEmphasizedWhite, styles.statText, {color: currentTheme["color-primary-500"]}]}>AO5</KtText>
                            <KtText style={[iOSUIKit.largeTitleEmphasizedWhite, styles.statText]}>{ ao5.toFixed(3) != 0? ao5.toFixed(3): "-" }</KtText>
                        </View>
                        <View style={[styles.section]}>
                            <KtText style={[iOSUIKit.largeTitleEmphasizedWhite, styles.statText, {color: currentTheme["color-primary-500"]}]}>AO12</KtText>
                            <KtText style={[iOSUIKit.largeTitleEmphasizedWhite, styles.statText]}>{ ao12.toFixed(3) != 0? ao12.toFixed(3): "-" }</KtText>
                        </View>
                    </View>
                    <View style={[styles.basicStats, {width: "45%"}]}>
                        <View style={[styles.section]}>
                            <KtText style={[iOSUIKit.largeTitleEmphasizedWhite, styles.statText, {color: currentTheme["color-primary-500"]}]}>MEAN</KtText>
                            <KtText style={[iOSUIKit.largeTitleEmphasizedWhite, styles.statText]}>{ mean.toFixed(3) != 0? mean.toFixed(3): "-" }</KtText>
                        </View>
                        <View style={[styles.section]}>
                            <KtText style={[iOSUIKit.largeTitleEmphasizedWhite, styles.statText, {color: currentTheme["color-primary-500"]}]}>SOLVES</KtText>
                            <KtText style={[iOSUIKit.largeTitleEmphasizedWhite, styles.statText]}>{ solves.toFixed() != 0? solves.toFixed(): "-" }</KtText>
                        </View>
                    </View>
                </View>
                <View style={styles.graphCont}>
                    <CartesianChart data={graphData} 
                    xKey="solveNum"  
                    yKeys={["time"]} 
                    padding={10} 
                    xAxis={{font: font, labelColor: "#FFFFFF"}} 
                    yAxis={[{yKeys: ["time"], font: font, labelColor: "#FFFFFF"}]} 
                    frame={{lineColor: currentTheme["color-primary-500"], lineWidth: {left: 1, bottom: 1, top: 0, right: 0}}}
                    domainPadding={10}
                    >
                        {({points}) => (
                            <Line points={points.time} color={currentTheme["color-primary-500"]} strokeWidth={5} curveType="natural"></Line>
                        )}
                    </CartesianChart>
                </View>
                <SafeAreaView style={[styles.buttonTopCont]}>
                    <KtButton style={[{width: "45%"}, styles.tinyButtons]}>{evaProps => <View style={[styles.iconTextCont]}><Icon name="access-time" size={30} color={currentTheme["color-warning-100"]} style={[styles.subIcon]}></Icon><Text {...evaProps} style={[styles.buttonText, {paddingRight: 20}]}>Times</Text></View>}</KtButton>
                    <KtButton style={[{width: "45%"}, styles.tinyButtons]} onPress={sessionCreationClicked}>{evaProps => <View style={[styles.iconTextCont]}><Icon name="add" size={30} color={currentTheme["color-warning-100"]} style={[styles.subIcon]}></Icon><Text {...evaProps} style={[styles.buttonText, {paddingRight: 20}]}>New Session</Text></View>}</KtButton>
                </SafeAreaView>
                <SafeAreaView style={[styles.buttonsCont]}>
                    <KtButton style={{width: "95%"}} onPress={sessionManagerClicked}>{evaProps => <Text {...evaProps} style={styles.buttonText}>Session Manager</Text>}</KtButton>
                </SafeAreaView>      
                <Text style={[styles.subText, styles.header]}>Version: { version }</Text>
            </ScrollView>
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
            <Text style={[iOSUIKit.largeTitleEmphasizedWhite, styles.header]}>Session Manager</Text>
        </View>
    )
}


export const SessionCreator = (props) => {
    let navigation = props.navigation;


    //Database stuff
    let db = useSessionState((state) => state.db);
    let sessionID = useSessionState((state) => state.sessionID);
    let changeSessionID = useSessionState((state) => state.changeSessionID);

    console.log(db.getArray("sessions"));

    return (
        <View style={defaultstyles.main}>
            <AnalyticsNav navigation={navigation}></AnalyticsNav>
            <Text style={[iOSUIKit.largeTitleEmphasizedWhite, styles.header]}>Creator</Text>
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
    subIcon: {
        margin: 10,
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
    buttonTopCont: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    buttonText: {
        textAlign: "center",
        color: "#000000",
        fontWeight: "bold"
    },
    bigStat: {
        margin: 20,
    },
    tinyButtons: {
        margin: 10,
        marginBottom: 20,
    },
    iconTextCont: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    basicStats: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: "rgb(53, 53, 53)",
        margin: 10,
        height: 200,
        borderRadius: 10
    },
    statText: {
        marginLeft: 20,
        marginRight: 20,
    },
    graphCont: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: "rgb(53, 53, 53)",
        margin: 10,
        borderRadius: 10,
        height: 400
    }
});

export default Analytics;