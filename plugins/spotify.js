const { command, getJson } = require("../lib");

command({
  pattern: "spotify",
  fromMe: false,
  on: "text",
  desc: "Download songs from Spotify(track URLs only)",
  type: "auto"
}, async (message, match, m) => {

  if (!match) return;

  if (!/^https?:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+/.test(match)) {
    return;
  }

  try {

    let bb = await getJson(`https://api-olive-five-53.vercel.app/spotify?url=${match}`);

    await message.client.sendMessage(
      message.jid,
      {
        audio: { url: bb.data.download },
        mimetype: "audio/mpeg"
      },
      { quoted: m }
    );

  } catch (e) {
    message.reply(e);
  }

});
