const { command, reply,  metaData, getBuffer, ytdl, shazam } = require("../lib");
const acrcloud = require("acrcloud");
const fs = require("fs-extra");
const axios = require("axios");

let tx;
command({ pattern: "find", fromMe: false, desc: "Music finder", type: "download" }, async (message, match, m) => {
    
    
let { msg , status , mime } = await reply(m, "audio&video");
if(status == 0) return message.reply(msg);
    
let buff = await m.download();
    try {
        const acr = new acrcloud({
            host: "identify-eu-west-1.acrcloud.com",
            access_key: "df8c1cffbfa4295dd40188b63d363112",
            access_secret: "d5mygczEZkPlBDRpFjwySUexQM26jix0gCmih389"
        });

        let res = await acr.identify(buff);
        let platform;
        let finder;

        try {
            finder = res.metadata.music[0].album?.name;
            platform = "acrcloud";
        } catch {
            let metadata = await shazam(buff);
            if (metadata == "Track not found.") {
                return message.reply("all attempts failed");
            }
            finder = metadata.title;
            platform = "shazam";
        }

        const { title , url , duration } = await ( await axios(`https://api-ij32.onrender.com/yts?q=${finder}`)).data[0];      
        let im = await getBuffer("https://files.catbox.moe/nr8x0o.jpg");
        tx = title;
        let  text = 
`╭━━〘 𝑀𝑈𝑆𝐼𝐶 𝐹𝐼𝑁𝐷𝐸𝑅 〙 
┠ title: ${title}
┠ duration: ${duration}
┠ platform: ${platform}
╰━━━━━━━━━━━──⊷`

        await message.client.sendButton(message, {
         image: im,
         caption: text,
         footer: "Made with 🫶 by Tshepang",
         buttons: [{
            text: "song",
         	id:`.song ${url}`,
         },
           {
            text: "video",
           	id: `.ytv ${url}`,
           },
           {
            options: {
                text: "copy_url",
                copy_code: url,
            }
           },
         ]
        }, { quoted: m });


    } catch (e) {
        message.reply(e);
    }
});
