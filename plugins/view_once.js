const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { command } = require("../lib");

command({ pattern: "vo", fromMe: true }, async (message, match, m) => {
  if (!m.quoted.message.viewOnceMessageV2) return;

  const buffer = await downloadMediaMessage(
    m.quoted,
    "buffer",
    {},
    {
      reuploadRequest: message.client.updateMediaMessage,
    }
  );

  let res;

  if (m.quoted.message.viewOnceMessageV2.message.imageMessage) {
    res = "picture";
  } else if (m.quoted.message.viewOnceMessageV2.message.videoMessage) {
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
});/*take with cred @MARTIN MASIA*/
