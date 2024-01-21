import React  from "react";
import {Text, Pressable, StyleSheet } from "react-native"

const JSDButton = (props) => {

    return (
    <Pressable style={style.button}  android_ripple={{color: "#CC165A"}} onPress={props.onPress}>
        <Text style={style.text}>{ props.text }</Text>
    </Pressable>
    )
}


const style = new StyleSheet.create({
    text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    button: {
        backgroundColor: "#000000",
        paddingVertical: 15
    }
})

export default JSDButton;