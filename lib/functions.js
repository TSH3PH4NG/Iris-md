const axios = require("axios");
const {
    jidDecode,
    delay
} = require("@whiskeysockets/baileys");
const fs = require("node-webpmux/io");
const {
    readFile,
    unlink
} = require("fs/promises");
const {createWriteStream, readFileSync} = require("fs");
const {
    fromBuffer
} = require("file-type");
const { Innertube, UniversalCache, Utils } = require('youtubei.js');
const { existsSync, mkdirSync, createWriteStream , unlinkSync , readFileSync } = require('fs');
const NodeID3 = require('node-id3');
const ytsr = require('ytsr');

async function getBuffer(url, options) {
    try {
        options ? options: {};
        const res = await require("axios")({
            method: "get",
            url,
            headers: {
                DNT: 1,
                "Upgrade-Insecure-Request": 1,
            },
            ...options,
            responseType: "arraybuffer",
        });
        return res.data;
    } catch (e) {
        console.log(`Error : ${e}`);
    }
       };

async function syt(res){
const filters = await ytsr.getFilters(res);
    const filter = filters.get('Type').get('Video');
    const options = {
      limit: 1, // Retrieve only the first result
    };
const sr = await ytsr(filter.url , options);
  return sr.items[0]
};
    
async function metaData(t,dls){
const { title , type } = await syt(t);
let image = await getBuffer(`https://i.ytimg.com/vi/wEiRKpflgQA/maxresdefault.jpg`)
    
let tags = {

    title: title,

    artist: "Tshephang",

    album: "whatsap-bot",

    APIC: image,

    TRCK: "27"
}
  let success = await NodeID3.write(tags, dls)
  return success;
};

const decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
        const decode = jidDecode(jid) || {};
        return decode.user && decode.server
        ? `${decode.user}@${decode.server}`: jid;
    } else {
        return jid;
    }
};
async function FiletypeFromUrl(url) {
    const buffer = await getBuffer(url);
    const out = await fromBuffer(buffer);
    let type
    if (out) {
        type = out.mime.split('/')[0]
    }
    return {
        type,
        buffer
    }
};
function extractUrlFromMessage(message) {
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const match = urlRegex.exec(message);
    return match ? match[0]: null;
}
async function getSong(res,type= "audio"){

 const yt = await Innertube.create({ cache: new UniversalCache(false), generate_session_locally: true });
 let final = await syt(res);
 
  const stream = await yt.download(final.id, {
    type: type, // audio, video, or video+audio
    quality: '480p', // best, bestefficiency, 144p, 240p, 480p, 720p, and so on.
    format: 'mp4' // media container format 
  });
    
  let mediax = await createWriteStream("./temp.m4a")
  for await (const chunk of Utils.streamToIterable(stream)) {
   mediax.write(chunk);
  }
 
   return await readFileSync("./temp.m4a")
    
};       
module.exports = {
    FiletypeFromUrl,
    getBuffer,
    getSong,
    metaData,
    syt,
    extractUrlFromMessage,
    decodeJid,
    isAdmin: async (jid, user, client) => {
        const groupMetadata = await client.groupMetadata(jid);
        const groupAdmins = groupMetadata.participants
        .filter((participant) => participant.admin !== null)
        .map((participant) => participant.id);

        return groupAdmins.includes(decodeJid(user));
    },
    parseJid(text = "") {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
            (v) => v[1] + "@s.whatsapp.net"
        );
    },
    parsedJid(text = "") {
        return [...text.matchAll(/([0-9]{5,16}|0)/g)].map(
            (v) => v[1] + "@s.whatsapp.net"
        );
    },
    getJson: async function getJson(url, options) {
        try {
            options ? options: {};
            const res = await axios({
                method: "GET",
                url: url,
                headers: {
                    "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
                },
                ...options,
            });
            return res.data;
        } catch (err) {
            return err;
        }
    },
    isIgUrl: (url) => {
        /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/gim.test(
            url
        );
    },
    isUrl: (isUrl = (url) => {
        return new RegExp(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
            "gi"
        ).test(url);
    }),
    getUrl: (getUrl = (url) => {
        return url.match(
            new RegExp(
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
                "gi"
            )
        );
    }),
    qrcode: async (string) => {
        const {
            toBuffer
        } = require("qrcode");
        let buff = await toBuffer(string);
        return buff;
    },
    secondsToDHMS: async (seconds) => {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor((seconds % (3600 * 24)) / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var s = Math.floor(seconds % 60);
        var dDisplay = d > 0 ? d + (d == 1 ? " D, ": " D, "): "";
        var hDisplay = h > 0 ? h + (h == 1 ? " H, ": " H, "): "";
        var mDisplay = m > 0 ? m + (m == 1 ? " M, ": " M, "): "";
        var sDisplay = s > 0 ? s + (s == 1 ? " S": " S"): "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
    },
    formatBytes: (bytes, decimals = 2) => {
        if (!+bytes) return "0 Bytes";

        const k = 1024;
        const dm = decimals < 0 ? 0: decimals;
        const sizes = ["Bytes",
            "KB",
            "MB",
            "GB",
            "TB",
            "PB",
            "EB",
            "ZB",
            "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    },
    sleep: delay,
    clockString: (duration) => {
        (seconds = Math.floor((duration / 1000) % 60)),
        (minutes = Math.floor((duration / (1000 * 60)) % 60)),
        (hours = Math.floor((duration / (1000 * 60 * 60)) % 24));

        hours = hours < 10 ? "0" + hours: hours;
        minutes = minutes < 10 ? "0" + minutes: minutes;
        seconds = seconds < 10 ? "0" + seconds: seconds;

        return hours + ":" + minutes + ":" + seconds;
    },
    runtime: () => {
        const duration = process.uptime();
        const seconds = Math.floor(duration % 60);
        const minutes = Math.floor((duration / 60) % 60);
        const hours = Math.floor((duration / (60 * 60)) % 24);

        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        return formattedTime;
    },
    
    Bitly: async (url) => {
        return new Promise((resolve, reject) => {
            const BitlyClient = require("bitly").BitlyClient;
            const bitly = new BitlyClient("6e7f70590d87253af9359ed38ef81b1e26af70fd");
            bitly
            .shorten(url)
            .then((a) => {
                resolve(a);
            })
            .catch((A) => reject(A));
            return;
        });
    },
    isNumber: function isNumber() {
        const int = parseInt(this);
        return typeof int === "number" && !isNaN(int);
    },
    getRandom: function getRandom() {
        if (Array.isArray(this) || this instanceof String)
            return this[Math.floor(Math.random() * this.length)];
        return Math.floor(Math.random() * this);
    }
};
