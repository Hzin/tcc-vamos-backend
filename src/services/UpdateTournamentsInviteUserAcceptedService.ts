import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Tournament from '../models/Tournament';
import TournamentParticipant from '../models/TournamentParticipant';

interface Request {
  id_tournament: string;
  id_user: string;
}

class UpdateTournamentsInviteUserAcceptedService {
  public async execute({
    id_tournament,
    id_user,
  }: Request): Promise<TournamentParticipant> {
    const usersRepository = getRepository(User);
    const tournamentsRepository = getRepository(Tournament);
    const TournamentParticipantsRepository = getRepository(
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

    const tournamentInvite = await TournamentParticipantsRepository.findOne({
      where: { tournament, user, user_accepted_invite: false },
    });

    if (!tournamentInvite) {
      throw new AppError('User is not invited to this tournament.');
    }

    tournamentInvite.user_accepted_invite = true;

    await TournamentParticipantsRepository.save(tournamentInvite);

    return tournamentInvite;
  }
}

export default UpdateTournamentsInviteUserAcceptedService;
