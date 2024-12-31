/*Credit: @Aromal*/
/*Coded by Me*/

const axios = require("axios")
const { command , getBuffer } = require("../lib");
const jimp = require("jimp")


command({
on: "text",
fromMe: false
},
async(message,match,m)=>{

if (!match.includes("www.instagram.com") && !match.includes("www.facebook.com")) return;

if(match.includes("www.instagram.com")) {
	
let { data } = await axios(`https://enthusiastic-ag-lokiking-524102b4.koyeb.app/download/insta?url=${match}`)

let { url } = data.result[0]

let buff = await getBuffer(url);

await message.client.sendMessage(message.jid , {video: buff , mimetype: "video/mp4"}  , {quoted: m})
}

else if(match.includes("www.facebook.com")){
 let { data } = await axios(`https://enthusiastic-ag-lokiking-524102b4.koyeb.app/download/facebook?url=${match}`)



let buff = await getBuffer(data.result?.hd || data.result?.sd);

await message.client.sendMessage(message.jid , {video: buff , mimetype: "video/mp4", caption: `title: ${data.result?.title}\n\n*©Tshepang Masia*`}  , {quoted: m})

}


})
