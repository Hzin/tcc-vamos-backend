import { Router } from 'express';
import { getRepository } from 'typeorm';
import Van from '../models/Van';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import FindVanService from '../services/FindVanService';
import CreateVanService from '../services/CreateVanService';
import UpdateVanService from '../services/UpdateVanService';

const vansRouter = Router();

vansRouter.get('/list', async (request, response) => {
  const vansRepository = getRepository(Van);

  const vans = await vansRepository.find();

  return response.json({ data: vans });
});

vansRouter.get('/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findVan = new FindVanService();

  const van = await findVan.execute(id);

  return response.json({ data: van });
});

vansRouter.post('/', async (request, response) => {
  const { plate, brand, model, seats_number } = request.body;

  const createVan = new CreateVanService();

  const van = await createVan.execute({
    plate,
    brand,
    model,
    seats_number,
  });

  return response.json({ message: 'Van criada com sucesso.', data: van });
});

vansRouter.patch(
  '/edit/:plate',
  ensureAuthenticated,
  async (request, response) => {
    const { brand, model, seats_number } = request.body;

    const { plate } = request.params;

    const updateUserService = new UpdateVanService();

    await updateUserService.execute({
      plate,
      brand,
      model,
      seats_number,
    });

    return response.json({ message: 'Informações da van atualizadas com sucesso.' });
  },
);

export default vansRouter;
