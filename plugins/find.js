const {command , metaData , getBuffer ,syt , getData} = require("../lib");
const acrcloud = require("acrcloud")
const fs = require("fs-extra");
const ffmpeg = require('fluent-ffmpeg');

command(
{
pattern : "find",
fromMe: true,
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

let {title , name , album} = res.metadata.music[0]
    
const {tilte , url , bestThumbnail , id } = await syt(album?.name)
let im = await getBuffer(bestThumbnail.url)
    let  text = `
╭━━〘 𝑀𝑈𝑆𝐼𝐶 𝐹𝐼𝑁𝐷𝐸𝑅 〙
┃ 
┠ 𝑡𝑖𝑡𝑙𝑒 : ${title}
┠ 𝑢𝑟𝑙 : ${url}
┠ 𝑖𝑑 : ${id}
┃ 
╰━━━━━━━━━━━──⊷`

 	return await message.client.sendMessage(message.jid, {text: text}, {quoted: m})
 }catch(e){
message.reply(e)
}
 
})

command({
 on: "text",
 fromMe: false

},
async(message,match ,m)=> {
if(match == "1" && m.quoted.text.includes("𝑡𝑖𝑡𝑙𝑒 :") === true){

		
try{

let final = m.quoted.message.imageMessage.caption.split("┠ ")[1] 
final = final.replace("𝑡𝑖𝑡𝑙𝑒 :", "")
let title = final;
let data = await getData(title);

return await message.client.sendMessage(message.jid , {audio: data , mimetype: "audio/mpeg"} ,{quoted: m})

}catch(e){
return e
}
}
})
