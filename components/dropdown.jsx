import SelectDropdown from 'react-native-select-dropdown'
import React, { useState } from "react"
import Icon from 'react-native-vector-icons/FontAwesome5';
import {StyleSheet} from "react-native";
import { useTheme } from '@ui-kitten/components';

const CubeDropdown = (props) => {
    let [cubeOptions, setCubeOptions ] = useState(props.cubeOptions);
    let selectFunction = props.onSelect;
    let currentTheme = useTheme();

    function renderDropIcon() {
        return <Icon name="angle-down" size={20} color="#FFFFFF" style={style.dropDownIconStyle}></Icon>
    }
    
    return (
        <SelectDropdown data={cubeOptions} defaultButtonText="Cube Type..." buttonStyle={[style.button, {backgroundColor: currentTheme["color-primary-500"]}]} buttonTextStyle={style.text} dropdownStyle={style.dropDownStyle} renderDropdownIcon={renderDropIcon} dropdownIconPosition='right' onSelect={selectFunction}></SelectDropdown>
    )
}

const style = new StyleSheet.create({
    button: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 15,
        borderRadius: 10,
        width: "50%",
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
        textAlign: "center",
        padding: 0
    },
    dropDownIconStyle: {
        //If you need to change anything with the Icon
        color: "black",
        paddingLeft: 0,
    }
})
export default CubeDropdown;