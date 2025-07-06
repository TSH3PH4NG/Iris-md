const fs = require('fs');
const toBool = (x) => x === 'true';


if (fs.existsSync('config.env')) {
    require('dotenv').config({
        path: './config.env'
    });
}


const initialSudo = process.env.SUDO ? process.env.SUDO.split(',') : ['27828418477'];

global.config = {
	
  ANTILINK: process.env.ANTI_LINK === 'true' || false,
  ALWAYS_ONLINE: process.env.ALWAYS_ONLINE === 'true' || false,
  LOGS: process.env.LOGS === 'true' || true,
  ANTILINK_ACTION: process.env.ANTI_LINK || 'kick',
  SESSION_ID: process.env.SESSION_ID || '',
  PORT: process.env.PORT || 8000,
  HANDLERS: process.env.HANDLER || '.',
  BRANCH: 'master',
  PACKNAME: process.env.PACKNAME || '',
  AUTHOR: process.env.AUTHOR || 'Tshephang',
  SUDO: initialSudo,
  CALL_REJECT: process.env.CALL_REJECT === 'true' || false,
  OWNER_NAME: process.env.OWNER_NAME || 'Tshepang',
  BOT_NAME: process.env.BOT_NAME || '𝐼𝑅𝐼𝑆−𝑀𝐷',
  WORK_TYPE: process.env.WORK_TYPE || 'private',
  
};
