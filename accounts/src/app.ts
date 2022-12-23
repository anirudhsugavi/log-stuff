import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dbConnection from './db';
import props from './util/properties-loader';

dbConnection().then(() => {
  const app: Express = express();

  app.use(express.json());
  app.use(cors());
  app.listen(props.APP_PORT, () => {
    console.log('Listening on port', props.APP_PORT);
  });

  app.get('/', (_: Request, res: Response) => {
    res.json({ message: 'All setup!' });
  });
}).catch(err => {
  console.error('Failed to start Auth Server.');
  console.error(err);
});
