import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Tournament from '../models/Tournament';
import TournamentColumns from '../models/TournamentColumns';

interface Request {
  id_tournament: string;
}

class UpdateTournamentAsEndedService {
  public async execute({ id_tournament }: Request): Promise<Tournament> {
    const tournamentsRepository = getRepository(Tournament);
    const tournamentsColumnsRepository = getRepository(TournamentColumns);

    const tournament = await tournamentsRepository.findOne({
      where: { id_tournament },
    });

    if (!tournament) {
      throw new AppError('Tournament does not exist.');
    }

    const tournamentColumns = await tournamentsColumnsRepository.findOne({
      where: { tournament },
    });

    if (!tournamentColumns) {
      throw new AppError('Tournament does not have columns.');
    }

    tournamentColumns.tournament_ended = true;

    await tournamentsColumnsRepository.save(tournamentColumns);

    return tournament;
  }
}

export default UpdateTournamentAsEndedService;
