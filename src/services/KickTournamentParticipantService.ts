import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Tournament from '../models/Tournament';
import TournamentParticipant from '../models/TournamentParticipant';

interface Request {
  id_user: string;
  id_tournament: string;
}

class KickTournamentParticipantService {
  public async execute({ id_user, id_tournament }: Request): Promise<boolean> {
    const usersRepository = getRepository(User);
    const tournamentsRepository = getRepository(Tournament);
    const tournamentParticipantsRepository = getRepository(
      TournamentParticipant,
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

    const tournamentParticipants = await tournamentParticipantsRepository.findOne(
      {
        where: { tournament, user },
      },
    );

    if (!tournamentParticipants) {
      throw new AppError('User is not invited to this tournament.');
    }

    tournamentParticipants.user_kicked = true;

    await tournamentParticipantsRepository.save(tournamentParticipants);

    return true;
  }
}

export default KickTournamentParticipantService;
