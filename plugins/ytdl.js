 const { command , getBuffer , isYT , getJson } = require("../lib");
 const axios = require("axios");
 

command({
	pattern: "ytmp4",
	on: "text",
	fromMe: false,
	type: "auto",
	desc: "YT autodl"
}, async(message, match ,m )=>{
	
	if(!isYT(match)) return;
try{
         let { url } = await getJson(`https://lordxdd-ytdlp.hf.space/ytv/?url=${match}&quality=720`);
         if(url.length == 0) return;
         let buff = await (await fetch(url)).arrayBuffer();
         let final_buffer = Buffer.from(buff);
         await message.client.sendMessage(message.jid , { video: final_buffer , mimetype: "video/mp4" , caption: `_youtube_auto_dl_`}, { quoted: m });
  }catch(e){ 
  console.log(e);
}
})
