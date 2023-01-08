const express = require('express');
const cors = require('cors');
const { connect, disconnect } = require('./db');
const userRouter = require('./routers/user-router');
const authRouter = require('./routers/auth-router');
const props = require('./util/properties-loader');
const logger = require('./util/logger');
const { errorHandler, errorLogger } = require('./middleware/error-handler');

const exitApp = () => {
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

connect()
  .then(() => {
    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use('/auth', authRouter);
    app.use(userRouter);
    app.use(errorLogger);
    app.use(errorHandler);
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
  .catch((err) => {
    logger.error('Failed to start Auth Server.', err);
    exitApp();
  });

process.on('SIGINT', exitApp);
