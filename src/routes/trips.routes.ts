import { Router } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import CreateUserService from '../services/CreateUserService';
import FindUserService from '../services/FindUserService';
import FindUserSocialService from '../services/FindUserSocialService';
import UpdateUserSocialService from '../services/UpdateUserSocialService';
import UpdateUserService from '../services/UpdateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import UpdateUserPasswordService from '../services/UpdateUserPasswordService';
import AuthenticateUserService from '../services/AuthenticateUserService';
import CheckIfUserHasVehiclesService from '../services/CheckIfUserHasVehiclesService';
import Trip from '../models/Trip';
import FindTripService from '../services/FindTripService';
import CreateTripService from '../services/CreateTripService';
import UpdateTripStatusService from '../services/UpdateTripStatusService';
import UpdateTripNicknameService from '../services/UpdateTripNicknameService';

const tripsRouter = Router();

interface userWithoutSensitiveInfo {
  id_user: string;
  name: string;
  email: string;
  avatar_image: string;
}

tripsRouter.get('/list', async (request, response) => {
  const tripsRepository = getRepository(Trip);

  const trips = await tripsRepository.find();

  return response.json({ data: trips });
});

tripsRouter.get('/:id', ensureAuthenticated, async (request, response) => {
  const { id } = request.params;

  const findTripService = new FindTripService();

  const trip = await findTripService.execute(id);

  return response.json({ data: trip });
});

tripsRouter.post('/', async (request, response) => {
  const { id_itinerary } = request.body;

  const createTripService = new CreateTripService();

  const trip = await createTripService.execute({
    id_itinerary
  });

  return response.json({ message: 'Viagem confirmada com sucesso!', data: trip });
});

tripsRouter.patch('/update/nickname', ensureAuthenticated, async (request, response) => {
  const { id_trip, nickname } = request.body;

  const updateTripNicknameService = new UpdateTripNicknameService();

  await updateTripNicknameService.execute({
    id_trip, nickname
  });

  return response.json({ message: 'Apelido da viagem atualizado com sucesso!' });
});

tripsRouter.patch('/update/status', ensureAuthenticated, async (request, response) => {
  const { id_trip, new_status, description } = request.body;

  const updateTripStatusService = new UpdateTripStatusService();

  await updateTripStatusService.execute({
    id_trip, new_status, description
  });

  return response.json({ message: 'Status da viagem atualizado com sucesso!' });
});

// TODO, incluir filtros
tripsRouter.get(
  '/user/:id_user',
  ensureAuthenticated,
  async (request, response) => {
    const { id_user } = request.params;

    const checkIfUserHasVehiclesService = new CheckIfUserHasVehiclesService();

    const userHasVehicles = await checkIfUserHasVehiclesService.execute({
      id_user,
    });

    return response.json({ result: userHasVehicles });
  },
);

tripsRouter.get(
  '/today',
  ensureAuthenticated,
  async (request, response) => {
    const { id_user } = request.params;

    const checkIfUserHasVehiclesService = new CheckIfUserHasVehiclesService();

    const userHasVehicles = await checkIfUserHasVehiclesService.execute({
      id_user,
    });

    return response.json({ result: userHasVehicles });
  },
);

export default tripsRouter;
