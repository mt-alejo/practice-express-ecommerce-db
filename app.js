import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './utils/config.js';
import logger from './utils/logger.js';
import middleware from './utils/middleware.js';
import routerApi from './controllers/index.js';
import morgan from 'morgan';

const app = express();

mongoose.set('strictQuery', false);

logger.info('Connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.info('Error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());

if (config.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

routerApi(app);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
