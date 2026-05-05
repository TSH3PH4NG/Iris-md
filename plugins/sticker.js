const { command , reply } = require("../lib");

command({
pattern: "sticker",
fromMe: false,
desc: "Img/Vid - Sticker",
type: "converter"
}, async(message,match,m)=>{
  
let { msg , status , mime } = await reply(m, "image&video");
if(status == 0) return message.reply(msg);
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

});

command(
{
  pattern: "photo",
  fromMe: false
},
async (message, match, m) => {

  if (!message.reply_message || !message.reply_message.sticker) {
    return await message.reply("Reply to a sticker");
  }

  try {

    let buffer = await m.quoted.download();

    await message.client.sendMessage(
      message.jid,
      {
        image: buffer,
        mimetype: "image/png"
      },
      { quoted: m }
    );

  } catch (e) {
    await message.reply("Error: " + e.message);
  }

}
);
