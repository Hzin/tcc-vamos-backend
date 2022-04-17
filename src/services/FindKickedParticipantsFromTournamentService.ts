import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Tournament from '../models/Tournament';
import TournamentParticipant from '../models/TournamentParticipant';
import User from '../models/User';

class FindKickedParticipantsFromTournamentService {
  public async execute(id_tournament: string): Promise<User[]> {
    const tournamentsRepository = getRepository(Tournament);
    const TournamentParticipantsRepository = getRepository(
      TournamentParticipant,
    );

    const tournament = await tournamentsRepository.findOne({
      where: { id_tournament },
    });

    if (!tournament) {
      throw new AppError('Tournament does not exist.');
    }

    const tournamentKickedParticipants = await TournamentParticipantsRepository.find(
      {
        where: { tournament, user_kicked: true },
      },
    );

    if (!tournamentKickedParticipants) {
      throw new AppError('Tournament does not have participants.');
    }

    let tournamentKickedParticipantsAsUsers: User[] = [];

    tournamentKickedParticipants.map(element => {
      tournamentKickedParticipantsAsUsers.push(element.user);
    });

    return tournamentKickedParticipantsAsUsers;
  }
}

export default FindKickedParticipantsFromTournamentService;
