const { decodeJid } = require("../functions");
const ut = require("util");
const Base = require("./Base");
const { writeExifWebp } = require("../sticker");
let config = require("../../config");
const ReplyMessage = require("./ReplyMessage");
const { generateWAMessageFromContent } = require("baileys");

class Message extends Base {
    constructor(client, data) {
        super(client);
        if (data) {
            this.data = data;
            this._patch(data);
        }
    }

    _patch(data) {
        this.user = decodeJid(this.client.user.id);
        this.key = data.key;
        this.isGroup = data.isGroup;
        this.prefix = data.prefix;
        this.id = data.key.id ?? undefined;
        this.jid = data.key.remoteJid;
        this.message = {
            key: data.key,
            message: data.message
        };
        this.pushName = data.pushName;
        this.participant = data.sender;
        this.text = data.body;
        this.fromMe = data.key.fromMe;
        this.timestamp = data.messageTimestamp;

        this.mention = data.message?.extendedTextMessage?.contextInfo?.mentionedJid || false;

        if (data.quoted && data.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            this.reply_message = new ReplyMessage(
                this.client,
                data.message.extendedTextMessage.contextInfo,
                data
            );
            this.reply_message.type = data.quoted.type || "extendedTextMessage";
            this.reply_message.mtype = data.quoted.mtype;
            this.reply_message.mimetype = data.quoted.text?.mimetype || "text/plain";
            this.reply_message.key = data.quoted.key;
            this.reply_message.message = data.quoted.message;
        } else {
            this.reply_message = false;
        }

        return super._patch(data);
    }

    async log() {
        console.log(this.data);
    }

    async tsp() {
        return `message: ${ut.inspect(this.message, { depth: null })}`;
    }

    async dta() {
        return `client: ${ut.inspect(this.data, { depth: null })}`;
    }

    async sendFile(content, options = {}) {
        let { data } = await this.client.getFile(content);
        let type = await fileType.fromBuffer(data);
        return this.client.sendMessage(
            this.jid,
            { [type.mime.split("/")[0]]: data, ...options },
            options
        );
    }

    async reply(text, opt = {}) {
        return this.client.sendMessage(
            this.jid,
            { text: require("util").format(text), ...opt },
            { quoted: this.data }
        );
    }

    async send(jid, text, opt = {}) {
        return this.client.sendMessage(
            jid,
            { text: require("util").format(text), ...opt },
            opt
        );
    }

    async sendMessage(content, opt = { packname: "IRIS-MD", author: "TSHEPANG MARTIN MASIA" }, type = "text") {
        switch (type.toLowerCase()) {
            case "text":
                return this.client.sendMessage(this.jid, { text: content, ...opt }, opt);
            case "image":
                return Buffer.isBuffer(content)
                    ? this.client.sendMessage(this.jid, { image: content, ...opt }, opt)
                    : isUrl(content)
                    ? this.client.sendMessage(this.jid, { image: { url: content }, ...opt }, opt)
                    : null;
            case "video":
                return Buffer.isBuffer(content)
                    ? this.client.sendMessage(this.jid, { video: content, ...opt }, opt)
                    : isUrl(content)
                    ? this.client.sendMessage(this.jid, { video: { url: content }, ...opt }, opt)
                    : null;
            case "audio":
                return Buffer.isBuffer(content)
                    ? this.client.sendMessage(this.jid, { audio: content, ...opt }, opt)
                    : isUrl(content)
                    ? this.client.sendMessage(this.jid, { audio: { url: content }, ...opt }, opt)
                    : null;
            case "sticker":
                let { data, mime } = await this.client.getFile(content);
                if (mime === "image/webp") {
                    let buff = await writeExifWebp(data, opt);
                    return this.client.sendMessage(this.jid, { sticker: { url: buff }, ...opt }, opt);
                }
                if (mime.startsWith("video")) {
                    return this.client.sendImageAsSticker(this.jid, content, opt);
                } else if (mime.startsWith("image")) {
                    return this.client.sendImageAsSticker(this.jid, content, opt);
                }
                break;
        }
    }

async  forward(jid, message, options = {}) {
    try {
        let m = generateWAMessageFromContent(jid, message, {
            userJid: this.client.user.id,
            ...options ,
        });
        
        await this.client.relayMessage(jid, m.message, {
            messageId: m.key.id,
        });
        
    } catch (e) {
        console.log(e);
    }

}

    async sendFromUrl(url, options = {}) {
        let buff = await getBuffer(url);
        let mime = await fileType.fromBuffer(buff);
        let type = mime.mime.split("/")[0];
        if (type === "audio") options.mimetype = "audio/mpeg";
        if (type === "application") type = "document";
        return this.client.sendMessage(this.jid, { [type]: buff, ...options }, options);
    }

    async PresenceUpdate(status) {
        await this.client.sendPresenceUpdate(status, this.jid);
    }

    async delete(key) {
        await this.client.sendMessage(this.jid, { delete: key });
    }

    async updateName(name) {
        await this.client.updateProfileName(name);
    }

    async getPP(jid) {
        return await this.client.profilePictureUrl(jid, "image");
    }

    async setPP(jid, pp) {
        if (Buffer.isBuffer(pp)) {
            await this.client.updateProfilePicture(jid, pp);
        } else {
            await this.client.updateProfilePicture(jid, { url: pp });
        }
    }

    async block(jid) {
        await this.client.updateBlockStatus(jid, "block");
    }

    async unblock(jid) {
        await this.client.updateBlockStatus(jid, "unblock");
    }

    async add(jid) {
        return await this.client.groupParticipantsUpdate(this.jid, jid, "add");
    }

    async kick(jid) {
        return await this.client.groupParticipantsUpdate(this.jid, jid, "remove");
    }

    async promote(jid) {
        return await this.client.groupParticipantsUpdate(this.jid, jid, "promote");
    }

    async demote(jid) {
        return await this.client.groupParticipantsUpdate(this.jid, jid, "demote");
    }
}

module.exports = Message;
