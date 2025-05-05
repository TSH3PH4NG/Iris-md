const {
    Sequelize
} = require('sequelize');
const fs = require('fs');
const toBool = (x) => x === 'true';


if (fs.existsSync('config.env')) {
    require('dotenv').config({
        path: './config.env'
    });
}

const DATABASE_URL = process.env.DATABASE_URL || './resources/database.db';
const initialSudo = process.env.SUDO ? process.env.SUDO.split(',') : ['27828418477'];

global.config = {
  ANTILINK: process.env.ANTI_LINK === 'true' || false,
  ALWAYS_ONLINE: process.env.ALWAYS_ONLINE === 'true' || false,
  LOGS: process.env.LOGS === 'true' || true,
  ANTILINK_ACTION: process.env.ANTI_LINK || 'kick',
  SESSION_ID: process.env.SESSION_ID || '',
  PORT: process.env.PORT || 8000,
  LANG: process.env.LANG || 'EN',
  HANDLERS: process.env.HANDLER || '.',
  RMBG_KEY: process.env.RMBG_KEY || false,
  BRANCH: 'master',
  PACKNAME: process.env.PACKNAME || '',
  WELCOME_MSG: process.env.WELCOME_MSG || 'Hi @user Welcome to @gname',
  GOODBYE_MSG: process.env.GOODBYE_MSG || 'Hi @user It was Nice Seeing you',
  AUTHOR: process.env.AUTHOR || 'Tshephang',
  SUDO: initialSudo,
  CALL_REJECT: process.env.CALL_REJECT === 'true' || false,
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || '',
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || '',
  OWNER_NAME: process.env.OWNER_NAME || 'Tshephang',
  BOT_NAME: process.env.BOT_NAME || 'iris-md',
  WORK_TYPE: process.env.WORK_TYPE || 'private',
  DATABASE_URL: process.env.DATABASE_URL || './resources/database.db',
  DATABASE: process.env.DATABASE_URL === './resources/database.db'
    ? new Sequelize({
        dialect: 'sqlite',
        storage: process.env.DATABASE_URL,
        logging: false,
      })
    : new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
          native: true,
          ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
      }),
};
