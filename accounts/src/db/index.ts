import mongoose from 'mongoose';
import props from '../util/properties-loader';
import logger from '../util/logger';

const { MONGO_URL, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB_NAME, MONGO_DB_AUTH_SOURCE } = props;

export default async function connect(): Promise<typeof mongoose> {
  try {
    mongoose.set('strictQuery', false);
    const connection = await mongoose.connect(MONGO_URL, {
      user: MONGO_USERNAME,
      pass: MONGO_PASSWORD,
      dbName: MONGO_DB_NAME,
      authSource: MONGO_DB_AUTH_SOURCE,
      writeConcern: { w: 1 },
    });
    logger.info(`Connected to DB on '${MONGO_URL}'`);
    return connection;
  } catch (err) {
    logger.error('DB connection failed');
    throw err;
  }
}
