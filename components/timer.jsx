import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { iOSUIKit } from 'react-native-typography'
import defaultstyles from '../styles/default';

const Timer = (props) => {
    let pressMethod = props.onPress
    return (
        <View>
            <Text style={[defaultstyles.h1, defaultstyles.text, iOSUIKit.largeTitleEmphasizedWhite, defaultstyles.header]} onPress={pressMethod}>0:00:00</Text>
        </View>
    )
}

export default Timer;