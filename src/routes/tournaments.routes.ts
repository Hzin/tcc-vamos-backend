// TODO: Arrumar a rota
import { Router } from 'express';
import { getRepository } from 'typeorm';
import { v4 } from 'uuid';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import Tournament from '../models/Tournament';
import CreateTournamentService from '../services/CreateTournamentService';
import FindTournamentsByUserService from '../services/FindTournamentsByUserService';

import FindTournamentService from '../services/FindTournamentService';
import UpdateTournamentAsEndedService from '../services/UpdateTournamentAsEnded';
import UpdateTournamentService from '../services/UpdateTournamentService';

const tournamentsRouter = Router();

// não deve ser lançado
tournamentsRouter.get('/list', async (request, response) => {
  const tournamentsRepository = getRepository(Tournament);

  const tournaments = await tournamentsRepository.find();

  return response.json({ data: tournaments });
});

tournamentsRouter.get(
  '/id/:id',
  ensureAuthenticated,
  async (request, response) => {
    let { id } = request.params;

    const findTournamentService = new FindTournamentService();
    const tournament = await findTournamentService.execute(id);

    return response.json({ data: tournament });
  },
);

tournamentsRouter.get(
  '/user',
  ensureAuthenticated,
  async (request, response) => {
    const findTournamentByUserService = new FindTournamentsByUserService();
    const tournaments = await findTournamentByUserService.execute(
      request.user.id_user,
    );

    return response.json({ data: tournaments });
  },
);

tournamentsRouter.post('/', ensureAuthenticated, async (request, response) => {
  const {
    name,
    game,
    description,
    password,
    number_participants,
  } = request.body;

  const createTournamentService = new CreateTournamentService();

  createTournamentService.execute({
    id_user: request.user.id_user,
    name,
    game,
    description,
    password,
    number_participants,
  });

  return response.json({ message: 'Tournament created sucessfully.' });
});

tournamentsRouter.patch('/edit/:id', async (request, response) => {
  const { id } = request.params;
  const { name, game, description, password } = request.body;

  const updateTournamentService = new UpdateTournamentService();

  updateTournamentService.execute({ id, name, game, description, password });

  return response.json({ message: 'Tournament updated sucessfully.' });
});

tournamentsRouter.patch('/end/:id', async (request, response) => {
  const { id } = request.params;

  const updateTournamentAsEndedService = new UpdateTournamentAsEndedService();

  await updateTournamentAsEndedService.execute({ id_tournament: id });

  return response.json({ message: 'Tournament was set as ended.' });
});

export default tournamentsRouter;
