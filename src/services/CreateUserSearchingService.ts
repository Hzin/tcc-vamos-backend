import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import UserSearching from '../models/UsersSearching';

interface Request {
  id_user: string;
  latitude_from: string;
  longitude_from: string;
  latitude_to: string;
  longitude_to: string;
}

class CreateUserSearchingService {
  public async execute({ id_user, latitude_from, longitude_from, latitude_to, longitude_to }: Request): Promise<UserSearching> {
    const usersRepository = getRepository(User);
    const usersSearchingRepository = getRepository(UserSearching);

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError('Usuário inválido!', 200);
    }

    const search = usersSearchingRepository.create({
      user, latitude_from, longitude_from, latitude_to, longitude_to
    });
    await usersSearchingRepository.save(search);

    return search;
  }
}

export default CreateUserSearchingService;
