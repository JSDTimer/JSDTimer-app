import { create } from "zustand";
import { create as dbCreate, MMKV } from "./database"


db = null;


export const useSessionState = create((set) => ({
    sessionID: 1,
    db: db,
    changeSessionID: (newID) => {
        return set((state) => ({sessionID: newID}))
    }
}))