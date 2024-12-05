const { command } = require("../lib");

command({
  pattern:"alive",
  fromMe: true,
  desc: "test alive"
},
async(message, m,match)=>{
return message.reply(`*hello ${message.pushName} all systems are functional*`)
  
})
