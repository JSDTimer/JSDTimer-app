import React  from "react";
import {Text, Presable, StyleSheet } from "react-native"

const JSDButton = (props) => {

    return (
    <Presable>
        <Text>{ props.text }</Text>
    </Presable>
    )
}

export default JSDButton;