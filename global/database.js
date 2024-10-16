//Contains Database Creation and Modification Functions
import { MMKVLoader } from "react-native-mmkv-storage";


export function createSession() {
    
}

export function create(name) {
    return new MMKVLoader().withInstanceID(name).initialize();
}

export function addListeners(MMKV) {
    //Add Listeners to MMKV instance
}