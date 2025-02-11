import React from 'react';
import {SafeAreaView ,StyleSheet ,StatusBar ,Platform} from 'react-native';
import { useTheme } from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/Ionicons';
import defaultstyles from '../styles/default';


const Nav = (props) => {
    let navigation = props.navigation;
    let currentTheme = useTheme();

    function startNavigationSet() {
        navigation.navigate("Settings")
    }

    function startNavigationAn() {
        navigation.navigate("Analytics")
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
            <Icon name="trending-up" size={35} color={currentTheme["color-primary-500"]} style={styles.icon} onPress={startNavigationAn}></Icon>
            <Icon name="settings" size={35} color={currentTheme["color-primary-500"]} style={styles.icon} onPress={startNavigationSet}></Icon>
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