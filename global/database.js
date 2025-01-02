//Contains Database Creation and Modification Functions
import { MMKVLoader } from "react-native-mmkv-storage";


//Default instance used for certain methods
export let MMKV = new MMKVLoader().initialize();


export function create(name) {
    return new MMKVLoader().withInstanceID(name).initialize();
}

export function clearEverything() {
    let ids = MMKV.getAllMMKVInstanceIDs();

    for(let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let currentDB = new MMKVLoader().withInstanceID(id).initialize();
        currentDB.clearMemoryCache();
        currentDB.clearStore();
    }
}

export function clearAllSessions() {

}

export function addListeners(MMKV) {
    //Add Listeners to MMKV instance
}