import { getRepository } from 'typeorm';

import AppError from '../../errors/AppError';

import User from '../../models/User';
import Social from '../../models/SocialInformation';

interface Request {
  id_user: string;
  avatar_image: string;
}

class UpdateUserAvatarService {
  public async execute({ id_user, avatar_image }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    const socialRepository = getRepository(Social);

    const user = await usersRepository.findOne({
      where: { id_user: id_user }
    });

    if (!user) {
      throw new AppError('User does not exist.');
    };

    user.avatar_image = avatar_image;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
