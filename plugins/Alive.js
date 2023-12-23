const {command} = require("../lib");

command({
  pattern:"alive",
  fromMe: false,
  desc: "test alive"
},
async(message, m)=>{
return message.send(message.jid, {text: `hello ${message.pushName} all systems are functional`}, {quoted: m})
  
})
