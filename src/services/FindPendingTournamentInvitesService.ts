import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TournamentParticipants from '../models/TournamentParticipant';
import TournamentParticipant from '../models/TournamentParticipant';
import User from '../models/User';

class FindPendingTournamentInvitesService {
  public async execute(id_user: string): Promise<TournamentParticipants[]> {
    const usersRepository = getRepository(User);
    const tournamentParticipantsRepository = getRepository(
      TournamentParticipant,
    );

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError('User does not exist.');
    }

    // TODO, não está filtrando certo
    const tournamentParticipants = await tournamentParticipantsRepository.find({
      where: { user, invite_refused: false, user_accepted_invite: false },
    });

    return tournamentParticipants;
  }
}

export default FindPendingTournamentInvitesService;
