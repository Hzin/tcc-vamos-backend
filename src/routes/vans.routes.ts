import { Router } from 'express';
import { getRepository } from 'typeorm';
import Van from '../models/Van';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import FindVanService from '../services/FindVanService';
import CreateVanService from '../services/CreateVanService';
import UpdateVanService from '../services/UpdateVanService';
import UpdateVanPlateService from '../services/UpdateVanPlateService';

const vansRouter = Router();

vansRouter.get('/list', async (request, response) => {
  const vansRepository = getRepository(Van);

  const vans = await vansRepository.find();

  return response.json({ data: vans });
});

vansRouter.get('/:plate', ensureAuthenticated, async (request, response) => {
  const { plate } = request.params;

  const findVanService = new FindVanService();

  const van = await findVanService.execute(plate);

  return response.json({ data: van });
});

vansRouter.post('/', async (request, response) => {
  const {
    plate,
    brand,
    model,
    seats_number,
    locator_name,
    locator_address,
    locator_complement,
    locator_city,
    locator_state,
  } = request.body;

  const createVanService = new CreateVanService();

  const van = await createVanService.execute({
    plate,
    brand,
    model,
    seats_number,
    locator_name,
    locator_address,
    locator_complement,
    locator_city,
    locator_state,
  });

  return response.json({ message: 'Van criada com sucesso.', data: van });
});

vansRouter.patch(
  '/edit/:plate',
  ensureAuthenticated,
  async (request, response) => {
    const {
      brand,
      model,
      seats_number,
      locator_name,
      locator_address,
      locator_complement,
      locator_city,
      locator_state,
    } = request.body;

    const { plate } = request.params;

    const updateVanService = new UpdateVanService();

    await updateVanService.execute({
      plate,
      brand,
      model,
      seats_number,
      locator_name,
      locator_address,
      locator_complement,
      locator_city,
      locator_state,
    });

    return response.json({
      message: 'Informações da van atualizadas com sucesso.',
    });
  },
);

vansRouter.patch(
  '/edit/plate/:plate',
  ensureAuthenticated,
  async (request, response) => {
    const { newPlate } = request.body;

    const { plate } = request.params;

    const updateVanPlateService = new UpdateVanPlateService();

    await updateVanPlateService.execute({
      oldPlate: plate,
      newPlate,
    });

    return response.json({
      message: 'Placa da van atualizada com sucesso.',
    });
  },
);

export default vansRouter;
