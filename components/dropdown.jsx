import SelectDropdown from 'react-native-select-dropdown'
import React, { useState } from "react"
import Icon from 'react-native-vector-icons/FontAwesome5';
import {StyleSheet} from "react-native"

const CubeDropdown = (props) => {
    let [cubeOptions, setCubeOptions ] = useState(props.cubeOptions);
    let selectFunction = props.onSelect;

    function renderDropIcon() {
        return <Icon name="angle-down" size={20} color="#FFFFFF" style={style.dropDownIconStyle}></Icon>
    }
    return (
        <SelectDropdown data={cubeOptions} defaultButtonText="Select an Option..." buttonStyle={style.button} buttonTextStyle={style.text} dropdownStyle={style.dropDownStyle} renderDropdownIcon={renderDropIcon} dropdownIconPosition='right' onSelect={selectFunction}></SelectDropdown>
    )
}

const style = new StyleSheet.create({
    button: {
        backgroundColor: "#000000",
        paddingVertical: 15,
        width: "100%",
        borderBottomColor: "white",
        borderTopColor: "white",
        borderTopWidth: 0.2,
        borderBottomWidth: 0.2,
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        padding: 0
    },
    dropDownIconStyle: {
        //If you need to change anything with the Icon
        paddingLeft: 0
    }
})
export default CubeDropdown;