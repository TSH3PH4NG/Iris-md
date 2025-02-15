const { command , ytdl , getBuffer , yts , tubis , tubidl , metaData }  = require("../lib");

command({
pattern: "song",
fromMe: false
},
async(message,match, m)=>{
if(!match) return message.client.sendMessage(message.jid , {text: "i need a query"}, {quoted: m})


let { title , url } = await yts(match);
let  buff  = await ytdl(url);
buff = await metaData(title, buff);

try{
return await message.client.sendMessage(message.jid, { audio: buff , mimetype: "audio/mpeg" }, {quoted: m });
}catch(e){
  
let decoy = await tubis(title);
let decoydl = await tubidl(decoy[0]?.link);
let buffer = await getBuffer(decoydl[0]?.url);
buffer = await metaData(title,buffer);
  
return await message.client.sendMessage(message.jid, { audio: buffer , mimetype: "audio/mpeg"}, {quoted: m})
}

})
