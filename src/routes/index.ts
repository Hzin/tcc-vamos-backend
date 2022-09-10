import { Router } from 'express';

import searchRoutes from './search.routes';
import sessionsRouter from './sessions.routes';
import itinerariesRouter from './itineraries.routes';
import usersRouter from './users.routes';
import carsRouter from './cars.routes';
import vehiclesRouter from './vehicles.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/search', searchRoutes);
routes.use('/itineraries', itinerariesRouter);
routes.use('/cars', carsRouter);
routes.use('/vehicles', vehiclesRouter);

export default routes;
