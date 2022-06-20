import { Router } from 'express';
import { getRepository } from 'typeorm';
import Van from '../models/Van';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import FindVanService from '../services/FindVanService';
import CreateVanService from '../services/CreateVanService';
import UpdateVanService from '../services/UpdateVanService';
import VanLocator from '../models/VanLocator';
import FindVanLocatorService from '../services/FindVanLocatorService';
import CreateVanLocatorService from '../services/CreateVanLocatorService';
import UpdateVanLocatorService from '../services/UpdateVanLocatorService';

const vansRouter = Router();

vansRouter.get('/list', async (request, response) => {
  const vansRepository = getRepository(Van);

  const vans = await vansRepository.find();

  return response.json({ data: vans });
});

vansRouter.get('/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findVanService = new FindVanService();

  const van = await findVanService.execute(id);

  return response.json({ data: van });
});

vansRouter.post('/', async (request, response) => {
  const { plate, brand, model, seats_number } = request.body;

  const createVanService = new CreateVanService();

  const van = await createVanService.execute({
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

    return response.json({
      message: 'Informações da van atualizadas com sucesso.',
    });
  },
);

// locadores de van
vansRouter.get('/locator/list', async (request, response) => {
  const vanLocatorsRepository = getRepository(VanLocator);

  const vansLocators = await vanLocatorsRepository.find();

  return response.json({ data: vansLocators });
});

vansRouter.get(
  '/locator/:id',
  ensureAuthenticated,
  async (request, response) => {
    const { id } = request.params;

    const findVanLocatorService = new FindVanLocatorService();

    const vanLocator = await findVanLocatorService.execute(id);

    return response.json({ data: vanLocator });
  },
);

vansRouter.post('/locator/:id_van', async (request, response) => {
  const { name, address, complement, city, state } = request.body;

  const { id_van } = request.params;

  const createVanLocatorService = new CreateVanLocatorService();

  const vanLocator = await createVanLocatorService.execute({
    id_van,
    name,
    address,
    complement,
    city,
    state,
  });

  return response.json({
    message: 'Locador da van configurado com sucesso.',
    data: vanLocator,
  });
});

vansRouter.patch(
  '/locator/edit/:id_van',
  ensureAuthenticated,
  async (request, response) => {
    const { name, address, complement, city, state } = request.body;

    const { id_van } = request.params;

    const updateVanLocatorService = new UpdateVanLocatorService();

    await updateVanLocatorService.execute({
      id_van,
      name,
      address,
      complement,
      city,
      state,
    });

    return response.json({
      message: 'Informações da van atualizadas com sucesso.',
    });
  },
);

export default vansRouter;
