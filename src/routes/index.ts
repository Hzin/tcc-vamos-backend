import { Router } from 'express';
import searchRoutes from './search.routes';

import sessionsRouter from './sessions.routes';
import transportesRouter from './transportes.routes';
import usersRouter from './users.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/search', searchRoutes);
routes.use('/transportes', transportesRouter);

export default routes;
