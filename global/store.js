import { create } from "zustand";
import { create as dbCreate } from "./database"
import { Session } from "./sessionsManager";


db = dbCreate("JSDStore");


if(!db.getArray("sessions")) {
    let defaultSession = new Session(1);
    db.setArray("sessions", [defaultSession]);
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