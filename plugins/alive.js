const { command , uptime } = require("../lib");

command({
  pattern:"alive",
  fromMe: true,
  type: "misc",
  desc: "Bot status"
},
async(message , m , match)=>{
let bb = await uptime(process.uptime())
return message.reply(`
Hello ${message.pushName} all systems are functional
uptime: ${bb}
`)
  
})
