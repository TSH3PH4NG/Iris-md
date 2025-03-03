const { command, metaData, getBuffer, ytdl, shazam } = require("../lib");
const yts = require("yt-search");
const acrcloud = require("acrcloud");
const fs = require("fs-extra");
const ffmpeg = require('fluent-ffmpeg');

command({ pattern: "find", fromMe: false, desc: "music finder" }, async (message, match, m) => {
    if (!message.reply_message.message.videoMessage && !message.reply_message.message.audioMessage)
        return await message.reply("only works on videos and audio files");

    
const audioCut = (infile, start, end, filename = "cut") => new Promise((function(output, error) {
ffmpeg(infile).setStartTime(start).setDuration(end).save(filename + ".mp3").on("error", (e => error(new Error(e.message)))).on("end", (() => {
const file = fs.readFileSync(filename + ".mp3");
output(file)
}))
}))

let buff = await m.quoted.download();
await fs.writeFileSync("temp.mp3", buff)
let cut_audio = await audioCut("temp.mp3", 0,10)


    try {
        const acr = new acrcloud({
            host: "identify-eu-west-1.acrcloud.com",
            access_key: "df8c1cffbfa4295dd40188b63d363112",
            access_secret: "d5mygczEZkPlBDRpFjwySUexQM26jix0gCmih389"
        });

        let res = await acr.identify(cut_audio);
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

        let { title, url , timestamp } = await (await yts(finder)).all[0]
        let im = await getBuffer("https://files.catbox.moe/nr8x0o.jpg");
        let  text = `
╭━━〘 𝑀𝑈𝑆𝐼𝐶 𝐹𝐼𝑁𝐷𝐸𝑅 〙
┃ 
┠ title: ${title}
┠ url: ${url}
┠ duration: ${timestamp}
┠ platform: ${platform}
┃ 
╰━━━━━━━━━━━──⊷`

        await message.client.sendMessage(message.jid, {
            text: text,
            contextInfo: {
                externalAdReply: {
                    title: `𝐓𝐒𝐇𝐄𝐏𝐀𝐍𝐆 𝐌𝐀𝐑𝐓𝐈𝐍 𝐌𝐀𝐒𝐈𝐀`,
                    mediaType: 1,
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnail: im
                }
            }
        }, { quoted: m });

        await fs.unlinkSync("temp.mp3");
        await fs.unlinkSync("cut.mp3");

    } catch (e) {
        message.reply(e);
    }
});

command({ on: "text", fromMe: false }, async (message, match, m) => {
    if (match == 1 && m.quoted.text.includes("url")) {
        try {
            let final = m.quoted.text.split("┠ ")[2];
            final = final.replace("url:", "");
            let ur_l = final;
            let data = await ytdl(ur_l);
            await message.client.sendMessage(message.jid, {
                audio: data,
                mimetype: "audio/mpeg"
            }, { quoted: m });
        } catch (e) {
            return e;
        }
    }
});
