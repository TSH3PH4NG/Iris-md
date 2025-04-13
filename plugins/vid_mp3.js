const { command , toAudio , reply  } = require("../lib");


command({
	pattern: "mp3",
	fromMe: false,
},
async(message,match , m)=>{

let pt = true;

if(!match){
pt = false;
}
let { msg , status , mime } = await reply(m, "video");
if(status == 0) return message.reply(msg);
let buffer = await m.download();
let res = await toAudio(buffer, "mp3");
return message.client.sendMessage(message.jid , {audio: res , mimetype: "audio/mpeg", ptt: pt} ,{ quoted: m });
})
