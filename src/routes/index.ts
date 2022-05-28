import { Router } from 'express';

import sessionsRouter from './sessions.routes';
import usersRouter from './users.routes';
import carsRouter from './cars.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/cars', carsRouter);

export default routes;
