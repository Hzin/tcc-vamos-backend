import { getRepository } from 'typeorm';

import AppError from '../../errors/AppError';

import User from '../../models/User';
import UserSearching from '../../models/UsersSearching';
import FindUserService from './FindUserService';

interface Request {
  id_user: string;
  latitude_from: string;
  longitude_from: string;
  latitude_to: string;
  longitude_to: string;
  address_to: string
}

class CreateUserSearchingService {
  public async execute({ id_user, latitude_from, longitude_from, latitude_to, longitude_to, address_to }: Request): Promise<UserSearching> {
    const usersSearchingRepository = getRepository(UserSearching);

    const findUserService = new FindUserService()
    const user = await findUserService.execute(id_user)

    const search = usersSearchingRepository.create({
      user, latitude_from, longitude_from, latitude_to, longitude_to, address_to
    });
    await usersSearchingRepository.save(search);

    return search;
  }
}

export default CreateUserSearchingService;
