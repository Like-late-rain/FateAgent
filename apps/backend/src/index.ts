import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { apiRouter } from './routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3001);
const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';

app.use(
  cors({
    origin: frontendUrl,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiRouter);
app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on ${port}`);
});
