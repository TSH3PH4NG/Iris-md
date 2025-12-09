const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require("baileys");
const path = require("path");
const fs = require("fs");
const pino = require("pino");
const logger = pino({ level: "silent" });
const { MakeSession } = require("./lib/session");
const { Message } = require("./lib/Messages");
const { serialize, parsedJid } = require("./lib");
const events = require("./lib/events");
const express = require("express");
const app = express();
const port = global.config.PORT;
const NodeCache = require('node-cache');
const EV = require("events");
EV.setMaxListeners(0);

const delay = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

global.cache = {
	groups: new NodeCache({ stdTTL: 400, checkperiod: 320, useClones: false }), /*stdTTL == Standard Time-To-Live , the rest should make sense homieðŸ¦¦*/
	messages: new NodeCache({ stdTTL: 60, checkperiod: 80, useClones: false }),
};

if (!fs.existsSync("./resources/auth/creds.json")) {
    MakeSession(global.config.SESSION_ID, "./resources/auth/creds.json").then(() =>
        console.log("version : " + require("./package.json").version)
    );
}

try {
    fs.readdirSync(__dirname + "/resources/database/").forEach((db) => {
        if (path.extname(db).toLowerCase() == ".js") {
            require(__dirname + "/resources/database/" + db);
        }
    });
} catch (error) {
    console.error("Error loading databases:", error);
}

const p = async () => {
    try {
        fs.readdirSync("./plugins").forEach((plugin) => {
            if (path.extname(plugin).toLowerCase() == ".js") {
                require("./plugins/" + plugin);
            }
        });
    } catch (error) {
        console.error("Error loading plugins:", error);
    }
};

async function Iris() {
    try {
        console.log(`Syncing database`);
        const { state, saveCreds } = await useMultiFileAuthState(`./resources/auth/`);
        /*let { version } = await fetchLatestBaileysVersion();*/
        let conn = makeWASocket({
            auth: state,
			printQRInTerminal: false,
            logger: pino({ level: "silent" }),
            defaultQueryTimeoutMs: undefined,
            cachedGroupMetadata: async (jid) => {
            const cachedData = global.cache.groups.get(jid);
            if (cachedData) return cachedData;
            const metadata = await conn.groupMetadata(jid);
            global.cache.groups.set(jid, metadata);
            return metadata;
            }
        });

        conn.ev.on("call", async (c) => {
            try {
                if (global.config.CALL_REJECT === true) {
                    c = c.map((c) => c)[0];
                    let { status, from, id } = c;
                    if (status == "offer") {
                        await conn.rejectCall(id, from);
                        return conn.sendMessage(from, { text: "_NUMBER UNDER ARTIFICIAL INTELLIGENCE, NO ðŸ“ž_" });
                    }
                }
            } catch (error) {
                console.error("Error handling call event:", error);
            }
        });

        conn.ev.on("connection.update", async (s) => {
            try {
                const { connection, lastDisconnect } = s;
                if (connection === "open") {
                    console.log("Connecting to WhatsApp...");
                    console.log("Connected");
                    await delay(5000);
                    await conn.sendMessage(conn.user.id, { text: `Iris connected` });
                }
                if (connection === "close") {
                    if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                        console.log("Reconnecting...");
                        await delay(300);
                        Iris();
                    } else {
                        console.log("Connection closed");
                        await delay(3000);
                        process.exit(0);
                    }
                }
            } catch (error) {
                console.error("Error in connection update:", error);
            }
        });

        conn.ev.on("creds.update", saveCreds);
        
    conn.ev.on("groups.update", async (events) => {
    for (const event of events) {
        try {
            const metadata = await conn.groupMetadata(event.id);
            global.cache.groups.set(event.id, metadata);
        } catch (err) {
            console.error(`Failed to get group metadata for ${event.id}:`, err.message);
            global.cache.groups.del(event.id); // Optional: clean it from cache
        }
    }
});

   conn.ev.on("group-participants.update", async (event) => {
    try {
        const metadata = await conn.groupMetadata(event.id);
        global.cache.groups.set(event.id, metadata);
    } catch (err) {
        console.error(`Failed to get group metadata for ${event.id}:`, err.message);
        global.cache.groups.del(event.id);
    }
});




        conn.ev.on("messages.upsert", async (m) => {
            try {
                if (m.type !== "notify") return;

                let msg = await serialize(JSON.parse(JSON.stringify(m.messages[0])), conn);
                if (!msg) return;

                let text_msg = msg.body;
                if (text_msg && global.config.LOGS) {
                    console.log(
                        `At : ${msg.from.endsWith("@g.us") ? (await conn.groupMetadata(msg.from)).subject : msg.from}\nFrom : ${msg.sender}\nMessage:${text_msg}\nSudo:${msg.sudo}`
                    );
                }

                events.commands.map(async (command) => {
                    if (command.fromMe && !msg.sudo) return;

                    let prefix = global.config.HANDLERS.trim();
                    let comman = text_msg;

                    if (command?.pattern instanceof RegExp && typeof comman === "string") {
                        try {
                            const regex = new RegExp(`^${command.pattern.source}`);
                            const cmd = msg.body.match(regex);
                            comman = cmd && cmd[0]?.startsWith(prefix) ? cmd[0] : false;
                        } catch (error) {
                            console.error("Error matching command pattern:", error);
                        }
                    }

                    msg.prefix = prefix;

                    try {
                        if (global.config.ALWAYS_ONLINE === true) {
                            conn.sendPresenceUpdate("available", msg.key.remoteJid);
                        } else {
                            conn.sendPresenceUpdate("unavailable", msg.key.remoteJid);
                        }
                    } catch (error) {
                        console.error("Error updating presence:", error);
                    }

                    let whats;
                    let match;
                    try {
                        switch (true) {
                            case command.pattern && command.pattern.test(comman):
                                match = text_msg.replace(new RegExp(command.pattern, "i"), "").trim();
                                whats = new Message(conn, msg);
                                command.function(whats, match, msg, conn);
                                break;
                            case text_msg && command.on === "text":
                                whats = new Message(conn, msg);
                                command.function(whats, text_msg, msg, conn, m);
                                break;
                            case command.on === "image" && msg.type === "imageMessage":
                            case command.on === "photo" && msg.type === "imageMessage":
                            case command.on === "sticker" && msg.type === "stickerMessage":
                            case command.on === "video" && msg.type === "videoMessage":
                                whats = new Message(conn, msg);
                                command.function(whats, text_msg, msg, conn, m);
                                break;
                        }
                    } catch (error) {
                        console.error(`Error executing command: ${error}`);
                    }
                });
            } catch (error) {
                console.error("Error processing message:", error);
            }
        });
    } catch (error) {
        console.error("Error in Iris function:", error);
    }
}

app.get("/", (req, res) => res.type("html").send(`<p2>Hello world</p2>`));

app.listen(port, () => console.log(`Server listening on http://localhost:${port}!`));

try {
    Iris();
    p();
} catch (error) {
    console.error("Fatal error in startup:", error);
}
