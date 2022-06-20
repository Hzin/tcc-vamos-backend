import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';

class CreateUserService {
  public async execute(id: string): Promise<User> {
    const usersRepository = getRepository(User);

    let user = await usersRepository.findOne({
      where: { id_user: id },
    });

    if (!user) {
      throw new AppError('Usuário não existe.');
    }

    return user;
  }
}

export default CreateUserService;
