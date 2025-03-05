const {
    default: makeWASocket,
    useMultiFileAuthState,
    Browsers,
    makeInMemoryStore,
    delay,
    makeCacheableSignalKeyStore,
    DisconnectReason,
} = require("@whiskeysockets/baileys");
const path = require("path");
const fs = require("fs");
const config = require("./config");
const pino = require("pino");
const { Message } = require("./lib/Messages");
const { serialize, Greetings, parsedJid } = require("./lib");
const events = require("./lib/events");
const express = require("express");
const app = express();
const port = config.PORT;
const EV = require("events");
EV.setMaxListeners(0);

const store = makeInMemoryStore({
    logger: pino().child({ level: "silent", stream: "store" }),
});

const logger = pino({ level: "silent" });
const { MakeSession } = require("./lib/session");

if (!fs.existsSync("./resources/auth/creds.json")) {
    MakeSession(config.SESSION_ID, "./resources/auth/creds.json").then(() =>
        console.log("version : " + require("./package.json").version)
    );
}

fs.readdirSync(__dirname + "/resources/database/").forEach((db) => {
    if (path.extname(db).toLowerCase() == ".js") {
        require(__dirname + "/resources/database/" + db);
    }
});

const p = async () => {
    fs.readdirSync("./plugins").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
            require("./plugins/" + plugin);
        }
    });
};

async function Iris() {
    console.log(`syncing database`);
    await config.DATABASE.sync();

    const { state, saveCreds } = await useMultiFileAuthState(`./resources/auth/`);

    let conn = makeWASocket({
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger) },
        printQRInTerminal: false,
        logger: pino({ level: "silent" }),
        browser: Browsers.ubuntu("Chrome"),
        downloadHistory: false,
        syncFullHistory: false,
        markOnlineOnConnect: false,
        emitOwnEvents: false,
        generateHighQualityLinkPreview: true,
        defaultQueryTimeoutMs: undefined,
    });

    conn.ev.on("call", async (c) => {
        if (config.CALL_REJECT === true) {
            c = c.map((c) => c);
            c = c[0];
            let { status, from, id } = c;

            if (status == "offer") {
                await conn.rejectCall(id, from);
                return conn.sendMessage(from, { text: "_NUMBER UNDER ARTIFICIAL INTELLIGENCE, NO 📞_" });
            }
        } else if (config.CALL_REJECT === false) {
            return;
        }
    });

    conn.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect } = s;

        if (connection === "open") {
            console.log("Connecting to WhatsApp...");
            console.log("connected");
            await delay(5000);
            await conn.sendMessage(conn.user.id, { text: `Iris connected` });
        }

        if (connection === "close") {
            if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                await delay(300);
                Iris();
                console.log("reconnecting...");
                console.log(s);
            } else {
                console.log("connection closed");
                await delay(3000);
                process.exit(0);
            }
        }
    });

    conn.ev.on("creds.update", saveCreds);

    conn.ev.on("messages.upsert", async (m) => {
        if (m.type !== "notify") return;

        let msg = await serialize(JSON.parse(JSON.stringify(m.messages[0])), conn);
        if (!msg) return;

        let text_msg = msg.body;

        if (text_msg && config.LOGS) {
            console.log(
                `At : ${
                    msg.from.endsWith("@g.us") ? (await conn.groupMetadata(msg.from)).subject : msg.from
                }\nFrom : ${msg.sender}\nMessage:${text_msg}\nSudo:${msg.sudo} , ${typeof msg.body}`
            );
        }

        events.commands.map(async (command) => {
            if (command.fromMe && !msg.sudo) return;

            let prefix = config.HANDLERS.trim();
            let comman = text_msg;

            if (command?.pattern instanceof RegExp && typeof comman === "string") {
                const regex = new RegExp(`^${command.pattern.source}`); /*insures that commands don't tweak like .alivebb running instead of .alive bb*/
                try{
                const cmd = msg.body.match(regex);
                comman = cmd && cmd[0]?.startsWith(prefix) ? cmd[0] : false; /*it's the same as if/else*/
                } catch(e){
                	console.log(`error: ${e}\n cmd: ${cmd}`)

      }
            }

            msg.prefix = prefix;

            if (config.ALWAYS_ONLINE === true) {
                conn.sendPresenceUpdate("available", msg.key.remoteJid);
            } else {
                conn.sendPresenceUpdate("unavailable", msg.key.remoteJid);
            }

            let whats;
            let match;

            switch (true) {
                case command.pattern && command.pattern.test(comman):
                    try {
                        match = text_msg.replace(new RegExp(command.pattern, "i"), "").trim();
                    } catch (e) {
                        console.log(e);
                        match = false;
                    }
                    whats = new Message(conn, msg);
                    command.function(whats, match, msg, conn);
                    break;

                case text_msg && command.on === "text":
                    whats = new Message(conn, msg);
                    command.function(whats, text_msg, msg, conn, m);
                    break;

                case command.on === "image" || command.on === "photo":
                    if (msg.type === "imageMessage") {
                        whats = new Message(conn, msg);
                        command.function(whats, text_msg, msg, conn, m);
                    }
                    break;

                case command.on === "sticker":
                    if (msg.type === "stickerMessage") {
                        whats = new Message(conn, msg);
                        command.function(whats, msg, conn, m);
                    }
                    break;

                case command.on === "video":
                    if (msg.type === "videoMessage") {
                        whats = new Message(conn, msg);
                        command.function(whats, msg, conn, m);
                    }
                    break;

                default:
                    break;
            }
        });
    });
}

app.get("/", (req, res) => res.type("html").send(`<p2>Hello world</p2>`));
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}!`));

Iris();
p();
