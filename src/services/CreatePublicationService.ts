import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import User from '../models/User';
import Publication from '../models/Publication';
import Tournament from '../models/Tournament';

interface Request {
  id_user: string;
  id_tournament: string;
}

class CreatePublicationService {
  public async execute({
    id_user,
    id_tournament
  }: Request): Promise<Publication> {
    const pubsRepository = getRepository(Publication);
    const usersRepository = getRepository(User);
    const tournamentsRepository = getRepository(Tournament);

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

    const publication = pubsRepository.create({
      tournament
    });

    await pubsRepository.save(publication);

    return publication;
  }
}

export default CreatePublicationService;
