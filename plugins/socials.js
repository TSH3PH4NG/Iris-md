const axios = require("axios")
const { command, getJson, getBuffer } = require("../lib")

const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\s]+/
const facebookRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/[^\s]+/
const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/[^\s]+/

command({
  pattern: "socials",
  on: "text",
  fromMe: false,
  desc: "TT/FB/Insta",
  type: "auto"
}, async (message, match, m) => {
  if (!match || (!instagramRegex.test(match) && !facebookRegex.test(match) && !tiktokRegex.test(match))) return

  try {
 
    if (instagramRegex.test(match)) {
      const data = await getJson(`https://api-olive-five-53.vercel.app/igdl?url=${match}`)
      for (const { link, contentType } of data) {
        const res = await axios.get(link, { responseType: "stream" })
        const msg = contentType === "image/jpeg"
          ? { image: { stream: res.data }, mimetype: "image/jpeg" }
          : { video: { stream: res.data }, mimetype: "video/mp4" }
        await message.client.sendMessage(message.jid, msg, { quoted: m })
      }

    } else if (facebookRegex.test(match)) {
      const { data } = await axios.get(`https://api-olive-five-53.vercel.app/fb?url=${match}`)
      const videoUrl = data?.data?.["720p (HD)"] || data?.data?.["360p (SD)"]
      if (!videoUrl) return
      const res = await axios.get(videoUrl, { responseType: "stream" })
      await message.client.sendMessage(
        message.jid,
        { video: { stream: res.data }, mimetype: "video/mp4" },
        { quoted: m }
      )

    } else {
      if (match === "https://www.tiktok.com/tiktoklite") 
        return message.reply("You tweaking twin, that's an app url")
      let bb = await getJson(`https://api-olive-five-53.vercel.app/tiktok?url=${match}`)
      if (!bb?.status || !bb?.downloadUrl) return
      const bx = await getBuffer(bb.downloadUrl)
      await message.client.sendMessage(
        message.jid,
        { video: bx, mimetype: "video/mp4", caption: bb.mainText || "" },
        { quoted: m }
      )
    }
  } catch (e) {
    message.reply("Error processing request")
    console.error(e)
  }
})
