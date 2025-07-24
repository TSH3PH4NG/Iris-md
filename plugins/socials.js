const axios = require("axios");
const { command, getJson } = require("../lib");

const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\s]+/;
const facebookRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/[^\s]+/;
const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/[^\s]+/;

command(
  {
    pattern: "socials",
    on: "text",
    fromMe: false,
    desc: "TT/FB/Insta",
    type: "auto",
  },
  async (message, match, m) => {
    if (
      !instagramRegex.test(match) &&
      !facebookRegex.test(match) &&
      !tiktokRegex.test(match)
    )
      return;

    try {
      if (instagramRegex.test(match)) {
        let data = await getJson(
          `https://api-ij32.onrender.com/igdl?url=${match}`
        );
        for (const { link, contentType } of data) {
          const response = await axios.get(link, { responseType: "arraybuffer" });
          const buffer = Buffer.from(response.data);

          if (contentType === "image/jpeg") {
            await message.client.sendMessage(
              message.jid,
              { image: buffer, caption: "*Instagram image*" },
              { quoted: m }
            );
          } else {
            await message.client.sendMessage(
              message.jid,
              { video: buffer, mimetype: "video/mp4" },
              { quoted: m }
            );
          }
        }
      } else if (facebookRegex.test(match)) {
        let { data } = await axios.get(
          `https://api-ij32.onrender.com/fb?url=${match}`
        );
        let videoUrl = data.data["720p (HD)"] || data.data["360p (SD)"];
        if (!videoUrl) return;

        const response = await axios.get(videoUrl, { responseType: "arraybuffer" });
        const buffer = Buffer.from(response.data);

        await message.client.sendMessage(
          message.jid,
          { video: buffer, mimetype: "video/mp4" },
          { quoted: m }
        );
      } else {
        if (match == "https://www.tiktok.com/tiktoklite")
          return message.reply("You tweaking twin, that's an app url");

        let { data } = await axios.get(
          `https://apis.davidcyriltech.my.id/download/tiktokv3?url=${match}`
        );
        if (data.status == false) return;

        const response = await axios.get(data.video, { responseType: "arraybuffer" });
        const buffer = Buffer.from(response.data);

        await message.client.sendMessage(
          message.jid,
          {
            video: buffer,
            mimetype: "video/mp4",
            caption: "Tiktok vid",
          },
          { quoted: m }
        );
      }
    } catch (error) {
      console.log("Error processing request:", error);
    }
  }
);
