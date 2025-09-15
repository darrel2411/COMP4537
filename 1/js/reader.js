/**
 * COMP 4537 – Lab 1
 * Note app (reader.js)
 * purpose: To render notes to the page
 * 
 * Note: Some parts of this code were developed with the assistance of ChatGPT.
 */

// Shows a read-only list of notes in a container.
class Reader {
    constructor(containerEl) {
        this.container = containerEl;
        this.timestampElement = $("timestamp");
    }

    // notes: array of { id, text }
    renderList(notes) {
        if (!this.container) return;

        // clear current UI
        this.container.innerHTML = "";

        const emptyText = (MESSAGES.reader && MESSAGES.reader.emptyReader) || "- No notes available -";

        // empty state
        if (!Array.isArray(notes) || notes.length === 0) {
            const empty = document.createElement("div");
            empty.textContent = emptyText;
            this.container.appendChild(empty);
            return;
        }

        // render each note
        notes.forEach((n) => {

            // this is for the card box
            const card = document.createElement("div");
            card.className = "card shadow-sm w-100";
            card.style.maxWidth = "640px"

            // this is for the 
            const body = document.createElement("div")
            body.className = "card-body";

            const pre = document.createElement("pre")
            pre.className = "mb-0";
            pre.style.whiteSpace = "pre-wrap";
            pre.textContent = n.text || "";

            body.appendChild(pre);
            card.append(body);
            this.container.appendChild(card);

        });
    }

    updateRetrievedTS() {
        if (!this.timestampElement) return;
        const prefix = (MESSAGES.timestamps && MESSAGES.timestamps.retrievedPrefix) || "Retrieved: ";
        this.timestampElement.textContent = prefix + new Date().toLocaleString();
    }
}


// run js file in reader.html
document.addEventListener("DOMContentLoaded", () => {
    const readerList = $("readerList");
    if (!readerList) return;

    document.title = MESSAGES.pageTitles.reader;

    // Use setText for elements that have IDs
    setText("title", MESSAGES.pageTitles?.reader);
    setText("tagline", MESSAGES.taglines?.readerTagline);
    setText("backLink", MESSAGES.buttons?.backButton);
    /*
    ?. is optional chaining in JavaScript. It safely tries to access a property or call a function only if the left side isn’t null or undefined. If the left side is null/undefined, the whole expression becomes undefined instead of throwing an error.
    */


    const r = new Reader(readerList);
    r.renderList(Storage.read());
    r.updateRetrievedTS();

    // auto-refresh (2 seconds)
    setInterval(() => {
        r.renderList(Storage.read());
        r.updateRetrievedTS();
    }, 2000)


})