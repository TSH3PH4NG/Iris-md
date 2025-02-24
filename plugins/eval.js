const {
    command,
    yts,
    ytdl,
    getJson,
    getBuffer,
    isYT,
    isInsta,
} = require("../lib/");/*fave functions*/
const lib = require("../lib");
const util = require("util");
const axios = require("axios");
const fetch = require("node-fetch");


command({
    pattern: 'eval', on: "text", fromMe: true, desc: 'Runs a server code'
}, async (message, match, m, client) => {
    if (!match.startsWith("~")) return;
        //const m = message;
        try {
            let evaled = await eval(`(async()=> { ${match.replace("~", "")} }) ()`);
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
            return await message.reply(evaled);
        } catch (err) {
           return await message.reply(util.format(err));
        }
    
});
