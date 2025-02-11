import React from 'react';
import {default as defaultTheme } from './default.json';


//All themes here
export const themes = {
    defaultTheme,
};

//Theme Context
export const ThemeContext = React.createContext({
    name: 'defaultTheme',
    toggleTheme: () => {}
});