/*just incase you wanna make your own functions*/

const {
    command,
    commands
} = require("./events");
const { reply } = require("./reply");
const { ytdl } = require("./yt");
const { shazam } = require("./nothing");
let config = require('../config')
const {
    getBuffer,
    toAudio,
    getData,
    metaData,
    decodeJid,
    parseJid,
    parsedJid,
    getJson,
    isIgUrl,
    isUrl,
    getUrl,
    qrcode,
    uptime,
    formatBytes,
    sleep,
    clockString,
    runtime,
    Bitly,
    isNumber,
    getRandom,
    isAdmin,
    isYT,
} = require("./functions");
const { serialize } = require("./serialize");
const Greetings = require("./Greetings");
module.exports = {
    isPrivate: config.WORK_TYPE.toLowerCase() === "private",
    Greetings,
    isAdmin,
    serialize,
    command,
    commands,
    getBuffer,
    reply,
    toAudio,
    getData,
    metaData,
    decodeJid,
    parseJid,
    parsedJid,
    getJson,
    isIgUrl,
    isUrl,
    getUrl,
    qrcode,
    uptime,
    formatBytes,
    sleep,
    clockString,
    runtime, 
    Bitly,
    isNumber,
    getRandom,
    ytdl,
    isYT,
    shazam,
};
