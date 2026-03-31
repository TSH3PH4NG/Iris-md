const { command , ytdl , getBuffer , metaData }  = require("../lib");
const axios = require("axios");

command({
pattern: "yx",
fromMe: false,
desc: "Download songs",
type: "download"
},
async(message,match, m)=>{
if(!match) return message.reply("_i need a query_");
try{
  

let { url, title , thumbnail } = await (await axios(`https://api-olive-five-53.vercel.app/yts?q=${match}`)).data[0];
let  initial  = await ytdl(url);
initial = await getBuffer(initial);
let final = await metaData(initial,title,thumbnail);


return await message.client.sendMessage(message.jid, { audio:  final , mimetype: "audio/mpeg" }, { quoted: m });

}catch(e){
  await console.log(e);
 }
 
});

command({
pattern: "xy",
fromMe: false,
desc: "Download songs",
type: "download"
},
async(message,match, m)=>{
if(!match) return message.reply("_i need a query_");
try{
  
let { title , url , thumbnail } = await ( await axios(`https://api-olive-five-53.vercel.app/yts?q=${match}`)).data[0];
let doc_url  = await ytdl(url);
doc_url = await getBuffer(doc_url);
let doc_url_final = await metaData(doc_url,title,thumbnail);

return await message.client.sendMessage(message.jid, { document: doc_url_final , mimetype: "audio/mpeg" , fileName: `${title}.mp3`}, { quoted: m });
}catch(e){
  await console.log(e);
 }
})

command({
pattern: "song",
fromMe: false,
desc: "Download songs",
type: "download"
},
async(message,match, m)=>{
if(!match) return message.reply("_i need a query_");
try{
let { title, url, thumbnail } = await (await axios(`https://api-olive-five-53.vercel.app/yts?q=${match}`)).data[0];

await message.client.sendMessage(
message.jid,
{
image: { url: thumbnail },
caption: `Song: ${title}`,
footer: "Made with 🫶 by Tshepang",
buttons: [
{
buttonId: `.yx ${url}`,
buttonText: { displayText: "audio" }
},
{
buttonId: `.xy ${url}`,
buttonText: { displayText: "document" }
}
]
},
{ quoted: m }
);
}catch(e){
await message.reply(e);
}
});
