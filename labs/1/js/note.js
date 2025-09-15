/**
 * COMP 4537 – Lab 1
 * Note app (note.js)
 * purpose: 
 *  - to create a single note component
 *  - to sync data to UI (e.g. listens to input on textArea and updates this.text)
 *  - to do self-removal and automatically update the array
 * 
 * Note: Some parts of this code were developed with the assistance of ChatGPT.
 */


class Note {
    constructor(id, text, onRemove) {
        this.id = id;
        this.text = text || "";
        this.onRemove = typeof onRemove === "function" ? onRemove : null;

        // DOM refs (filled in when rendered)
        this.root = null;
        this.textarea = null;
        this.removeBtn = null;
    }

    // Create DOM and attach to a container
    render(container) {
        if (!container) return;

        const divWrap = document.createElement("div");
        const textArea = document.createElement("textarea");
        const btn = document.createElement("button");

        divWrap.className = "d-flex justify-content-center align-items-center gap-3 mb-3";

        textArea.value = this.text;
        textArea.placeholder = (MESSAGES.placeholders && MESSAGES.placeholders.note) || "Enter your note ...";
        textArea.className = "form-control";
        textArea.style.maxWidth = "640px";
        textArea.style.minHeight = "80px";

        btn.textContent = (MESSAGES.buttons && MESSAGES.buttons.removeNote) || "Remove";
        btn.className = "btn btn-outline-secondary";

        // keep text in sync
        textArea.addEventListener("input", () => {
            this.text = textArea.value;
        });

        // remove from the page and notify parent
        btn.addEventListener("click", () => {
            if (divWrap.parentNode) {
                divWrap.parentNode.removeChild(divWrap);
            }

            if (this.onRemove) {
                this.onRemove(this.id);
            }
        });

        divWrap.appendChild(textArea);
        divWrap.appendChild(btn);
        container.appendChild(divWrap);


        /*
        Why do we need to keep the refs?
        - To update the UI without re-querying the DOM (e.g., this.textarea.value = ...).
        - To remove the note cleanly later (this.root.remove()).
        - To enable/disable or relabel the button easily.
        */
        this.root = divWrap;
        this.textarea = textArea;
        this.removeBtn = btn;
    }

    // this will be use for later conversion of JSON
    toJSON() {
        return { id: this.id, text: this.text };
    }
}
