import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Follow from '../models/Follow';
import User from '../models/User';

class FindUserFollowersService {
  public async execute(id_user: string): Promise<Follow[]> {
    const usersRepository = getRepository(User);
    const followRepository = getRepository(Follow);

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const followers = await followRepository.find({
      where: { user_followed: user },
    });

    return followers;
  }
}

export default FindUserFollowersService;
