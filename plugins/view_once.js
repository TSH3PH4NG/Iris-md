const { command } = require("../lib");

command({ pattern: "vo", fromMe: true , desc: "Decrypt view once" ,type:"user" }, async (message, match, m) => {
  if (!m.quoted.message.imageMessage?.viewOnce && !m.quoted.message.videoMessage?.viewOnce) return message.reply("Not a view once message")

  const buffer = await m.quoted.download();

  let res;

  if (m.quoted.message.imageMessage?.viewOnce) {
    res = "picture";
  } else if (m.quoted.message.videoMessage?.viewOnce) {
    res = "video";
  }

  switch (res) {
    case "picture":
      return message.client.sendMessage(
        message.jid,
        { image: buffer, mimetype: "image/jpeg" },
        { quoted: m }
      );
      break;
    case "video":
      return message.client.sendMessage(
        message.jid,
        { video: buffer, mimetype: "video/mp4" },
        { quoted: m }
      );
      break;
  
}
});

