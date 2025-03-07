import React from "react";
import {default as defaultTheme } from "./default.json";
import {default as blueThing } from "./bluething.json";
import {default as mightyRED } from "./MightyRED.json";
import {default as trueRED } from "./trueRED.json";
import {default as lovely } from "./lovely.json";


//All themes here
//to Generate new themes use https://colors.eva.design/?utm_campaign=eva_colors%20-%20home%20-%20kitten_docs&utm_source=ui_kitten&utm_medium=referral&utm_content=branding_article_link
//you could also just make your own themes by following the JSON format
export const themes = {
    defaultTheme,
    mightyRED,
    trueRED,
    "Blue Thing": blueThing,
    lovely,
};

//Theme Context
export const ThemeContext = React.createContext({
    name: 'defaultTheme',
    toggleTheme: () => {}
});