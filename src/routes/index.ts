import { Router } from 'express';

import searchRoutes from './search.routes';
import sessionsRouter from './sessions.routes';
import itinerariesRouter from './itineraries.routes';
import usersRouter from './users.routes';
import carsRouter from './cars.routes';
import vehiclesRouter from './vehicles.routes';
import tripsRouter from './trips.routes';
import passengersRouter from './passengers.routes';
import passengersRequestsRouter from './passengersRequests.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/searches', searchRoutes);
routes.use('/itineraries', itinerariesRouter);
routes.use('/cars', carsRouter);
routes.use('/vehicles', vehiclesRouter);
routes.use('/trips', tripsRouter);
routes.use('/passengersrequests', passengersRequestsRouter);
routes.use('/passengers', passengersRouter);

export default routes;
