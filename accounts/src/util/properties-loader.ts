import dotenv from 'dotenv';
import path from 'path';

const CONFIG_HOME = '../../config';
const ENV = process.env.NODE_ENV ?? 'dev';

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
  APP_PORT: process.env.APP_PORT as string,
  MONGO_URL: process.env.MONGO_URL as string,
  MONGO_USERNAME: process.env.MONGO_USERNAME as string,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD as string,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME as string,
  MONGO_DB_AUTH_SOURCE: process.env.MONGO_DB_AUTH_SOURCE as string,
  LOGS_BASE_FOLDER: process.env.LOGS_BASE_FOLDER as string,
};
