import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Tournament from '../models/Tournament';

class FindTournamentService {
  public async execute(id: string): Promise<Tournament> {
    const tournamentsRepository = getRepository(Tournament);

    const tournament = await tournamentsRepository.findOne({
      where: { id_tournament: id },
    });

    if (!tournament) {
      throw new AppError('Tournament does not exist.');
    }

    return tournament;
  }
}

export default FindTournamentService;
