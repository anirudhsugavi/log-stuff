import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dbConnection from './db';
import props from './util/properties-loader';
import logger from './util/logger';

dbConnection().then(() => {
  const app: Express = express();

  app.use(express.json());
  app.use(cors());
  app.listen(props.APP_PORT, () => {
    logger.info(`Listening on port ${props.APP_PORT}`);
  });

  app.get('/', (_: Request, res: Response) => {
    logger.warn('some warning message');
    res.json({ message: 'All setup!' });
  });
}).catch(err => {
  logger.error('Failed to start Auth Server.');
  logger.error(err);
});
