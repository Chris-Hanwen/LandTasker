import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import config from '../app/config/app';
import apiRouter from '../app/routes/v1/api';
import cors from 'cors';

function startServer() {
  const application = express();

  application
    .listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`⚡️[server]: Server is running at http://localhost:${config.port}`);
    })
    .on('error', (e) => {
      // eslint-disable-next-line no-console
      console.log('Error', e);
    });
  return application;
}

const expressLoader = () => {
  const app = startServer();
  app.use(express.json());
  app.use(cors());
  app.use(compression());
  app.use(helmet());
  app.use(config.api.prefix, apiRouter);

  return app;
};

export default expressLoader;
