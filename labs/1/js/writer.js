/**
 * COMP 4537 – Lab 1
 * Note app (writer.js)
 * purpose: 
 *  - to add, edit, delete and save notes
 * 
 * Note: Some parts of this code were developed with the assistance of ChatGPT.
 */

class Writer {
    constructor(containerEl) {
        this.container = containerEl;
        this.notes = [];
        this.counter = 1;
        this.timestampElement = $("timestamp");
        this.saveTimer = null;

    }

    queueSave(immediate = false) {
        if (immediate) {
            Storage.write(this.toJSON());
            this.updateSavedTS();
            return;
        }

        clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(() => {
            Storage.write(this.toJSON());
            this.updateSavedTS();
        }, 700);

    }

    addNote(initialText = "") {
        if (!this.container) {
            return null;
        }

        const id = `t_${Date.now()}_${Math.floor(Math.random() * 1e6)}`; // timestamp + random fallback
        const note = new Note(
            id,
            initialText,
            (removedId) => {
                this.removeNoteById(removedId);

                this.queueSave(true); // save on deletion
            }
        );

        this.notes.push(note);
        note.render(this.container);

        this.queueSave(true); // save immediately, will show new blank note in LocalStorage

        // focus the new text area
        note.textarea && note.textarea.focus();

        // keep autosave-on-typing
        note.textarea && note.textarea.addEventListener("input", () => this.queueSave(false));

        return note;
    }

    removeNoteById(id) {
        this.notes = this.notes.filter(n => n.id !== id);
    }

    updateSavedTS() {
        if (!this.timestampElement) {
            return;
        }

        const prefix = MESSAGES.timestamps?.savedPrefix || "Saved: ";
        this.timestampElement.textContent = prefix + new Date().toLocaleString();

    }

    // useful later when we add localStorage
    toJSON() {
        return this.notes.map(n => n.toJSON());
        // it will be in this form --> [{ id: "n1", text: "Hello" }, { id: "n2", text: "World" }]
    }
}


// run the DOM in writer.html
document.addEventListener("DOMContentLoaded", () => {
    const notesElement = $("notes");
    if (!notesElement) {
        return;
    }

    document.title = MESSAGES.pageTitles.writer;


    const addBtn = $("addNote");
    const saveBtn = $("saveNow");
    const timestamp = $("timestamp");

    setText("title", MESSAGES.pageTitles?.writer);
    setText("tagline", MESSAGES.taglines?.writerTagline);
    setText("addNote", MESSAGES.buttons?.addNote);
    setText("backLink", MESSAGES.buttons?.backButton);

    const w = new Writer(notesElement);
    Storage.read().forEach(o => w.addNote(o.text));

    if (timestamp && MESSAGES.timestamps) {
        const lastSaved = Storage.readLastSaved();
        const prefix = MESSAGES.timestamps?.savedPrefix || "Saved: ";
        const placeholder = MESSAGES.timestamps?.timestampPlaceholder || "—";

        timestamp.textContent = prefix + (lastSaved || placeholder);
        // If lastSaved is falsy (e.g., "", null, undefined, 0, false, NaN), it falls back to placeholder
    }


    if (addBtn) {
        addBtn.onclick = () => w.addNote("");
    }
    if (saveBtn) {
        saveBtn.onclick = () => {
            Storage.write(w.toJSON());
            w.updateSavedTS();
        }
    }

    setInterval(() => {
        Storage.write(w.toJSON());
        w.updateSavedTS();
    }, 2000);


})