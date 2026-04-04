const { command , getJson , isUrl } = require("../lib");

command({
pattern: "ssweb",
fromMe: false,
desc: "capture web screenshot"
},async(message,match,m) =>{
	
if(!isUrl(match)) return message.reply("I need a url");

let bb = await getJson (`https://api-olive-five-53.vercel.app/ssweb?url=${match}`);

await message.client.sendMessage(message.jid,{ image: { url: bb.iurl }, caption: `screenshot for ${bb.ourl} obtained`}, { quoted: m });

})
