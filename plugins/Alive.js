const {command} = require("../lib");

command({
  pattern:"alive",
  fromMe: false,
  desc: "test alive"
},
async(message, m)=>{
await message.client.sendMessage(message.jid, {text: `hello ${message.pushName} all systems are functional`}, {quoted: m})
  
})
