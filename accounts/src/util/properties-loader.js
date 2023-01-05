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
};
