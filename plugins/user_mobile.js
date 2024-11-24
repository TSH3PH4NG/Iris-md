const { getDevice } = require("@whiskeysockets/baileys");
const {command} = require("../lib");


command({
pattern: "user",
fromMe: true
},
async(message,match,m)=>{
	
let bb = await getDevice(message.reply_message.key.id)

const name = {
  "ios": "_IPHONE_",
  "android": "android",
  "web": "DESKTOP"
};

bb = name[bb];

return message.client.sendMessage(message.jid , {text: `
_USER-PHONE_: ${bb}
`}, {quoted: m })

})
