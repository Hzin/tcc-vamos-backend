import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Tournament from '../models/Tournament';

interface Request {
  id: string;
  name: string;
  game: string;
  description: string;
  password: string;
}

class UpdateTournamentService {
  public async execute({
    id,
    name,
    game,
    description,
    password,
  }: Request): Promise<Tournament> {
    const tournamentsRepository = getRepository(Tournament);

    const tournament = await tournamentsRepository.findOne({
      where: { id_tournament: id },
    });

    if (!tournament) {
      throw new AppError('Tournament does not exist.');
    }

    tournament.name = name;
    tournament.game = game;
    tournament.description = description;
    if (!!password) tournament.password = password;

    await tournamentsRepository.save(tournament);

    return tournament;
  }
}

export default UpdateTournamentService;
