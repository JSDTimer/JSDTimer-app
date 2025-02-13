import { create } from "zustand";
import { changelog as changelogStatic } from "./globals";
import { create as dbCreate } from "./database"
import { Session } from "./sessionsManager";


db = dbCreate("JSDStore");
let showChangelog = false;


//Check if sessionID already exists if not set it
if(!db.getInt("sessionID")) {
    db.setInt("sessionID", 1);
}

//Check if Sessions already exists in JSDStore Database
if(!db.getArray("sessions")) {
    //Session 1 is always the default session
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

let sessionsDB = db.getArray("sessions");
let sessionID = db.getInt("sessionID");

//Current selected session at start of app launch
let startSession = new Session(sessionsDB[sessionID - 1].sessionID, sessionsDB[sessionID - 1].analytics.LyticsData.data, sessionsDB[sessionID - 1].name);


export const useSessionState = create((set) => ({
    sessionID: sessionID,
    sessions: sessionsDB,
    db: db,
    //Analytics stuff
    ao5: startSession.analytics.ao5(),
    ao12: startSession.analytics.ao12(),
    mean: startSession.analytics.mean(),
    last: startSession.analytics.last(),
    solves: startSession.analytics.solves(),
    graphData: startSession.analytics.toGraphData(),
    bestSingle: startSession.analytics.bestSingle(),
    changeSessionID: (newID) => {
        return set((state) => ({sessionID: newID}))
    },
    changeSessionsArray: (newArray) => {
        return set((state) => ({sessions: newArray}))
    },

    //Analytics stuff
    updateAnalytics(s) {
        return set((state) => ({
            ao5: s.analytics.ao5(), 
            ao12: s.analytics.ao12(), 
            mean: s.analytics.mean() ,
            last: s.analytics.last(), 
            solves: s.analytics.solves(), 
            graphData: s.analytics.toGraphData(),
            bestSingle: s.analytics.bestSingle()
        }))
    },
}))