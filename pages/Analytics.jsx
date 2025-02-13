import { useState } from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, FlatList, Pressable} from 'react-native';
import { iOSUIKit } from 'react-native-typography';
import Icon from 'react-native-vector-icons/MaterialIcons';
import defaultstyles from '../styles/default';
import { version } from '../global/globals';
import { useSessionState } from '../global/store';
import { CartesianChart, Line } from "victory-native";
import { useFont, matchFont } from "@shopify/react-native-skia";
import { Button as KtButton, Text as KtText, useTheme, Input } from '@ui-kitten/components';
import Modal from "react-native-modal";
import {Swipeable } from 'react-native-gesture-handler/Swipeable'; //Deprecated but this version works with the version of react native used
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


const TimeBlock = (props) => {
    let {time, currentObjTime} = props;
    let currentTheme = useTheme();
    let [showModal, setShowModal] = useState(false);

    let date = new Date(currentObjTime.date);

    function toggleModal() {
        setShowModal(!showModal);
    }

    function MoreTimeInfo() {
        return (
            <View style={[{ flex: 1 }]}>
                <Modal isVisible={showModal}>
                    <View style={[{ flex: 1 }, styles.ModalBox]}>
                        <View style={[{display: "flex", flexDirection: "row"}]}>
                            <Icon name="close" size={35} color={currentTheme["color-primary-500"]} style={[{marginTop: 35, marginLeft: 30}]} onPress={toggleModal}></Icon>
                            <KtText style={[iOSUIKit.largeTitleEmphasizedWhite, styles.header, {textAlign: "center"}]}>Details</KtText>
                        </View>
                        <View style={[{margin: 10}]}>
                            <KtText style={[iOSUIKit.largeTitleEmphasizedWhite, styles.statText, {color: currentTheme["color-primary-500"]}]}>DATE</KtText>
                            <KtText style={[defaultstyles.text, {fontWeight: "bold"}, {fontSize: 20}, {padding: 20}]}>{ date.toLocaleString() }</KtText>
                        </View>
                        <View style={[{margin: 10}]}>
                            <KtText style={[iOSUIKit.largeTitleEmphasizedWhite, styles.statText, {color: currentTheme["color-primary-500"]}]}>TIME</KtText>
                            <KtText style={[defaultstyles.text, {fontWeight: "bold"}, {fontSize: 20}, {padding: 20}]}>{ time }s</KtText>
                        </View>
                        <View style={[{margin: 10}]}>
                            <KtText style={[iOSUIKit.largeTitleEmphasizedWhite, styles.statText, {color: currentTheme["color-primary-500"]}]}>TYPE</KtText>
                            <KtText style={[defaultstyles.text, {fontWeight: "bold"}, {fontSize: 20}, {padding: 20}]}>{ currentObjTime.type }</KtText>
                        </View>
                        <View style={[{margin: 10}]}>
                            <KtText style={[iOSUIKit.largeTitleEmphasizedWhite, styles.statText, {color: currentTheme["color-primary-500"]}]}>SCRAMBLE</KtText>
                            <KtText style={[defaultstyles.text, {fontWeight: "bold"}, {fontSize: 20}, {padding: 20}]}>{ currentObjTime.scramble }</KtText>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    return (
        <Pressable onPress={toggleModal}>
            <SafeAreaView style={styles.container}>
                <MoreTimeInfo></MoreTimeInfo>
                <View style={[styles.header, styles.timesView]}>
                    <Text style={[{color: currentTheme["color-primary-500"], fontSize: 20, fontWeight: "bold", padding: 10, textAlign: "center"}]}>{ time }</Text>
                    <Text style={[{color: "#FFFFFF", fontSize: 10, fontWeight: "bold", padding: 10, textAlign: "center"}]}>{ date.toLocaleDateString() === (new Date(Date.now()).toLocaleDateString())? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : date.toLocaleDateString() }</Text>
                </View>
            </SafeAreaView>
        </Pressable>
    )
}

const SessionBlock = (props) => {
    let { name, currentObjSession } = props;
    let navigation = props.navigation;
    let currentTheme = useTheme();

    function renderRightSwipe() {
        console.log("Swipe")
        return (
            <RectButton>
                <View style={[styles.sessionBlock, {backgroundColor: "red"}]}>
                    <Text>You found me</Text>
                </View>
            </RectButton>
        )
    }

    let tempSession = new Session(currentObjSession.sessionID, currentObjSession.analytics.LyticsData.data, currentObjSession.name);


    return (
        <SafeAreaView style={styles.container}>
            <Swipeable containerStyle={styles.sessionBlock} renderRightActions={renderRightSwipe}>
                <Text style={[{color: currentTheme["color-primary-500"], fontSize: 20, fontWeight: "bold", padding: 10, textAlign: "left"}]}> { name.toUpperCase() } </Text>
                <View style={{display: "flex", flexDirection: "row"}}>
                    <Text style={[{color: currentTheme["color-primary-500"], fontSize: 15, fontWeight: "bold", padding: 10, textAlign: "left"}]}>SOLVES:</Text>
                    <Text style={[{color: "white", fontSize: 15, fontWeight: "bold", paddingTop: 10, textAlign: "left"}]}> { tempSession.analytics.solves() } </Text>
                </View>          
            </Swipeable>
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


    function sessionManagerClicked() {
        navigation.navigate("SessionManager");
    }

    function sessionCreationClicked() {
        navigation.navigate("SessionCreator");
    }

    function timesClicked() {
        navigation.navigate("Times");
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
                    { graphData.length < 2 ? (
                        <View style={[styles.TextErrCont]}>
                            <Text style={[{color: currentTheme["color-primary-500"]}, {textAlign: "center", fontWeight: "bold", fontSize: 25}]}>Not enough data to graph :(</Text>
                        </View>
                    ): (
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
                    )}
                </View>
                <SafeAreaView style={[styles.buttonTopCont]}>
                    <KtButton style={[{width: "45%"}, styles.tinyButtons]} onPress={timesClicked}>{evaProps => <View style={[styles.iconTextCont]}><Icon name="access-time" size={30} color={currentTheme["color-warning-100"]} style={[styles.subIcon]}></Icon><Text {...evaProps} style={[styles.buttonText, {paddingRight: 20}]}>Times</Text></View>}</KtButton>
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

    let sessions = db.getArray("sessions");

    let blocks = sessions.map((obj, i) => {
        return {...obj, key: i};
    });

    console.log(blocks);
    

    return (
        <View style={defaultstyles.main}>
            <AnalyticsNav navigation={navigation}></AnalyticsNav>
            <Text style={[iOSUIKit.largeTitleEmphasizedWhite, styles.header]}>Session Manager</Text>
            <FlatList
                    data={blocks}
                    numColumns={1}
                    horizontal={false}
                    renderItem={({item}) => <SessionBlock name={item.name} currentObjSession={item}></SessionBlock>}
            ></FlatList>
        </View>
    )
}


export const SessionCreator = (props) => {
    let navigation = props.navigation;
    let [name, setName] = useState("");
    let [status, setStatus] = useState("basic");
    let [placeholder, setPlaceHolder] = useState("Enter a name");


    //Database stuff
    let db = useSessionState((state) => state.db);
    let changeSessionsArray = useSessionState((state) => state.changeSessionsArray);

    let sessions = db.getArray("sessions");

     function createClicked() {
        let nextID = sessions.length + 1;

        let newSession = new Session(nextID, [], name);
        db.setArray("sessions", [...sessions, newSession]);
        sessions = db.getArray("sessions");
        changeSessionsArray(sessions);
        navigation.goBack();
     }

     function showError() {
        setName("");
        setStatus("warning");
        setPlaceHolder("Name must be under 11 characters");
     }

     function nameFn(v) {
        if(status !== "basic") setStatus("basic");
        setName(v);
        setPlaceHolder("Enter a name");
     }

    return (
        <View style={defaultstyles.main}>
            <AnalyticsNav navigation={navigation}></AnalyticsNav>
            <Text style={[iOSUIKit.largeTitleEmphasizedWhite, styles.header]}>Creator</Text>
            <Input style={[{margin: 10}, {width: "95%"}]} 
            placeholder={placeholder}
            size="large" 
            value={name} 
            status={status}
            onChangeText={(v) => {v.length > 10 ? showError(): nameFn(v)}}>
            </Input>
            <KtButton style={[{width: "95%"}, {margin: 10}]} onPress={createClicked}>{evaProps => <Text {...evaProps} style={styles.buttonText}>Create Session</Text>}</KtButton>
        </View>
    )
}


export const TimesViewer = (props) => {
    let navigation = props.navigation;

    //Database stuff
    let db = useSessionState((state) => state.db);
    let sessionID = useSessionState((state) => state.sessionID);
    let changeSessionID = useSessionState((state) => state.changeSessionID);

    let currentSession = db.getArray("sessions")[sessionID - 1];
    let sessionObj = new Session(currentSession.sessionID, currentSession.analytics.LyticsData.data, currentSession.name);
    
    console.log(sessionObj);

    let Grid = sessionObj.analytics.LyticsData.data.map((obj, i) => {
        return {...obj, key: i};
    });

    Grid = Grid.reverse();

    return (
        <View style={defaultstyles.main}>
            <AnalyticsNav navigation={navigation}></AnalyticsNav>
            <Text style={[iOSUIKit.largeTitleEmphasizedWhite, styles.header]}>Times for {sessionObj.name}</Text>
            <FlatList
                    data={Grid}
                    numColumns={3}
                    horizontal={false}
                    renderItem={({item}) => <TimeBlock key={item.key} time={(item.time/1000).toFixed(3)} currentObjTime={item}></TimeBlock>}
            >
            </FlatList>
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
    },
    TextErrCont: {
        display: "flex",
        justifyContent: "space-around",
        textAlign: "center"
    },
    timesView: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgb(53, 53, 53)",
        borderRadius: 10,
        height: 50,
        width: 80
    },
    ModalBox: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgb(53, 53, 53)",
        borderRadius: 10,
        height: 50,
    },
    sessionBlock: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgb(53, 53, 53)",
        borderRadius: 10,
        height: 150,
        width: "100%",
        marginTop: 20,
    }
});

export default Analytics;