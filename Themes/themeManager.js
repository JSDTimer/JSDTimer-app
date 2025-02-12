import React from "react";
import {default as defaultTheme } from "./default.json";
import {default as blueThing } from "./bluething.json";


//All themes here
export const themes = {
    defaultTheme,
    blueThing
};

//Theme Context
export const ThemeContext = React.createContext({
    name: 'defaultTheme',
    toggleTheme: () => {}
});