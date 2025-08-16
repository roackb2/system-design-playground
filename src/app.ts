import express from 'express';
import apiRouter from './routes/api';

const app = express();

app.use(express.json()) // for parsing application/json
app.use('/api/v1', apiRouter);

export default app;
