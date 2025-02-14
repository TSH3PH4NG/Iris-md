const axios = require("axios");
const { command , getBuffer , getJson } = require("../lib");
const fetch = require("node-fetch");
const { fromBuffer } = require("file-type");


command({
on: "text",
fromMe: false
},
async(message,match,m)=>{

if (!match.includes("www.instagram.com") && !match.includes("www.facebook.com")) return;

if(match.includes("www.instagram.com")) {
	

let bb = await getJson(`https://olduser.us.kg/instagram/igdl?apikey=anya-md&url=${match}`)
let buffer = await getBuffer(bb?.InstagramLinks[0]);

let { ext } = await fromBuffer(buffer);

if(ext == "jpg"){
	
return await message.client.sendMessage(message.jid , { image: buffer , caption: "*Instagram image*"}  , {quoted: m})

}
else{
	
let buff = await getBuffer(bb?.InstagramLinks[0]);
await message.client.sendMessage(message.jid , {video: buff , mimetype: "video/mp4"}  , {quoted: m})

}/*nested if and else close*/

   }

else if(match.includes("www.facebook.com")){
 let { data } = await axios(`https://diegoson-naxordeve.hf.space/facebook?url=${match}`)



let buff = await getBuffer(data.data["720p (HD)"] || data.data["360p (SD)"]);

await message.client.sendMessage(message.jid , {video: buff , mimetype: "video/mp4", caption: `title: *©Tshepang Masia*`}  , {quoted: m})

}


})
