import express, { Express } from 'express';
import cors from 'cors';
import { connect, disconnect } from './db';
import props from './util/properties-loader';
import logger from './util/logger';

connect()
  .then(() => {
    const app: Express = express();

    app.use(express.json());
    app.use(cors());
    app.listen(props.APP_PORT, () => {
      logger.info(`Listening on port ${props.APP_PORT}`);
    }).on('error', (err) => {
      logger.error('Failed to start Auth Server', err);
      exitApp();
    }).on('close', () => {
      logger.debug('Exiting Auth Server');
      exitApp();
    });
  })
  .catch(err => {
    logger.error('Failed to start Auth Server.', err);
    exitApp();
  });

const exitApp = (): void => {
  disconnect()
    .then(() => {
      logger.debug('Disconnected from DB');
      process.exit();
    })
    .catch((err) => {
      logger.error('Error closing db connection', err);
      process.exit();
    });
};

process.on('SIGINT', exitApp);
