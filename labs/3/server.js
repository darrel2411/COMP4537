// this code is developed with the assistance of OpenAI

'use strict'
const http = require('http');
const url = require('url');
const PORT = process.env.PORT || 8888;
const en = require("./lang/en/en.json")

const { Message, FileModule, ErrorMessage } = require('./modules/utils')

class AppServer {
    constructor(port = PORT) {
        this.port = port;
        this.message = new Message();
        this.files = new FileModule();
        this.error = new ErrorMessage();
    }

    send = (res, code, body, type = "text/html; charset=utf-8") => {
        res.writeHead(code, { "content-type": type });
        res.end(body);
    }

    router = async (req, res) => {
        let q = url.parse(req.url, true);
        const { pathname, query } = q;

        if (req.method === 'GET' && pathname === "/COMP4537/labs/3/getDate/") {
            return this.send(res, 200, this.message.printMessage(query.name));
        }

        // write to file (Part C1)
        else if (req.method === 'GET' && pathname === "/COMP4537/labs/3/writeFile/") {
            const text = query.text ? query.text.toString() : "";

            if (!text) {
                return this.send(res, 400, `400 Bad request: missing ?text=...`);
            }

            // await appendLine(content);
            await this.files.appendLine(text);
            return this.send(res, 200, `Appended line:\n${text}\n to file.txt`)
        }

        // read from file (Part C2)
        else if (req.method === 'GET' && pathname === "/COMP4537/labs/3/readFile/file.txt") {
            try {
                const content = await this.files.readTextFile();
                this.send(res, 200, content)
            } catch (err) {
                const notFound = err.code === "ENOENT";
                return this.send(
                    res,
                    notFound ? 404 : 500,
                    notFound ? this.error.error404("file.txt") : this.error.error500()
                )
            }
        }

        else {
            return this.send(res, 404, this.error.error404(pathname))
        }
    }

    start = () => {
        http.createServer((req, res) => this.router(req, res))
            .listen(this.port, () => {
                console.log(`${en.server_message} ${this.port}`);
            });
    }
}

new AppServer(PORT).start()

