const {command , metaData , getBuffer , yts , youtube } = require("../lib");
const acrcloud = require("acrcloud")
const fs = require("fs-extra");
const ffmpeg = require('fluent-ffmpeg');

command(
{
pattern : "find",
fromMe: false,
desc : "yts player",
type : "music",
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


let {code , msg}  = res.status
if(code !== 0) return await message.reply(msg)

let { name , album } = res.metadata.music[0]
    
let { title , url , thumbnail , views , duration } = await yts(album?.name)
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
 fromMe: true
},
async(message,match ,m)=> {
if(match == 1 && m.quoted.text.includes("𝑢𝑟𝑙 :")){
		
try{

let final = m.quoted.text.split("┠ ")[2] 
final = final.replace("𝑢𝑟𝑙 :", "")
let ur_l = final;
let { song }  = await youtube.download(ur_l);
let mp3 = await getBuffer(song);
	
await message.client.sendMessage(message.jid , {audio: mp3 , mimetype: "audio/mpeg"} ,{quoted: m})

}catch(e){
return e
}
}
})
