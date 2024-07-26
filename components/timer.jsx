import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { iOSUIKit } from 'react-native-typography';
import defaultstyles from '../styles/default';

const Timer = (props) => {
    let pressMethod = props.onPress;
    let [timerStarted, setTimerStarted] = useState(false);
    let timerStartedForUseEffect = useRef(false);
    let startTime = useRef(0);
    let elapsed = useRef(0);
    let [formatted, setFormatted] = useState("0:00.0");

    function TimerControl() {
        if (timerStartedForUseEffect.current) {
            // Stop the timer
            elapsed.current += Date.now() - startTime.current;
        } else {
            // Start the timer
            startTime.current = Date.now();
        }
        timerStartedForUseEffect.current = !timerStartedForUseEffect.current;
        setTimerStarted(!timerStarted);
    }

    function format(milliseconds) {
        let totalSeconds = Math.floor(milliseconds / 1000);
        let wML = Math.floor((milliseconds % 1000) / 100).toString();
        let wS = (totalSeconds % 60).toString();
        let wM = Math.floor(totalSeconds / 60).toString();



        if (wS.length < 2) {
            wS = wS;
        }
        if (wML.length < 1) {
            wML = "0" + wML;
        }

        if (wM.charAt(0) == '0') {
            return wS + "." + wML;
        } else if (wS.length == 1){
            return wM + ":" + "0" + wS + "." + wML;
        } else {
            return wM + ":" + + wS + "." + wML;
        }
    }

    useEffect(() => {
        let id = setInterval(() => {
            if (timerStartedForUseEffect.current) {
                let currentTime = Date.now();
                let timeDiff = currentTime - startTime.current + elapsed.current;
                setFormatted(format(timeDiff));
            }
        }, 100); // 100 milliseconds interval

        return () => clearInterval(id); // Cleanup interval on component unmount
    }, []);

    useEffect(() => {
        startTime.current = 0;
        elapsed.current = 0;
        timerStartedForUseEffect.current = false;
        setFormatted("0.0");
    }, [props.scramble]);

    return (
        <View>
            <Text
                style={[
                    defaultstyles.h1,
                    defaultstyles.text,
                    iOSUIKit.largeTitleEmphasizedWhite,
                    styles.timerStyle
                ]}
                onPress={() => { TimerControl(); pressMethod && pressMethod(); }}
            >
                {formatted}
            </Text>
        </View>
    );
};

let styles = StyleSheet.create({
    timerStyle: {
        textAlign: 'center',
    }
});

export default Timer;

