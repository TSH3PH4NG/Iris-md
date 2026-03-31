/*just incase you wanna make your own functions*/

const {
    command,
    commands
} = require("./events");
const { reply } = require("./reply");
const { ytdl } = require("./yt");
const {
    getBuffer,
    toAudio,
    metaData,
    decodeJid,
    parseJid,
    parsedJid,
    getJson,
    isIgUrl,
    isUrl,
    getUrl,
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
const {
  loadDB,
  saveDB,
  addCredit,
  deleteUser,
  modifyCredit,
  getUsers,
  validateNumber,
  getCleanJid,
} = require("./credits");
const { serialize } = require("./serialize");
module.exports = {
    isPrivate: global.config.WORK_TYPE.toLowerCase() === "private",
    isAdmin,
    serialize,
    command,
    commands,
    getBuffer,
    reply,
    toAudio,
    metaData,
    decodeJid,
    parseJid,
    parsedJid,
    getJson,
    isIgUrl,
    isUrl,
    getUrl,
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
    loadDB,
    saveDB,
    addCredit,
    deleteUser,
    modifyCredit,
    getUsers,
    validateNumber,
    getCleanJid
};
