const { command, isUrl: checkUrl , getJson } = require("../lib");
const { proto, prepareWAMessageMedia } = require("baileys");
const axios = require("axios");
const qs = require("qs");

async function pinterest(input) {
	
  let pin = await getJson(`https://api-olive-five-53.vercel.app/pinterest?query=${input}`);
return pin;

}

command({
    pattern: "pin",
    fromMe: false,
    desc: "Search or Download from Pinterest",
    type: "search"
}, async (message, match, m) => {

    if (!match) return message.reply("_I need a query or a Pinterest link_");

    try {
        let results = await pinterest(match);
        if (!results || results.length === 0) return message.reply("_No results found_");

        const cards = await Promise.all(results.map(async (res) => {
            const media = await prepareWAMessageMedia(
                { [res.type]: { url: res.url } },
                { upload: message.client.waUploadToServer }
            );

            return {
                header: {
                    title: res.title || "Pinterest Result",
                    hasMediaAttachment: true,
                    [`${res.type}Message`]: media[`${res.type}Message`]
                },
                footer: {
                    text: "Made with  ðŸ«¶ by Tshepang"
                },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "cta_url",
                            buttonParamsJson: JSON.stringify({
                                display_text: "Open in Browser",
                                url: res.url
                            })
                        }
                    ]
                }
            };
        }));

        const interactiveMessage = proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
                text: `Pinterest results for: ${match}`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
                text: "Pinterest Downloader"
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.create({
                cards,
                messageVersion: 1
            })
        });

        return await message.client.sendMessage(
            message.jid,
            { interactiveMessage },
            { quoted: m }
        );

    } catch (e) {
        return await message.reply(e.toString());
    }
});

