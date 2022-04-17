import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Tournament from '../models/Tournament';
import TournamentParticipant from '../models/TournamentParticipant';
import { request } from 'express';

interface Request {
  id_tournament: string;
  id_user: string;
  creator_id_user: string;
}

class CreateTournamentParticipantService {
  public async execute({
    id_tournament,
    id_user,
    creator_id_user,
  }: Request): Promise<TournamentParticipant> {
    const usersRepository = getRepository(User);
    const tournamentsRepository = getRepository(Tournament);
    const tournamentsParticipantRepository = getRepository(
      TournamentParticipant,
    );

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError('User does not exist.');
    }

    if (creator_id_user == user.id_user) {
      throw new AppError("You can't invite yourself.", 200);
    }

    const tournament = await tournamentsRepository.findOne({
      where: { id_tournament },
    });

    if (!tournament) {
      throw new AppError('Tournament does not exist.');
    }

    const userIsAlreadyInvited = await tournamentsParticipantRepository.findOne(
      {
        where: { user, tournament },
      },
    );

    if (userIsAlreadyInvited) {
      throw new AppError('User is already invited.', 200);
    }

    const tournamentParticipant = tournamentsParticipantRepository.create({
      tournament,
      user,
      user_accepted_invite: false,
    });

    await tournamentsParticipantRepository.save(tournamentParticipant);

    return tournamentParticipant;
  }
}

export default CreateTournamentParticipantService;
