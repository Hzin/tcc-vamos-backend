import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Tournament from '../models/Tournament';
import TournamentColumns from '../models/TournamentColumns';

class FindTournamentColumnsService {
  public async execute(id_tournament: string): Promise<TournamentColumns> {
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

    return tournamentColumns;
  }
}

export default FindTournamentColumnsService;
