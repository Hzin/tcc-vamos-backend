import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Social from '../models/Social';

class FindUserSocialService {
  public async execute(id_user: string): Promise<Social> {
    const usersRepository = getRepository(User);
    const socialRepository = getRepository(Social);

    const user = await usersRepository.findOne({
      where: { id_user }
    });

    if (!user) {
      // TODO, fazer no front um tratamento para isso
      throw new AppError('User does not exist.');
    };

    const social = await socialRepository.findOne({
      where: { user },
    });

    if (!social) {
      // TODO, lembrar
      // muito importate colocar o código HTTP de erro
      throw new AppError('User does not have social information.', 200);
    };

    return social;
  }
}

export default FindUserSocialService;
