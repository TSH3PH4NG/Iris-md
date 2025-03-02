/*just incase you wanna make your own functions*/

const {
    command,
    commands
} = require("./events");
const { ytdl } = require("./yt");
const { yts } = require("./yts");
const { tubis } = require("./tubis");
const { tubidl } = require("./tubidl");
const { shazam } = require("./nothing");
const { pinterest } = require("./pinterest");
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
    secondsToDHMS,
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
    secondsToDHMS,
    formatBytes,
    sleep,
    clockString,
    runtime, 
    Bitly,
    isNumber,
    getRandom,
    ytdl,
    yts,
    pinterest,
    tubis,
    tubidl,
    isYT,
    shazam,
};
