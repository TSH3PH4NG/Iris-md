/*dont mind bad coding school gc adding command*/

const {command} = require("../lib");

command({
pattern: "faka",
fromMe: false
},
async(message,match, m) =>{
let bb = match;
if(! message.jid == `120363053315792877@g.us`) return;
if(!bb || bb.length == 11) return message.client.sendMessage(message.jid, {text: "use 066... not 2766 / i need a number"} , {quoted: m});

try{



if(bb.length == 10 ){

bb =  bb.replace("0", "27")


bb = bb+"@s.whatsapp.net" 

let bx = await message.client.groupParticipantsUpdate(message.jid , [bb], "add");


let { status }= bx[0]

if(status == "200"){
return await message.client.sendMessage(message.jid, {text: `${bb.split("@")[0]} was added`} , {quoted: m})
}else if(status == "409"){
return await message.client.sendMessage(message.jid, {text: "user already added"} , {quoted: m})
}

  }
}catch(e){
message.reply(e)
}
})
