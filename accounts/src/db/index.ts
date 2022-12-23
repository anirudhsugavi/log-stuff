import mongoose from 'mongoose';
import props from '../util/properties-loader';

const { MONGO_URL, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB_NAME, MONGO_DB_AUTH_SOURCE } = props;

mongoose.set('strictQuery', false);

export default async function connect(): Promise<typeof mongoose> {
  try {
    console.log(MONGO_URL);
    const connection = await mongoose.connect(MONGO_URL, {
      user: MONGO_USERNAME,
      pass: MONGO_PASSWORD,
      dbName: MONGO_DB_NAME,
      authSource: MONGO_DB_AUTH_SOURCE,
      writeConcern: { w: 1 },
    });
    console.log('Connected to DB on', MONGO_URL);
    return connection;
  } catch (err) {
    console.error('DB connection failed');
    throw err;
  }
}
