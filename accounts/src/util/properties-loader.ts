import dotenv from 'dotenv';
import path from 'path';

const CONFIG_HOME = '../../config';
const ENV = process.env.NODE_ENV ?? 'prod';

// env files are in root/config/
const getAbsolutePath = (relative: string): string => {
  return path.resolve(__dirname, relative);
};

if (ENV.toLowerCase() !== 'prod') {
  const configFile = `${CONFIG_HOME}/.${ENV.toLowerCase()}.env`;
  dotenv.config({ path: getAbsolutePath(configFile) });
} else {
  dotenv.config({ path: getAbsolutePath(`${CONFIG_HOME}/.env`) });
}

export default {
  APP_ENV: ENV.toLowerCase(),
  APP_PORT: process.env.APP_PORT ?? 3001,
  MONGO_URL: process.env.MONGO_URL ?? '',
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  MONGO_DB_AUTH_SOURCE: process.env.MONGO_DB_AUTH_SOURCE,
  LOGS_BASE_FOLDER: process.env.LOGS_BASE_FOLDER ?? '/tmp/accounts',
};
