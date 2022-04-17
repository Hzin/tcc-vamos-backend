import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Social from '../models/Social';

interface Request {
  id_user: string;
  social_network: string;
  username: string;
}

class UpdateUserSocialService {
  public async execute({
    id_user,
    social_network,
    username,
  }: Request): Promise<Social> {
    const usersRepository = getRepository(User);
    const socialRepository = getRepository(Social);

    const user = await usersRepository.findOne({
      where: { id_user: id_user },
    });

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const social = await socialRepository.findOne({
      where: { user: user },
    });

    if (!social) throw new AppError('User does not exist.');

    switch (social_network) {
      case 'telegram':
        social.telegram = username;
        break;
      case 'facebook':
        social.facebook = username;
        break;
      case 'twitter':
        social.twitter = username;
        break;
      case 'twitch':
        social.twitch = username;
        break;

      default:
        break;
    }

    await socialRepository.save(social);

    return social;
  }
}

export default UpdateUserSocialService;
