import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import User from '../models/User';
import Tournament from '../models/Tournament';
import TournamentParticipants from '../models/TournamentParticipant';

interface Request {
  id_user: string;
  id_tournament: string;
}

class CheckUserIsKickedFromTournamentService {
  public async execute({ id_user, id_tournament }: Request): Promise<boolean> {
    const usersRepository = getRepository(User);
    const tournamentsRepository = getRepository(Tournament);
    const TournamentsParticipantsRepository = getRepository(
      TournamentParticipants,
    );

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const tournament = await tournamentsRepository.findOne({
      where: { id_tournament },
    });

    if (!tournament) {
      throw new AppError('Tournament does not exist.');
    }

    const userInTournamentParticipants = await TournamentsParticipantsRepository.findOne(
      {
        where: { user, tournament },
      },
    );

    if (!userInTournamentParticipants) {
      throw new AppError('User is not in this tournament.');
    }

    return userInTournamentParticipants.user_kicked;
  }
}

export default CheckUserIsKickedFromTournamentService;
