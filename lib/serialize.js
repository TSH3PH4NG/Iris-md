/* simplicity and good health ðŸ§˜ by Tshepang */

const {
    downloadContentFromMessage,
    getContentType,
    downloadMediaMessage,
    generateWAMessageFromContent,
    proto, 
    prepareWAMessageMedia
} = require("baileys");

const pino = require("pino");
const logger = pino({ level: "silent" });


const fs = require("fs");
const fetch = require("node-fetch");
const { fromBuffer } = require("file-type");
const { parsedJid } = require("./functions")
const path = require("path");

const {
    writeExifImg,
    writeExifVid,
    imageToWebp,
    videoToWebp,
} = require("./sticker");

async function serialize(msg, conn) {
    conn.logger = {
        ...conn.logger,
        info() {
            console.log();
        },
        error() {
            console.log();
        },
        warn() {
            console.log();
        },
    };


    if (msg.key) {
        msg.id = msg.key.id;
        msg.isSelf = msg.key.fromMe;
        msg.from = msg.key.remoteJid;
        msg.isGroup = msg.from.endsWith("@g.us");
        msg.sender = msg.isGroup
            ? msg.key.participant
            : msg.isSelf
            ? conn.user.id
            : msg.from;
    }
          
    try { 
    	
    let user = parsedJid(msg.sender)[0].split("@")[0];
     msg.sudo = global.config.SUDO.some(num =>  num.includes(user)) || msg.key.fromMe
     } catch {
     msg.sudo = false;
    }

    if (msg.message) {
        msg.type = getContentType(msg.message);

        if (msg.type === "ephemeralMessage") {
            msg.message = msg.message[msg.type].message;
            const tipe = Object.keys(msg.message)[0];
            msg.type = tipe;

            if (tipe === "viewOnceMessage") {
                msg.message = msg.message[msg.type].message;
                msg.type = getContentType(msg.message);
            }
        }

        if (msg.type === "viewOnceMessage") {
            msg.message = msg.message[msg.type].message;
            msg.type = getContentType(msg.message);
        }

        try {
            msg.mentions = msg.message[msg.type]?.contextInfo?.mentionedJid || [];
        } catch {
            msg.mentions = false;
        }

        try {
            const quoted = msg.message[msg.type]?.contextInfo;
            if (quoted?.quotedMessage) {
                let type;

                if (quoted.quotedMessage["ephemeralMessage"]) {
                    type = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0];
                    msg.quoted = {
                        type: type === "viewOnceMessage" ? "view_once" : "ephemeral",
                        stanzaId: quoted.stanzaId,
                        sender: quoted.participant,
                        message: type === "viewOnceMessage"
                            ? quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage.message
                            : quoted.quotedMessage.ephemeralMessage.message,
                    };
                } else if (quoted.quotedMessage["viewOnceMessage"]) {
                    msg.quoted = {
                        type: "view_once",
                        stanzaId: quoted.stanzaId,
                        sender: quoted.participant,
                        message: quoted.quotedMessage.viewOnceMessage.message,
                    };
                } else {
                    msg.quoted = {
                        type: "normal",
                        stanzaId: quoted.stanzaId,
                        sender: quoted.participant,
                        message: quoted.quotedMessage,
                    };
                }

                msg.quoted.isSelf = msg.quoted.sender === conn.user.id;
                msg.quoted.client = msg.quoted.stanzaId.length == 21 || 22 ? "BOT": "USER";
                msg.quoted.mtype = Object.keys(msg.quoted.message)[0];
                msg.quoted.text =
                    msg.quoted.message[msg.quoted.mtype]?.text ||
                    msg.quoted.message[msg.quoted.mtype]?.description ||
                    msg.quoted.message[msg.quoted.mtype]?.caption ||
                    (msg.quoted.mtype === "templateButtonReplyMessage" &&
                        msg.quoted.message[msg.quoted.mtype].hydratedTemplate
                            ?.hydratedContentText) ||
                    msg.quoted.message[msg.quoted.mtype] ||
                    "";

                msg.quoted.key = {
                    id: msg.quoted.stanzaId,
                    fromMe: msg.quoted.isSelf,
                    remoteJid: msg.from,
                };

                msg.quoted.download = async () => {
                    try {
                        const bx = await downloadMediaMessage(msg.quoted, "buffer",{ reuploadRequest: conn.updateMediaMessage });
                        return bx; // this is the buffer content
                    } catch (e) {
                        return `Reply to an audio, image or video. Feature does not apply to text`;
                    }
                };
            }
        } catch (e) {
            console.log(e);
            msg.quoted = null;
        }

        try {
            msg.body =
                msg.message.conversation ||
                msg.message[msg.type]?.text ||
                msg.message[msg.type]?.caption ||
                (msg.type === "listResponseMessage" &&
                    msg.message[msg.type].singleSelectReply.selectedRowId) ||
                (msg.type === "buttonsResponseMessage" &&
                    msg.message[msg.type].selectedButtonId) ||
                (msg.type === "templateButtonReplyMessage" &&
                    msg.message[msg.type].selectedId) ||
                false;
        } catch {
            msg.body = false;
        }

        msg.download = async () => {
            try {
                const bx = await downloadMediaMessage(msg?.quoted || msg, "buffer",{ reuploadRequest: conn.updateMediaMessage });
                return bx; // this is the buffer content
            } catch (e) {
                return `Reply to an audio, image or video. Feature does not apply to text`;
            }
        };

        conn.client = msg;
        conn.ctx = conn;


        conn.getFile = async (PATH, returnAsFilename) => {
            let res, filename;
            let data = Buffer.isBuffer(PATH)
                ? PATH
                : /^data:.*?\/.*?;base64,/i.test(PATH)
                ? Buffer.from(PATH.split`,`, "base64")
                : /^https?:\/\//.test(PATH)
                ? await (res = await fetch(PATH)).buffer()
                : fs.existsSync(PATH)
                ? ((filename = PATH), fs.readFileSync(PATH))
                : typeof PATH === "string"
                ? PATH
                : Buffer.alloc(0);

            if (!Buffer.isBuffer(data)) throw new TypeError("Result is not a buffer");

            let type = (await fromBuffer(data)) || {
                mime: "application/octet-stream",
                ext: ".bin",
            };

            if (data && returnAsFilename && !filename) {
                filename = path.join(__dirname, "../" + new Date() * 1 + "." + type.ext);
                await fs.promises.writeFile(filename, data);
            }

            return { res, filename, ...type, data };
        };

    conn.sendCard = async function(message, content = {}, options = {}) {
    const jid = message.jid;
    const client = message.client;
    const { text = "", title = "", footer = "", cards = [] } = content;
    if (!Array.isArray(cards) || cards.length === 0) throw "Cards must be non-empty";
    if (cards.length > 10) throw "Max 10 cards";
    const carousel = await Promise.all(cards.map(async c => {
        let t = c.image ? "image" : c.video ? "video" : null;
        if (!t) throw "Card needs media";
        let media = {};
        if (Buffer.isBuffer(c[t])) media[t] = c[t];
        else if (typeof c[t] === "string") media[t] = { url: c[t] };
        else if (c[t]?.url) media[t] = { url: c[t].url };
        else throw "Invalid media";
        const prep = await prepareWAMessageMedia(media, { upload: client.waUploadToServer });
        const obj = {
            header: { title: c.title || "", hasMediaAttachment: true },
            body: { text: c.body || "" },
            footer: { text: c.footer || "" }
        };
        if (t === "image") obj.header.imageMessage = prep.imageMessage;
        if (t === "video") obj.header.videoMessage = prep.videoMessage;
        if (Array.isArray(c.buttons)) {
            const btns = [];
            for (const b of c.buttons) {
                if (b.type === "quick_reply" && b.id && b.display_text)
                    btns.push({ name: "quick_reply", buttonParamsJson: JSON.stringify({ id: b.id, display_text: b.display_text }) });
                if (b.type === "cta_url" && b.url && b.display_text)
                    btns.push({ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: b.display_text, url: b.url }) });
            }
            if (btns.length) obj.nativeFlowMessage = { buttons: btns };
        }
        return obj;
    }));
    const payload = proto.Message.InteractiveMessage.create({
        body: { text },
        footer: { text: footer },
        header: title ? { title } : undefined,
        carouselMessage: { cards: carousel, messageVersion: 1 }
    });
    const msg = generateWAMessageFromContent(
        jid,
        { viewOnceMessage: { message: { interactiveMessage: payload } } },
        { userJid: client.user.id, quoted: options?.quoted || null }
    );
    await client.relayMessage(jid, msg.message, { messageId: msg.key.id });
    return msg;
};

