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

  app.use(express.json()) // for parsing application/json
  app.use('/api/v1', apiRouter);

  return app;
}

