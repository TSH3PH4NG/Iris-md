const {command} = require("../lib");

command({
  pattern:"alive",
  fromMe: true,
  desc: "test alive"
},
async(message, m,match)=>{
return message.client.sendMessage(message.jid, {text: `*hello ${message.pushName} all systems are functional*`}, { quoted: m })
  
})
