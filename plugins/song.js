const { syt , youtube , getBuffer , command }  = require("../lib");

command({
pattern: "song",
fromMe: false
},
async(message,match, m)=>{
if(!match) return message.client.sendMessage(message.jid , {text: "i need a query"}, {quoted: m})


let { url } = await syt(match,1);
let  { song } = await youtube.download(url);
let buff = await getBuffer(song);



try{
return await message.client.sendMessage(message.jid, {audio: buff , mimetype: "audio/mpeg"}, {quoted: m})
}catch(e){
return await message.client.sendMessage(message.jid, {text: 
`_failed
 error: ${e}_
`}, {quoted: m})
}

})
