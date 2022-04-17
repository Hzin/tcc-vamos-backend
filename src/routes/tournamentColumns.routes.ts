import { Router } from 'express';
import { getRepository } from 'typeorm';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import TournamentColumns from '../models/TournamentColumns';
import FindTournamentColumnsService from '../services/FindTournamentColumnsService';
import UpdateTournamentColumnsInitializedFlagService from '../services/UpdateTournamentColumnsInitializedFlagService';
import UpdateTournamentColumnsService from '../services/UpdateTournamentColumnsService';

const tournamentColumnsRouter = Router();

// não deve ser lançado
tournamentColumnsRouter.get('/list', async (request, response) => {
  const tournamentsColumnsRepository = getRepository(TournamentColumns);

  const tournamentsColumns = await tournamentsColumnsRepository.find();

  return response.json({ data: tournamentsColumns });
});

// colunas de um torneio específico
tournamentColumnsRouter.get(
  '/:id',
  ensureAuthenticated,
  async (request, response) => {
    const { id } = request.params;

    const findTournamentColumnsService = new FindTournamentColumnsService();

    const tournamentColumns = await findTournamentColumnsService.execute(id);

    return response.json({ data: tournamentColumns });
  },
);

// atualiza as colunas
tournamentColumnsRouter.patch(
  '/:id',
  ensureAuthenticated,
  async (request, response) => {
    const { id } = request.params;
    const { column1, column2, column3, column4 } = request.body;

    const updateTournamentColumnsService = new UpdateTournamentColumnsService();

    await updateTournamentColumnsService.execute(id, {
      column1,
      column2,
      column3,
      column4,
    });

    return response.json({
      message: 'Tournament columns updated sucessfully.',
    });
  },
);

// atualiza a flag da coluna tournament_initialized
tournamentColumnsRouter.patch(
  '/flag/:id',
  ensureAuthenticated,
  async (request, response) => {
    const { id } = request.params;
    const { flag } = request.body;

    const updateTournamentColumnsInitializedFlagService = new UpdateTournamentColumnsInitializedFlagService();

    await updateTournamentColumnsInitializedFlagService.execute(id, flag);

    return response.json({
      message: 'Tournament columns flag updated sucessfully.',
    });
  },
);

export default tournamentColumnsRouter;
