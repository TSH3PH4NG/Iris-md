/*just incase you wanna make your own functions*/

const {
    command,
    commands
} = require("./events");
const { youtube } = require("./yt");
const { yts } = require("./yts");
let config = require('../config')
const {
    getBuffer,
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
const {
    serialize,
    downloadMedia
} = require("./serialize");
const Greetings = require("./Greetings");
module.exports = {
    isPrivate: config.WORK_TYPE.toLowerCase() === "private",
    Greetings,
    isAdmin,
    serialize,
    downloadMedia,
    command,
    commands,
    getBuffer,
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
    
};
