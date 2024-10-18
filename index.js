/**
 * @format
 */

import {AppRegistry} from 'react-native';
import { createContext } from 'react';
import App from './App';
import {name as appName} from './app.json';
import { create } from "./global/database"

import * as cubesrambler from "cube-scramble.js"

AppRegistry.registerComponent(appName, () => App);
