//Contains Database Creation and Modification Functions
import { MMKVLoader } from "react-native-mmkv-storage";


//Default instance used for certain methods
export let MMKV = new MMKVLoader().initialize();

export function createSession() {
    
}

export function create(name) {
    return new MMKVLoader().withInstanceID(name).initialize();
}

export function clearEverything() {
    let ids = MMKV.getAllMMKVInstanceIDs();
    for(let i = 0; i < ids; i++) {
        let id = ids[i];
        let currentDB = new MMKVLoader().withInstanceID(id).initialize();
        currentDB.clearMemoryCache();
        currentDB.clearStore();
    }

    console.log(MMKV.getAllMMKVInstanceIDs())
    console.log(MMKV.getCurrentMMKVInstanceIDs())
}

export function addListeners(MMKV) {
    //Add Listeners to MMKV instance
}