import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import { createConnection } from "typeorm";

import routes from './routes';
import AppError from './errors/AppError';

import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

createConnection();

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

const port = 3333

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}!`);
});
