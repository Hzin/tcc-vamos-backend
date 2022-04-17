import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import User from '../models/User';
import Follow from '../models/Follow';
import CheckUserIsFollowingUserService from './CheckUserIsFollowingUserService';

interface Request {
  id_user_following: string;
  id_user_followed: string;
}

class DeleteFollowService {
  public async execute({
    id_user_following,
    id_user_followed,
  }: Request): Promise<boolean> {
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

    if (!userIsFollowing) {
      throw new AppError('You are not following this user.');
    }

    const follow = await followsRepository.findOne({
      where: [{ user_following }, { user_followed }],
    });

    if (!follow) {
      throw new AppError('User is not following.');
    }

    await followsRepository.remove(follow);

    return true;
  }
}

export default DeleteFollowService;
