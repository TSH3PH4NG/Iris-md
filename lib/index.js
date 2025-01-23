/*just incase you wanna make your own functions*/

const {
    command,
    commands
} = require("./events");
const { youtube } = require("./yt");
const { yts } = require("./yts");
const { tubis } = require("./tubis");
const { tubidl } = require("./tubidl");
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
    youtube,
    yts,
    pinterest,
    tubis,
    tubidl,
};
