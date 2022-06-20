import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Van from '../models/Van';

interface Request {
  id_user: string;
}

class CheckIfUserHasVansService {
  public async execute({ id_user }: Request): Promise<Boolean> {
    const usersRepository = getRepository(User);
    const vansRepository = getRepository(Van);

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError('O usuário informado não foi encontrado.', 404);
    }

    const vanExists = await vansRepository.findOne({
      where: { user },
    });

    return !!vanExists
  }
}

export default CheckIfUserHasVansService;
