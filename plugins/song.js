const { command , ytdl , getBuffer , metaData }  = require("../lib");
const axios = require("axios");

command({
pattern: "song",
fromMe: false,
desc: "Download songs",
type: "download"
},
async(message,match, m)=>{
if(!match) return message.reply("_i need a query_");
try{
  
let { title , url } = await ( await axios(`https://tshepang-yasuke-martin.hf.space/yts?q=${match}`)).data[0];
let  buff  = await ytdl(url);
if(!Buffer.isBuffer(buff)) return; /*idk what to log so this will do for now*/
buff = await metaData(title, buff);
  
return await message.client.sendMessage(message.jid, { audio: buff , mimetype: "audio/mpeg" }, {quoted: m });
}catch(e){
  await console.log(e);
 }
})
