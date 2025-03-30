const { command , toAudio  } = require("../lib");


command({
	pattern: "mp3",
	fromMe: false,
},
async(message,match , m)=>{

let pt = true;

if(!match){
pt = false;
}
const quoted = m.quoted ? m.quoted.mtype : m.type
const mime = quoted;
if(!/videoMessage/.test(mime)) return message.reply('Reply to a video');
let buffer = await m.download();
let res = await toAudio(buffer, "mp3");
return message.client.sendMessage(message.jid , {audio: res , mimetype: "audio/mpeg", ptt: pt} ,{ quoted: m });
})
