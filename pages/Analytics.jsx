import {View, Text, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import { iOSUIKit } from 'react-native-typography';
import Icon from 'react-native-vector-icons/MaterialIcons';
import defaultstyles from '../styles/default';
import { version } from '../global/globals';
import { useSessionState } from '../global/store'


const AnalyticsNav = (props) => {
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


const Analytics = (props) => {
    let navigation = props.navigation;
    let db = useSessionState((state) => state.db);
    let sessionID = useSessionState((state) => state.sessionID);
    let changeSessionID = useSessionState((state) => state.changeSessionID);

    console.log(db.getArray("sessions"))

    return (
        <View style={defaultstyles.main}>
            <AnalyticsNav navigation={navigation}></AnalyticsNav>
            <Text style={[iOSUIKit.largeTitleEmphasizedWhite, styles.header]}>Give me Analytics</Text>
            <Text style={[styles.subText, styles.header]}>Version: { version }</Text>
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
    }
});

export default Analytics;