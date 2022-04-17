import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Tournament from '../models/Tournament';
import User from '../models/User';

class FindTournamentsByUserService {
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
      where: { user }
    })

    return tournaments;
  }
}

export default FindTournamentsByUserService;
