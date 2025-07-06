const { command , commands } = require('../lib/');
const os = require('os');
const Config = require('../config');

const styles = [
    { bullet: '◦', border: '═', header: '〘', footer: '〙' },
    { bullet: '→', border: '─', header: '《', footer: '》' },
    { bullet: '•', border: '=', header: '[', footer: ']' },
    { bullet: '»', border: '─', header: '{', footer: '}' }
];
let styleIndex = 0;

command({
    pattern: 'menu',
    fromMe: false,
    desc: 'lcommands',
    dontAddCommandList: true,
    type: 'info'
}, async (message) => {
    const currentStyle = styles[styleIndex];
    styleIndex = (styleIndex + 1) % styles.length;

const categories = {};

commands.forEach(cmd => {
    if (!cmd.dontAddCommandList) {
      if (!categories[cmd.type]) {
        categories[cmd.type] = [];
      }
      let commandName;
      if (cmd.pattern instanceof RegExp) {
        commandName = cmd.pattern.toString().split(/\W+/)[1];
      } else if (typeof cmd.pattern === 'string') {
        commandName = cmd.pattern.split('|')[0].trim();
      } else {
        commandName = 'unknown';
      }
      categories[cmd.type].push({ name: commandName, desc: cmd.desc || 'No description' });
    }
  });
  
    const totalMemory = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
    const freeMemory = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
    const usedMemory = (totalMemory - freeMemory).toFixed(2);

    const formatUptime = (seconds) => {
        const pad = (s) => (s < 10 ? '0' + s : s);
        const hours = pad(Math.floor(seconds / 3600));
        const minutes = pad(Math.floor((seconds % 3600) / 60));
        const secs = pad(seconds % 60);
        return `${hours}:${minutes}:${secs}`;
    };

    const uptime = formatUptime(Math.floor(process.uptime()));

    let response = `╭${currentStyle.border.repeat(3)}${currentStyle.header} ${global.config.BOT_NAME} ${currentStyle.footer}${currentStyle.border.repeat(3)}◆➤
┃◦╭──────────────
┃◦│ Owner :  ${global.config.OWNER_NAME}
┃◦│ User : ${message.pushName}
┃◦│ Plugins : ${commands.length}
┃◦│ Runtime : ${uptime}
┃◦│ Platform : ${os.platform()}
┃◦│ Total RAM : ${totalMemory} GB
┃◦│ Node Version : ${process.version}
┃◦│
┃◦│  ⣾⣽⣻⢿⡿⣟⣯⣷⣾⣽⣻⢿⡿⣟⣯⣷
┃◦│
┃◦╰───────────────
╰${currentStyle.border.repeat(18)}◆➤\n\n`;

    for (const [type, cmds] of Object.entries(categories)) {
        response += `╭${currentStyle.border.repeat(4)}${currentStyle.header} ${type.toUpperCase()} ${currentStyle.footer}${currentStyle.border.repeat(4)}◆➤
│◦╭─────────────────`;
      
    cmds.forEach(cmd => {  
response += `\n│◦│ ${currentStyle.bullet} ${cmd.name} ❲ _*${cmd.desc}*_ ❳`;
    });
    
        response += `\n┃◦╰─────────────────
╰${currentStyle.border.repeat(19)}◆➤\n\n`;
    }
    await message.reply(response.trim());
});
