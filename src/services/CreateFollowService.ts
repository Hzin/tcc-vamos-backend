import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import User from '../models/User';
import Follow from '../models/Follow';
import CheckUserIsFollowingUserService from './CheckUserIsFollowingUserService';

interface Request {
  id_user_following: string;
  id_user_followed: string;
}

class CreateFollowService {
  public async execute({
    id_user_following,
    id_user_followed,
  }: Request): Promise<Follow> {
    const usersRepository = getRepository(User);
    const followsRepository = getRepository(Follow);

    const user_following = await usersRepository.findOne({
      where: { id_user: id_user_following },
    });

    if (!user_following) {
      throw new AppError('User 1 does not exist.');
    }

    const user_followed = await usersRepository.findOne({
      where: { id_user: id_user_followed },
    });

    if (!user_followed) {
      throw new AppError('User 2 does not exist.');
    }

    const checkUserIsFollowingUserService = new CheckUserIsFollowingUserService();

    const userIsFollowing = await checkUserIsFollowingUserService.execute({
      id_user_following,
      id_user_followed,
    });

    if (userIsFollowing) {
      throw new AppError('You are already following this user.');
    }

    const follow = followsRepository.create({
      user_following,
      user_followed,
    });

    await followsRepository.save(follow);

    return follow;
  }
}

export default CreateFollowService;
