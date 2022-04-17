import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Tournament from '../models/Tournament';
import TournamentColumns from '../models/TournamentColumns';
import User from '../models/User';

interface Request {
  id_user: string;
  name: string;
  game: string;
  description: string;
  password?: string;
  number_participants: number;
}

class CreateTournamentService {
  public async execute({
    id_user,
    name,
    game,
    description,
    password,
    number_participants,
  }: Request): Promise<Tournament> {
    const tournamentsRepository = getRepository(Tournament);
    const usersRepository = getRepository(User);
    const tournamentColumnsRepository = getRepository(TournamentColumns);

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const tournament = tournamentsRepository.create({
      user,
      name,
      game,
      description,
      password,
      number_participants,
    });

    await tournamentsRepository.save(tournament);

    // já cria o registro em tournamentColumns para evitar inconsistências
    // igual foi em Users para Socials
    const tournamentColumn = tournamentColumnsRepository.create({
      tournament,
    });
    await tournamentColumnsRepository.save(tournamentColumn);

    return tournament;
  }
}

export default CreateTournamentService;
