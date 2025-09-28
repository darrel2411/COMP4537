const en = require("../lang/en/en.json");
const fs = require("fs");
const path = require("path");
const { FILE_NAME } = require("../lang/en/file.json");

// part B
class Message {
    // constructor(message = "") {
    //     this.message = message;
    // }

    // methods
    getDate = () => {
        return new Date().toString();
    }

    formatMessage = (name = "you") => {
        return en.message.replace("%1", name)
    }

    printMessage = (name) => {
        let output = this.formatMessage(name)
        return `
            <h3 style="color: DodgerBlue;">
            ${output} * ${this.getDate()}
            </h3>
        `;
    }

}


// part C
class FileModule {
    constructor() {
        this.filePath = path.join(__dirname, "..", FILE_NAME);
    }

    appendLine = async (text) => {
        await fs.promises.appendFile(this.filePath, `${text}\n`, "utf-8");
        return this.filePath;
    }

    readTextFile = async () => {
        const data = await fs.promises.readFile(this.filePath, "utf-8");
        return data.toString();
    }
}


// error handling
class ErrorMessage {
    constructor() {
        this.message = en;
    }

    error404 = (pathname) => {
        return `${this.message["404_message"]}: ${pathname}`;
    }

    error500 = () => {
        return `${this.message["500_message"]}`;
    }
}


module.exports = { Message, FileModule, ErrorMessage }