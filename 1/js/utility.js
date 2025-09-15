/**
 * COMP 4537 – Lab 1
 * Note app (utility.js)
 * purpose: it is created to define some helpers and Storage shared object
 * 
 * Note: Some parts of this code were developed with the assistance of ChatGPT.
 */

// Get element by id 
function $(id) {
    return document.getElementById(id);
}

// a helper to set text content
function setText(id, value) {
    const el = $(id);
    if (el !== null && value != null) {
        el.textContent = value;
    }
}

// Shared localStorage wrapper
const Storage = {
    KEY: "lab1_notes",
    LAST_KEY: "lab1_lastSaved",

    // to read from the localStorage
    read() {
        try {
            const raw = localStorage.getItem(this.KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Storage.read error:", e);
            return [];
        }
    },

    // to write to the localStorage
    write(notesArray) {
        try {
            localStorage.setItem(this.KEY, JSON.stringify(notesArray));
            localStorage.setItem(this.LAST_KEY, new Date().toLocaleString());
        } catch (e) {
            console.error("Storage.write error:", e);
        }
    },

    // to read last saved from the localStorage for the timestamp
    readLastSaved() {
        return localStorage.getItem(this.LAST_KEY) || "";
    }
};