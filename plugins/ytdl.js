const { command , getBuffer , isYT , getJson } = require("../lib");
const axios = require("axios");


command({
	on: "text",
        pattern: "vsss",
	fromMe: false,
}, async(message, match ,m )=>{
	
	if(!isYT(match)) return;
try{
         let { video , title } = await getJson(`https://api-ij32.onrender.com/download?url=${match}`)
         if(!video) return;
         /*const res = await axios.get(video[720], { responseType: "stream" });*/
         await message.client.sendMessage(
      message.jid,
      {
        document: { url: video[720] },
        mimetype: "video/mp4",
	fileName: `${title}.mp4`,
        caption: "_youtube_auto_dl_"
      },
      { quoted: m }
    );
    
  }catch(e){ 
  console.log(e);
}
})
