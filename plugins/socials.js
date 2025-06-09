const axios = require("axios");
const { command, getBuffer, getJson } = require("../lib");
const { fromBuffer } = require("file-type");

const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\s]+/;
const facebookRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/[^\s]+/;
const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/[^\s]+/;

command({ on: "text", fromMe: false }, async (message, match, m) => {
  if (!instagramRegex.test(match) && !facebookRegex.test(match) && !tiktokRegex.test(match)) return;

  try {
    if (instagramRegex.test(match)) {
      let data = await getJson(`https://tshepang-yasuke-martin.hf.space/igdl?url=${match}`);

      for (const { link , contentType } of data) {
        let buffer = await getBuffer(link);
        if (type === "image/jpeg") {
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
      let { data } = await axios.get(`https://tshepang-yasuke-martin.hf.space/fb?url=${match}`);
      let videoUrl = data.data["720p (HD)"] || data.data["360p (SD)"];
      if (!videoUrl) return;

      let buffer = await getBuffer(videoUrl);
      await message.client.sendMessage(
        message.jid,
        { video: buffer, mimetype: "video/mp4" },
        { quoted: m }
      );
    } else {
const { data } = await axios.get(`https://diegoson-astarl.hf.space/tiktok?url=${match}`);
    
    if (data.status !== 200 || !data.data?.hdPlayUrl) {
      return;
    }

      const videoBuffer = await getBuffer(data.data.hdPlayUrl);

        return message.client.sendMessage(
          message.jid,
          { video: videoBuffer, caption: data.data.title },
          { quoted: m }
        );
        
    }
  } catch (error) {
    console.log("Error processing request:", error);
  }
});