conn.sendButton = async function(message, content = {}, options = {}) {
	
    const jid = message.jid;
	const client = message.client;
	
    if (!client.user?.id) throw new Error("Client not authenticated");

    const {
        text = "",
        caption = "",
        title = "",
        footer = "",
        buttons = [],
        hasMediaAttachment = false,
        image = null,
        video = null,
        document = null,
        mimetype = null,
        jpegThumbnail = null,
        location = null,
        product = null,
        businessOwnerJid = null,
    } = content;

    if (!Array.isArray(buttons) || !buttons.length)
        throw new Error("buttons must be non-empty");

    const interactiveButtons = [];

    for (let i = 0; i < buttons.length; i++) {
        const b = buttons[i];
        if (!b || typeof b !== "object") throw new Error(`button[${i}] invalid`);

        if (b.options && b.options.copy_code) {
            interactiveButtons.push({
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: b.options.text || "Copy",
                    copy_code: b.options.copy_code
                })
            });
            continue;
        }

        if (b.url && b.url.url) {
            interactiveButtons.push({
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: b.url.text || "Open",
                    url: b.url.url
                })
            });
            continue;
        }

        if (b.name && b.buttonParamsJson) {
            interactiveButtons.push(b);
            continue;
        }

        if (b.id || b.text || b.displayText) {
            interactiveButtons.push({
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: b.text || b.displayText || `Button ${i + 1}`,
                    id: b.id || `quick_${i + 1}`
                }),
            });
            continue;
        }

        throw new Error(`button[${i}] invalid shape`);
    }

    let msgContent = {};

    const mediaBuild = async (type, data) => {
        const media = {};
        if (Buffer.isBuffer(data)) media[type] = data;
        else if (typeof data === "string") media[type] = { url: data };
        else if (data?.url) media[type] = { url: data.url };
        return await prepareWAMessageMedia(media, { upload: client.waUploadToServer });
    };

    if (image) {
        const m = await mediaBuild("image", image);
        msgContent.header = { title, hasMediaAttachment, imageMessage: m.imageMessage };
    } else if (video) {
        const m = await mediaBuild("video", video);
        msgContent.header = { title, hasMediaAttachment, videoMessage: m.videoMessage };
    } else if (document) {
        const media = {};
        if (Buffer.isBuffer(document)) media.document = document;
        else if (typeof document === "string") media.document = { url: document };
        else if (document?.url) media.document = { url: document.url };
        if (mimetype) media.document.mimetype = mimetype;

        if (jpegThumbnail) {
            if (Buffer.isBuffer(jpegThumbnail)) media.document.jpegThumbnail = jpegThumbnail;
            else if (typeof jpegThumbnail === "string") {
                try {
                    const r = await fetch(jpegThumbnail);
                    const ab = await r.arrayBuffer();
                    media.document.jpegThumbnail = Buffer.from(ab);
                } catch {}
            }
        }

        const m = await prepareWAMessageMedia(media, { upload: client.waUploadToServer });
        msgContent.header = { title, hasMediaAttachment, documentMessage: m.documentMessage };
    } else if (location) {
        msgContent.header = {
            title: title || location.name || "Location",
            hasMediaAttachment,
            locationMessage: {
                degreesLatitude: location.degreesLatitude || 0,
                degreesLongitude: location.degreesLongitude || 0,
                name: location.name || "",
                address: location.address || "",
            },
        };
    } else if (product) {
        let productImg = null;
        if (product.productImage) {
            const m = await mediaBuild("image", product.productImage);
            productImg = m.imageMessage;
        }
        msgContent.header = {
            title: title || product.title || "Product",
            hasMediaAttachment,
            productMessage: {
                product: {
                    productImage: productImg,
                    productId: product.productId || "",
                    title: product.title || "",
                    description: product.description || "",
                    currencyCode: product.currencyCode || "USD",
                    priceAmount1000: parseInt(product.priceAmount1000) || 0,
                    retailerId: product.retailerId || "",
                    url: product.url || "",
                    productImageCount: product.productImageCount || 1,
                },
                businessOwnerJid: businessOwnerJid || product.businessOwnerJid || client.user.id,
            },
        };
    } else if (title) {
        msgContent.header = { title, hasMediaAttachment: false };
    }

    const hasMedia = !!(image || video || document || location || product);
    const bodyText = hasMedia ? caption : text || caption;

    if (bodyText) msgContent.body = { text: bodyText };
    if (footer) msgContent.footer = { text: footer };

    msgContent.nativeFlowMessage = { buttons: interactiveButtons };

    const payload = proto.Message.InteractiveMessage.create(msgContent);

    const msg = generateWAMessageFromContent(
        jid,
        { viewOnceMessage: { message: { interactiveMessage: payload } } },
        { userJid: client.user.id, quoted: options?.quoted || null }
    );

    const isGroup = jid.endsWith("@g.us");

    const nodes = [
        {
            tag: "biz",
            attrs: {},
            content: [
                {
                    tag: "interactive",
                    attrs: { type: "native_flow", v: "1" },
                    content: [
                        { tag: "native_flow", attrs: { v: "9", name: "mixed" } }
                    ],
                },
            ],
        },
    ];

    if (!isGroup) nodes.push({ tag: "bot", attrs: { biz_bot: "1" } });

    await client.relayMessage(jid, msg.message, {
        messageId: msg.key.id,
        additionalNodes: nodes,
    });

    return msg;
}
        
        conn.IAS = async (jid, buff, options = {} , q = {}) => {
            let buffer;
            if (options && (options.packname || options.author)) {
                buffer = await writeExifImg(buff, options);
            } else {
                buffer = await imageToWebp(buff);
            }
            await conn.sendMessage(
                jid,
                { sticker: buffer } , { ...q }
            );
        };

        conn.VAS = async (jid, buff, options = {} , q = {}) => {
            let buffer;
            if (options && (options.packname || options.author)) {
                buffer = await writeExifVid(buff, options);
            } else {
                buffer = await videoToWebp(buff);
            }
            await conn.sendMessage(
                jid,
                { sticker: buffer } , { ...q }
            );
        };
    }

    return msg;
}

module.exports = {
    serialize,
};
