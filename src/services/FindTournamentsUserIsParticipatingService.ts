import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import TournamentParticipant from '../models/TournamentParticipant';
import Tournament from '../models/Tournament';

class FindTournamentsUserIsParticipatingService {
  public async execute(id_user: string): Promise<TournamentParticipant[]> {
    const tournamentParticipantRepository = getRepository(
      TournamentParticipant,
    );
    const usersRepository = getRepository(User);
    const tournamentsRepository = getRepository(Tournament);

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const acceptedTournamentsInvitesOfUser = await tournamentParticipantRepository.find(
      {
        where: { user, user_accepted_invite: true },
      },
    );

    return acceptedTournamentsInvitesOfUser;
  }
}

export default FindTournamentsUserIsParticipatingService;
