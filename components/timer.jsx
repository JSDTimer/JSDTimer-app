import React, {useRef, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { iOSUIKit } from 'react-native-typography'
import defaultstyles from '../styles/default';

const Timer = (props) => {
    let pressMethod = props.onPress
    let milliSeconds= useRef(0);
    let seconds= useRef(0);
    let minutes = useRef(0);


    function format() {
        let final = "";
        let wML = Math.floor(milliSeconds.current).toString();
        let wS = Math.floor(seconds.current).toString();
        let wM = Math.floor(minutes.current).toString();

        //Minute
        final += wM;

        //Second 
        if(wS.length > 2) {
            final += ":" + wS;
        } else {
            wS = "0" + wS;
            final += ":" + wS;
        }
        //Milli
        if(wML.length > 2) {
            final += ":" + wML
        } else {
            wML = "0" + wML;
            final += ":" + wML;
        }

        return final;
    }

    setInterval(function() {
        milliSeconds.current = milliSeconds.current + 1
        seconds.current = milliSeconds.current / 1000
        minutes.current = seconds.current / 60
    }, 1000)
    
    useEffect(() => {
        milliSeconds.current = 0
        seconds.current = 0
        minutes.current = 0
    }, [props.scramble])

    return (
        <View>
            <Text style={[defaultstyles.h1, defaultstyles.text, iOSUIKit.largeTitleEmphasizedWhite, defaultstyles.header]}>{format()}</Text>
        </View>
    )
}

export default Timer;