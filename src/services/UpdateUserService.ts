import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Social from '../models/Social';

interface Request {
  id_user: string;
  name: string;
  username: string;
  bio: string;
  email: string;
  birth_date: string;
}

class UpdateUserService {
  public async execute({ id_user, name, username, bio, email, birth_date }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    const socialRepository = getRepository(Social);

    const user = await usersRepository.findOne({
      where: { id_user: id_user }
    });

    if (!user) {
      throw new AppError('User does not exist.');
    };

    user.name = name;
    user.bio = bio;
    user.birth_date = new Date(birth_date); // TODO, funciona?

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserService;
