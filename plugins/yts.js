const { command } = require("../lib");
const { proto, prepareWAMessageMedia } = require("baileys");
const axios = require("axios");

command({
pattern: "yts",
fromMe: false,
desc: "Search YouTube videos with cards",
type: "download"
},
async(message, match, m)=>{
if(!match) return message.reply("_i need a query_");

try {
let { data } = await axios(`https://api-olive-five-53.vercel.app/yts?q=${encodeURIComponent(match)}`);
let videos = data.slice(0, 5);

const cards = await Promise.all(videos.map(async (v) => {
const media = await prepareWAMessageMedia({ image: { url: v.thumbnail } }, { upload: message.client.waUploadToServer });
return {
header: { 
title: v.title, 
hasMediaAttachment: true, 
imageMessage: media.imageMessage 
},
body: { text: v.author?.name || "YouTube Search" },
footer: { text: "Made with 🫶 by Tshepang" },
nativeFlowMessage: {
buttons: [
{ 
name: "quick_reply", 
buttonParamsJson: JSON.stringify({ display_text: "Download", id: `.ytv ${v.url}` }) 
},
{ 
name: "cta_url", 
buttonParamsJson: JSON.stringify({ display_text: "Open Link", url: v.url }) 
}
]
}
};
}));

const interactiveMessage = proto.Message.InteractiveMessage.create({
body: proto.Message.InteractiveMessage.Body.create({ text: `Search results for: ${match}` }),
footer: proto.Message.InteractiveMessage.Footer.create({ text: "Made with 🫶 by Tshepang" }),
header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.create({ cards, messageVersion: 1 })
});

return await message.client.sendMessage(message.jid, { interactiveMessage }, { quoted: m });

} catch(e) {
await message.reply(e.toString());
}
});
