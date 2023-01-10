const mongoose = require('mongoose');
const props = require('../util/properties-loader');
const logger = require('../util/logger');

const {
  MONGO_URL, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB_NAME, MONGO_DB_AUTH_SOURCE,
} = props;

async function connect() {
  try {
    mongoose.set('strictQuery', false);
    const connection = await mongoose.connect(MONGO_URL, {
      user: MONGO_USERNAME,
      pass: MONGO_PASSWORD,
      dbName: MONGO_DB_NAME,
      authSource: MONGO_DB_AUTH_SOURCE,
      writeConcern: { w: 1 },
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`Connected to DB on '${MONGO_URL}'`);
    return connection;
  } catch (err) {
    logger.error('DB connection failed');
    throw err;
  }
}

async function disconnect() {
  return mongoose.disconnect();
}

module.exports = {
  connect, disconnect,
};
