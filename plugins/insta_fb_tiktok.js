const axios = require("axios");
const { command, getBuffer, getJson } = require("../lib");
const { fromBuffer } = require("file-type");

const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\s]+/;
const facebookRegex  = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/[^\s]+/;
const tiktokRegex    = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/[^\s]+/;

command({ on: "text", fromMe: false }, async (message, match, m) => {
  if (!instagramRegex.test(match) && !facebookRegex.test(match) && !tiktokRegex.test(match)) return;

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
      let { data } = await axios.get(`https://tshepang-yasuke-martin.hf.space/fb?url=${match}`);
      let videoUrl = data.data["720p (HD)"] || data.data["360p (SD)"];
      if (!videoUrl) return;
      
      let buffer = await getBuffer(videoUrl);
      await message.client.sendMessage(
        message.jid,
        { video: buffer, mimetype: "video/mp4" },
        { quoted: m }
      );
    } else{
let { data } = await axios.get(`https://api.vreden.my.id/api/tiktok?url=${match}`);
let vx = data.result.data;
let filter =  vx.filter(v => v.type == "nowatermark");
let buffer = await getBuffer(filter[0].url);
return message.client.sendMessage(message.jid, { video: buffer , caption: data.result.title }, { quoted: m });
   }
  } catch (error) {
    console.log("Error processing request:", error);
  }
});
