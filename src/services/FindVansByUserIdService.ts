import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Van from '../models/Van';

class FindVanByUserIdService {
  public async execute(id_user: string): Promise<Van[]> {
    const usersRepository = getRepository(User);
    const vansRepository = getRepository(Van);

    const user = await usersRepository.findOne({
      where: { id_user }
    });

    if (!user) {
      throw new AppError('O usuário informado não existe.', 404);
    };

    const van = await vansRepository.find({
      where: { user }
    });

    if (!van) {
      throw new AppError('Não há nenhuma van cadastrada para esse usuário.');
    };

    return van;
  }
}

export default FindVanByUserIdService;
