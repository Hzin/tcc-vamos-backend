import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Social from '../models/Social';

interface Request {
  id_user: string;
  background_image: string;
}

class UpdateUserBackgroundService {
  public async execute({ id_user, background_image }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    const socialRepository = getRepository(Social);

    const user = await usersRepository.findOne({
      where: { id_user: id_user }
    });

    if (!user) {
      throw new AppError('User does not exist.');
    };

    user.background_image = background_image;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserBackgroundService;
