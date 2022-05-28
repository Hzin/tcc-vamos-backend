import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import GetCarModelsService from '../services/GetCarModelsService';

const carsRouter = Router();

carsRouter.get('/list', ensureAuthenticated, async (request, response) => {
  const getCarModelsService = new GetCarModelsService();

  const carModels = await getCarModelsService.execute();

  return response.json({ data: carModels });
});

export default carsRouter;
