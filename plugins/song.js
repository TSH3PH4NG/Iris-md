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
  

let { url } = await (await axios(`https://api-ij32.onrender.com/yts?q=${match}`)).data[0];
let  final  = await ytdl(url);

return await message.client.sendMessage(message.jid, { audio: { url: final }, mimetype: "audio/mpeg" }, { quoted: m });

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
  
let { title , url } = await ( await axios(`https://api-ij32.onrender.com/yts?q=${match}`)).data[0];
let  doc_url  = await ytdl(url);

/*if(!Buffer.isBuffer(buff)) return;
buff = await metaData(title, buff);*/

return await message.client.sendMessage(message.jid, { document: { url: doc_url }, mimetype: "audio/mpeg" , fileName: `${title}.mp3`}, { quoted: m });
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
  
let { title , url , thumbnail } = await ( await axios(`https://api-ij32.onrender.com/yts?q=${match}`)).data[0];

await message.client.sendButton(message, { image: { url: thumbnail } , caption: `Song: ${title}`,
footer: "Made with 🫶 by Tshepang",
buttons: [{
	text: "audio",
	id: `.yx  ${url}`,
},{
	text: "document",
	id: `.xy  ${url}`,
},{
	options: {
		text: "copy_url",
		copy_code: url,
	}
}]
}, { quoted: m })

}catch(e){
  await console.log(e);
 }
})
