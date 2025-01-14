const { command , toAudio ; } = require("../lib");


command({
	pattern: "mp3",
	fromMe: false,
},
async(message,match , m)=>{

let pt = true;

if(!match){
pt = false;
}
if(!message.reply_message.message.videoMessage) return message.reply("reply to a video");
let buffer = await m.quoted.download();


let res = await toAudio(buffer, "mp3");

return message.client.sendMessage(message.jid , {audio: res , mimetype: "audio/mpeg", ptt: pt} ,{ quoted: m });
  
})
