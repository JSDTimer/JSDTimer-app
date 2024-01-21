import React, {useRef, useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { iOSUIKit } from 'react-native-typography'
import defaultstyles from '../styles/default';

const Timer = (props) => {
    let pressMethod = props.onPress
    let milliSeconds= useRef(0);
    let seconds= useRef(0);
    let minutes = useRef(0);
    let [timerStarted, setTimerStarted] = useState(false);
    let timerStartedForUseEffect = useRef(false)


    let [formatte, setFormatte] = useState(format())

    function TimerControl() {
        timerStartedForUseEffect.current = !timerStartedForUseEffect.current;
        console.log(timerStartedForUseEffect.current)
    }

    function format() {
        let final = "";
        let wML = Math.floor(milliSeconds.current).toString();
        let wS = Math.floor(seconds.current).toString();
        let wM = Math.floor(minutes.current).toString();

        //Minute
        final += wM;

        //Second 
        if(wS.length >= 2) {
            final += ":" + wS;
        } else {
            wS = "0" + wS;
            final += ":" + wS;
        }
        //Milli
        if(wML.length >= 2) {
            final += ":" + wML
        } else {
            wML = "0" + wML;
            final += ":" + wML;
        }

        return final;
    }


    let id = setInterval(() => {
        clearInterval(id)

        if(timerStartedForUseEffect.current) {
            milliSeconds.current = milliSeconds.current + 1;
        
            if(milliSeconds.current > 99) {
                seconds.current += 1;
                milliSeconds.current = 0;
            }

            if(seconds.current > 60) {
                minutes.current += 1
                seconds.current = 0;
            }
        }

        setFormatte(format())
    }, 0.001)
    
    useEffect(() => {
        milliSeconds.current = 0
        seconds.current = 0
        minutes.current = 0
        timerStartedForUseEffect.current = false
    }, [props.scramble])

    return (
        <View>
            <Text style={[defaultstyles.h1, defaultstyles.text, iOSUIKit.largeTitleEmphasizedWhite, defaultstyles.header]} onPress={() => { TimerControl(); setTimerStarted(!timerStarted) }}>{formatte}</Text>
        </View>
    )
}

export default Timer;