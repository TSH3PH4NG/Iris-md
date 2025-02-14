const axios = require("axios");
const { command , getBuffer } = require("../lib");
const fetch = require("node-fetch");
const { fromBuffer } = require("file-type");


command({
on: "text",
fromMe: false
},
async(message,match,m)=>{

if (!match.includes("www.instagram.com") && !match.includes("www.facebook.com")) return;

if(match.includes("www.instagram.com")) {
	
let bb  = await ( await fetch(`https://diegoson-naxordeve.hf.space/insta_reels?url=${match}`)).json()
if(bb.error) {
bb  =  await ( await fetch(`https://diegoson-naxordeve.hf.space/insta_reels?url=${match}`)).json()
}

let buffer = await getBuffer(bb.data?.downloadURL);

let file  = await fromBuffer(buffer);

if(file.ext == "jpg"){
	
await message.client.sendMessage(message.jid , { image: buffer , caption: "*Instagram image*"}  , {quoted: m})

}
else{
	
let buff = await getBuffer(downloadURL);
await message.client.sendMessage(message.jid , {video: buff , mimetype: "video/mp4"}  , {quoted: m})

}/*nested if and else close*/

   }

else if(match.includes("www.facebook.com")){
 let { data } = await axios(`https://diegoson-naxordeve.hf.space/facebook?url=${match}`)



let buff = await getBuffer(data.data["720p (HD)"] || data.data["360p (SD)"]);

await message.client.sendMessage(message.jid , {video: buff , mimetype: "video/mp4", caption: `title: *©Tshepang Masia*`}  , {quoted: m})

}


})
