
const { getDevice } = require("@whiskeysockets/baileys");
const { command } = require("../lib");

command({
  pattern: "user",
  fromMe: true
}, async (message, match, m) => {
  let bb = await getDevice(message.reply_message.key.id);

  return message.client.sendMessage(message.jid, { text: `Phone: ${bb}` }, { quoted: m });
});
