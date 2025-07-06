const { command }= require("../lib");
const { exec } = require("child_process");

command (
    {
        pattern: "run",
        fromMe: true,
        desc: "Run linux machine",
        type: "machine"
    },
    async (message, match,m) => {
    	if(!match) return;
        exec(match, (error, stdout, stderr) => {
            if (error) {
                return message.reply(`Error: ${error.message}`);
            }

            if (stderr) {
                return message.reply(`Error: ${stderr}`);
            }

            return message.reply(`Output: ${stdout}`);
        });
    }
);
