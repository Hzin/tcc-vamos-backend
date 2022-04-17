import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Follow from '../models/Follow';
import User from '../models/User';

interface Request {
  id_user: string;
}

class UpdateFollowCounterService {
  public async execute({ id_user }: Request): Promise<User> {
    const followRepository = getRepository(Follow);
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const followCount = await followRepository.count({
      where: { user_followed: user },
    });

    user.followers = followCount.toString();

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateFollowCounterService;
