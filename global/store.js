import { create } from "zustand";
import { changelog as changelogStatic } from "./globals";
import { create as dbCreate } from "./database"
import { Session } from "./sessionsManager";


db = dbCreate("JSDStore");
let showChangelog = false;

//Check if Sessions already exists in JSDStore Database
if(!db.getArray("sessions")) {
    let defaultSession = new Session(1);
    db.setArray("sessions", [defaultSession]);
}

//Check if changelog already exists in the JSD Database
if(!db.getString("changelog")) {
    db.setString("changelog", changelogStatic);
    showChangelog = true;
} else {
    changelog = db.getString("changelog");

    //Compare both static and db changelog here to determine wether to show update
    if(!(changelogStatic === changelog)) {
        db.setString("changelog", changelogStatic);
        showChangelog = true;
    }
}


console.log(db.getArray("sessions"))


export const useSessionState = create((set) => ({
    sessionID: 1,
    sessions: db.getArray("sessions"),
    db: db,
    changeSessionID: (newID) => {
        return set((state) => ({sessionID: newID}))
    },
    changeSessionsArray: (newArray) => {
        return set((state) => ({sessions: newArray}))
    },
}))