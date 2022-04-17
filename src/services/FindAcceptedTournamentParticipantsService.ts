import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Tournament from '../models/Tournament';
// TODO, verificar pluralidade (tournamentParticipant (v, certo) != tournamentParticipants (x, errado))
import TournamentParticipant from '../models/TournamentParticipant';
import User from '../models/User';

class FindAcceptedTournamentParticipantsService {
  public async execute(id_tournament: string): Promise<User[]> {
    const tournamentsRepository = getRepository(Tournament);
    const tournamentParticipantsRepository = getRepository(
      TournamentParticipant,
    );

    const tournament = await tournamentsRepository.findOne({
      where: { id_tournament },
    });

    if (!tournament) {
      throw new AppError('Tournament does not exist.');
    }

    const tournamentParticipants = await tournamentParticipantsRepository.find({
      where: { tournament },
    });

    if (!tournamentParticipants) {
      throw new AppError('Tournament does not have participants yet.', 200);
    }

    let tournamentAcceptedParticipantsAsUsers: User[] = [];

    tournamentParticipants.map(tournamentParticipant => {
      if (tournamentParticipant.user_accepted_invite) {
        /* TODO, dar um jeito de filtrar as informações desnecessárias
        const userWithoutSensitiveInfo = {
          id_user: tournamentParticipant.user.id_user,
          name: tournamentParticipant.user.name,
          username: tournamentParticipant.user.username,
        };
        */
        tournamentAcceptedParticipantsAsUsers.push(tournamentParticipant.user);
      }
    });

    const newTournaments = tournamentParticipants.filter((element) => {
      if (!element.user_accepted_invite) return element;
    })

    return tournamentAcceptedParticipantsAsUsers;
  }
}

export default FindAcceptedTournamentParticipantsService;
