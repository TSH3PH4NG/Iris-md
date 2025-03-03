const { command , ytdl , getBuffer , tubis , tubidl , metaData }  = require("../lib");
const yts = require("yt-search");

command({
pattern: "song",
fromMe: false
},
async(message,match, m)=>{
if(!match) return message.reply("_i need a query_");
try{
  
let { title , url } = await (await yts(match)).all[0]
let  buff  = await ytdl(url);
buff = await metaData(title, buff);
  
return await message.client.sendMessage(message.jid, { audio: buff , mimetype: "audio/mpeg" }, {quoted: m });
}catch(e){
  await message.reply(e);
 }
})
