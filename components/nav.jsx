import React from 'react';
import {SafeAreaView ,StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Nav = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Icon name="menu" size={35} color="#FFFFFF" style={styles.icon}></Icon>
            <Icon name="settings" size={35} color="#FFFFFF" style={styles.icon}></Icon>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    icon: {
        margin: 30
    }
})

export default Nav;