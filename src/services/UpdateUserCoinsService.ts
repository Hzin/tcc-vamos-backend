import { getRepository } from 'typeorm';
import { hash, compare } from 'bcryptjs';

import AppError from '../errors/AppError';

import User from '../models/User';
import Social from '../models/Social';

interface Request {
  id_user: string;
  quantity: number;
  operation: 'add' | 'remove';
}

class UpdateUserCoinsService {
  public async execute({
    id_user,
    quantity,
    operation,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { id_user: id_user },
    });

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const userCoinsAsNumber = parseInt(user.coins);

    if (operation == 'add')
      user.coins = (userCoinsAsNumber + quantity).toString();
    else user.coins = (userCoinsAsNumber - quantity).toString();

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserCoinsService;
