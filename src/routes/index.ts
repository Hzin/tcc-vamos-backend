import { Router } from 'express';

import searchRoutes from './search.routes';
import sessionsRouter from './sessions.routes';
import transportsRouter from './transports.routes';
import usersRouter from './users.routes';
import carsRouter from './cars.routes';
import vansRouter from './vans.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/search', searchRoutes);
routes.use('/transports', transportsRouter);
routes.use('/cars', carsRouter);
routes.use('/vans', vansRouter);

export default routes;
