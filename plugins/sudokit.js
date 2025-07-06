const { command } = require("../lib");

const validateNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
};

command({
    pattern: "setsudo",
    fromMe: true,
    desc: "Set sudo",
    type: "user"
}, async (message, match) => {
    if (!match) return await message.reply("_Please provide a number. Example: .setsudo 27828418477_");

    const number = match.trim()
    if (!validateNumber(number)) {
        return await message.reply("_Invalid WhatsApp number format. Example: 27828418477_");
    }

    const sudoList = global.config.SUDO || [];
    if (sudoList.includes(number)) {
        return await message.reply("_Number is already a sudo user._");
    }

    sudoList.push(number);
    global.config.SUDO = sudoList;
    await message.reply(`_Added ${number} to sudo users._`);
});

command({
    pattern: "delsudo",
    fromMe: true,
    desc: "Remove sudo",
    type: "user"
}, async (message, match) => {
    if (!match) return await message.reply("_Please provide a number. Example: .delsudo 27828418477_");

    const number = match.trim();
    const sudoList = global.config.SUDO || [];
    const index = sudoList.indexOf(number);

    if (index === -1) {
        return await message.reply("_Number is not in sudo list._");
    }

    sudoList.splice(index, 1);
    global.config.SUDO = sudoList;
    await message.reply(`_Removed ${number} from sudo users._`);
});

command({
    pattern: "getsudo",
    fromMe: true,
    desc: "List sudo users",
    type: "user"
}, async (message) => {
    const sudoList = global.config.SUDO || [];
    if (sudoList.length === 0) {
        return await message.reply("_No sudo users configured._");
    }

    const formattedList = sudoList.map(num => `• ${num}`).join('\n');
    await message.reply(`*Sudo Users:*\n${formattedList}`);
});
