const {command , metaData , getBuffer , yts , ytdl , shazam } = require("../lib");
const acrcloud = require("acrcloud")
const fs = require("fs-extra");
const ffmpeg = require('fluent-ffmpeg');

command(
{
pattern : "find",
fromMe: false,
desc: "music finder"
 },
 
 async (message, match, m) => {
 if (!message.reply_message.message.videoMessage && !message.reply_message.message.audioMessage)
      return await message.sendMessage("*Need Video! Or Audio*", {quoted: m});
	
 let buff = await m.quoted.download()
try{
 	const acr = new acrcloud({
  host: "identify-eu-west-1.acrcloud.com",
  access_key: "df8c1cffbfa4295dd40188b63d363112",
  access_secret: "d5mygczEZkPlBDRpFjwySUexQM26jix0gCmih389"
});


let res = await acr.identify(buff)

let finder  = res.metadata.music[0]
    
let { title , url , thumbnail , views , duration } = await yts(finder.album?.name || (await shazam(buff)).title );
let im = await getBuffer(thumbnail)
    let  text = `
╭━━〘 𝑀𝑈𝑆𝐼𝐶 𝐹𝐼𝑁𝐷𝐸𝑅 〙
┃ 
┠ title: ${title}
┠ url: ${url}
┠ duration: ${duration}
┠ views: ${views}
┃ 
╰━━━━━━━━━━━──⊷`

 	return await message.client.sendMessage(message.jid, {text: text, contextInfo:{ 
externalAdReply:{

title: ` 𝐓𝐒𝐇𝐄𝐏𝐀𝐍𝐆 𝐌𝐀𝐑𝐓𝐈𝐍 𝐌𝐀𝐒𝐈𝐀 `,
mediaType: 1,
previewType: 0,
renderLargerThumbnail: true,
thumbnail: im
                                 }



}}, {quoted: m})

 }catch(e){
message.reply(e)
}
 
})

command({
 on: "text",
 fromMe: false
},
async(message,match ,m)=> {
if(match == 1 && m.quoted.text.includes("url")){
		
try{

let final = m.quoted.text.split("┠ ")[2] 
final = final.replace("url:", "")
let ur_l = final;
let data = await ytdl(ur_l);
	
await message.client.sendMessage(message.jid , {audio: data , mimetype: "audio/mpeg"} ,{quoted: m})

}catch(e){
return e
}
}
})
