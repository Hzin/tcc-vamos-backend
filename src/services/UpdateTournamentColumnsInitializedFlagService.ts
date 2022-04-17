import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Tournament from '../models/Tournament';
import TournamentColumns from '../models/TournamentColumns';

interface Columns {
  column1: string;
  column2: string;
  column3: string;
  column4: string;
}

class UpdateTournamentColumnsInitializedFlagService {
  public async execute(
    id_tournament: string,
    flag: string,
  ): Promise<TournamentColumns> {
    const tournamentsRepository = getRepository(Tournament);
    const tournamentColumnsRepository = getRepository(TournamentColumns);

    const tournament = await tournamentsRepository.findOne({
      where: { id_tournament },
    });

    if (!tournament) {
      throw new AppError('Tournament does not exist.');
    }

    const tournamentColumns = await tournamentColumnsRepository.findOne({
      where: { tournament },
    });

    if (!tournamentColumns) {
      throw new AppError('Tournament does not have columns.');
    }

    if (flag) tournamentColumns.tournament_initialized = true;
    else tournamentColumns.tournament_initialized = false;

    await tournamentColumnsRepository.save(tournamentColumns);

    return tournamentColumns;
  }
}

export default UpdateTournamentColumnsInitializedFlagService;
