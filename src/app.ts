import express from 'express';
import { getApiRouter } from './routes/api';
import { QueuePort } from './infra/queue/QueuePort';

export const getMainApp = ({
  queue
}: {
  queue: QueuePort
}) => {
  const app = express();

  const apiRouter = getApiRouter({ queue });

  // for parsing application/json
  app.use(express.json())
  // For parsing application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/v1', apiRouter);

  return app;
}

