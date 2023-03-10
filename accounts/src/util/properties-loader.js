const dotenv = require('dotenv');
const path = require('path');

const CONFIG_HOME = '../../config';
const ENV = process.env.NODE_ENV ?? 'dev';

// env files are in root/config/
const getAbsolutePath = (relative) => path.resolve(__dirname, relative);

if (ENV.toLowerCase() !== 'prod') {
  const configFile = `${CONFIG_HOME}/.${ENV.toLowerCase()}.env`;
  dotenv.config({ path: getAbsolutePath(configFile) });
} else {
  dotenv.config({ path: getAbsolutePath(`${CONFIG_HOME}/.env`) });
}

module.exports = {
  APP_ENV: ENV.toLowerCase(),
  APP_PORT: process.env.APP_PORT,
  MONGO_URL: process.env.MONGO_URL,
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  MONGO_DB_AUTH_SOURCE: process.env.MONGO_DB_AUTH_SOURCE,
  JWT_SECRET: process.env.JWT_SECRET,
  VERIFY_MAIL_USERNAME: process.env.VERIFY_MAIL_USERNAME,
  VERIFY_MAIL_PASSWORD: process.env.VERIFY_MAIL_PASSWORD,
  VERIFY_MAIL_CLIENT_ID: process.env.VERIFY_MAIL_CLIENT_ID,
  VERIFY_MAIL_CLIENT_SECRET: process.env.VERIFY_MAIL_CLIENT_SECRET,
  VERIFY_MAIL_REFRESH_TOKEN: process.env.VERIFY_MAIL_REFRESH_TOKEN,
  VERIFY_SENDER_EMAIL: process.env.VERIFY_SENDER_EMAIL,
};
