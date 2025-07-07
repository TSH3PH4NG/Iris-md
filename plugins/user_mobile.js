const { getDevice } = require("@whiskeysockets/baileys");
const {command} = require("../lib");


command({
pattern: "user",
fromMe: true,
desc: "Device detection",
type: "user"
},
async(message,match,m)=>{
	
let bb = await getDevice(message.reply_message.key.id)

const name = {
  "ios": "*_IPHONE_*",
  "android": "*_ANDROID_*",
  "web": "*_DESKTOP_*"
};

bb = name[bb];

return message.client.sendMessage(message.jid , {text: `
_USER-DEVICE_: ${bb}
`}, {quoted: m })

})
