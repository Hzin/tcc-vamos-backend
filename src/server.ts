import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import { createConnection } from "typeorm";

import routes from './routes';
import AppError from './errors/AppError';

import cors from "cors";

const app = express();

// express setup
var path = require('path');

// app.use(express.static(__dirname)); // Current directory is root
app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root

// multer setup
import bodyParser from 'body-parser';
import morgan from 'morgan';

app.use(morgan('combined'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());
app.use(routes);

createConnection();

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(202).json({
      status: 'error',
      httpCode: err.statusCode,
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
