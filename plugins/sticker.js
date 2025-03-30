const { command } = require("../lib");

command({
pattern: "sticker",
fromMe: false,
}, async(message,match,m)=>{
  
const quoted = m.quoted ? m.quoted.mtype : m.type
const mime = quoted;
if(!/imageMessage|videoMessage/.test(mime)) return message.reply('Reply to an image or video');
let res;

if(mime == "imageMessage"){
res = "image"
}else{
res = "video"
};

let bb = await m.download();

switch(res){

case "image": 
return message.client.IAS(message.jid , bb , { packname: (m?.pushName || "anonymous"), author: "Iris-md"}, {quoted: m });
break;

case "video":
return message.client.VAS(message.jid , bb , { packname: (m?.pushName || "anonymous"), author: "Iris-md"}, {quoted: m});
break;

}

})
