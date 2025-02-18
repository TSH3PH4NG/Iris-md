const axios = require("axios");
const { command, getBuffer, getJson } = require("../lib");
const { fromBuffer } = require("file-type");

const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\s]+/;
const facebookRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/[^\s]+/;

command({ on: "text", fromMe: false }, async (message, match, m) => {
  if (!instagramRegex.test(match) && !facebookRegex.test(match)) return;

  try {
    if (instagramRegex.test(match)) {
      let response = await getJson(`https://api.vreden.my.id/api/igdownload?url=${match}`);
      if (response.status !== 200) return;
      let data = response.result.response.data;
      
      for (const { type, url } of data) {
        let buffer = await getBuffer(url);
        if (type === "image") {
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
      let { data } = await axios.get(`https://diegoson-naxordeve.hf.space/facebook?url=${match}`);
      let videoUrl = data.data["720p (HD)"] || data.data["360p (SD)"];
      if (!videoUrl) return;
      
      let buffer = await getBuffer(videoUrl);
      await message.client.sendMessage(
        message.jid,
        { video: buffer, mimetype: "video/mp4", caption: "title: *©Tshepang Masia*" },
        { quoted: m }
      );
    }
  } catch (error) {
    message.reply("Error processing request:", error);
  }
});
