const { command, getBuffer, isYT, getJson } = require("../lib");
const axios = require("axios");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

command({
    pattern: "ytv",
    on: "text",
    fromMe: false
}, async (message, match, m) => {

    if (!isYT(match)) return;

    try {
        let { video, title } = await getJson(`https://api-olive-five-53.vercel.app/download?url=${encodeURIComponent(match)}`);
        if (!video) return;

        let vid = video["720"] || video["480"];
        let codec = video?.codec || "unknown";

        if (codec === "avc1") {
            await message.client.sendMessage(
                message.jid,
                {
                    video: { url: vid },
                    mimetype: "video/mp4",
                    caption: `${title}\n\n*Made with 🫶 by Tshepang*`
                },
                { quoted: m }
            );
        } else {

            let bb = await getBuffer(vid);

            const tempInput = path.join(__dirname, "temp_video.mp4");
            const tempOutput = path.join(__dirname, "fixed_video.mp4");

            fs.writeFileSync(tempInput, bb);

            exec(`ffmpeg -i ${tempInput} -c:v libx264 -crf 23 -preset ultrafast -c:a copy ${tempOutput}`, async (error) => {

                if (error) return message.reply("Conversion failed");

                const finalBuffer = fs.readFileSync(tempOutput);

                await message.client.sendMessage(
                    message.jid,
                    {
                        video: finalBuffer,
                        mimetype: "video/mp4"
                    },
                    { quoted: m }
                );

                fs.unlinkSync(tempInput);
                fs.unlinkSync(tempOutput);
            });
        }

    } catch (e) {
        console.log(e);
    }
});
