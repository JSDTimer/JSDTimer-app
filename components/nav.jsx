import React from 'react';
import {SafeAreaView ,StyleSheet ,StatusBar ,Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import defaultstyles from '../styles/default';


const Nav = (props) => {
    let navigation = props.navigation;

    function startNavigation(location) {
        setReset(true)
        navigation.navigate("Settings")
    }

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
            <Icon name="menu" size={35} color="#FFFFFF" style={styles.icon}></Icon>
            <Icon name="settings" size={35} color="#FFFFFF" style={styles.icon} onPress={startNavigation}></Icon>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    icon: {
        margin: 30,
        marginTop: 60
    },
})

export default Nav;