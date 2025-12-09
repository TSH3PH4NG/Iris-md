const { command } = require("../lib");
const webp = require("node-webpmux");

command(
  {
    pattern: "take",
    fromMe: false,
  },
  async (message, match, m) => {
    if (!message.reply_message?.message?.stickerMessage) {
      return message.reply("Reply to a sticker!");
    }

    try {
      const [packname, author] = (match || "").split("|");
      const webpBuffer = await m.quoted.download();

      const json = {
        "sticker-pack-id": "https://github.com/TSH3PH4NG/Iris-md",
        "sticker-pack-name": packname || m.pushName || "Sticker",
        "sticker-pack-publisher": author || "Bot",
        emojis: [""],
      };

      const exifAttr = Buffer.from([
        0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00,
        0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
      ]);

      const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
      const exif = Buffer.concat([exifAttr, jsonBuff]);
      exif.writeUIntLE(jsonBuff.length, 14, 4);

      const img = new webp.Image();
      await img.load(webpBuffer);
      img.exif = exif;

      const modifiedBuffer = await img.save(null);

      await message.client.sendMessage(
        message.jid,
        { sticker: modifiedBuffer },
        { quoted: m }
      );

    } catch (e) {
      console.error("Error:", e);
      message.reply("⚠️ Sticker processing failed:\n" + e.message);
   
    }
  }
);
