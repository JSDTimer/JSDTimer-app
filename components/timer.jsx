import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { iOSUIKit } from 'react-native-typography';
import defaultstyles from '../styles/default';
import { useSessionState } from '../global/store'
import { Data, Session } from "../global/sessionsManager";
import * as Haptics from 'expo-haptics';

const Timer = (props) => {
    let pressMethod = props.onPress;
    let scramble = props.scramble;
    let type = props.type;
    let [timerStarted, setTimerStarted] = useState(false);
    let timerStartedForUseEffect = useRef(false);
    let startTime = useRef(0);
    let elapsed = useRef(0);
    let [formatted, setFormatted] = useState("0:00.0");
    let [isPressed, setIsPressed] = useState(false);
    let [longPressed, setLongPressed] = useState(false);

    //DB 
    let db = useSessionState((state) => state.db);
    let sessionID = useSessionState((state) => state.sessionID);
    let sessions = useSessionState((state) => state.sessions);
    let updateAnalytics = useSessionState((state) => state.updateAnalytics);
    let changeSessionID = useSessionState((state) => state.changeSessionID);
    let changeSessionsArray = useSessionState((state) => state.changeSessionsArray);

    //Timer controller, controlling stop and start times
    function TimerControl() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (timerStartedForUseEffect.current) {
            // Stop the timer
            elapsed.current += Date.now() - startTime.current;

            //Store time
            if(elapsed.current != 0) {
                let data = new Data(elapsed.current, Date.now(), props.type, props.scramble.length == 0 ? "NO SCRAMBLE": props.scramble);
    
                //Get the current session
                let currentSession = sessions[sessionID - 1];
                let tempSessionObject = new Session(currentSession.sessionID, currentSession.analytics.LyticsData.data, currentSession.name);
                tempSessionObject.analytics.LyticsData.push(data);
    
                console.log(tempSessionObject.analytics.LyticsData)
                db.setArray("sessions", sessions);

                //Change Analytics stuff
                updateAnalytics(tempSessionObject);
            }
        } else {
            if(elapsed.current != 0) {
                elapsed.current = 0;
            }
            // Start the timer
            startTime.current = Date.now();
        }
        timerStartedForUseEffect.current = !timerStartedForUseEffect.current;
        setTimerStarted(!timerStarted);
    }

    /*Function to format the timer in terms of milliseconds*/
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
                    styles.timerStyle,
                    {
                        color: isPressed ?  longPressed &&  !timerStartedForUseEffect.current ? "green" : "red": "white"
                    },
                ]}
                onLongPress={() => {pressMethod && pressMethod(); setLongPressed(true);}}
                onPressIn={() => {setIsPressed(true); timerStartedForUseEffect.current && TimerControl();}}
                onPressOut={() => {setIsPressed(false); setLongPressed(false); longPressed && TimerControl();}}
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

