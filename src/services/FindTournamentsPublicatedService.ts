import { getRepository, Not } from 'typeorm';

import AppError from '../errors/AppError';

import Tournament from '../models/Tournament';
import User from '../models/User';

class FindTournamentService {
  public async execute(id: string): Promise<Tournament[]> {
    const tournamentsRepository = getRepository(Tournament);
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { id_user: id },
    });

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const tournaments = await tournamentsRepository.find({
      where: {user: Not (user.id_user) }
    });

    if (!tournaments) {
      throw new AppError('Tournament does not exist.');
    }

    return tournaments;
  }
}

export default FindTournamentService;
