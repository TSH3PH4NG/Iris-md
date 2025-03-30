const { command } = require("../lib");

command({
pattern: "sticker",
fromMe: false,
}, async(message,match,m)=>{
if(!message.reply_message || (!message.reply_message.message.imageMessage && !message.reply_message.message.videoMessage)) return message.reply("reply to an image or video");

let res;

if(message.reply_message.message.imageMessage){
res = "image"
}else{
res = "video"
};

let bb = await m.quoted.download();

switch(res){

case "image": 
return message.client.IAS(message.jid , bb , { packname: (m?.pushName || "anonymous"), author: "Iris-md"}, {quoted: m });
break;

case "video":
return message.client.VAS(message.jid , bb , { packname: (m?.pushName || "anonymous"), author: "Iris-md"}, {quoted: m});
break;

}

})
