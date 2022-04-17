import { Equal, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Inventario from '../models/Inventario';
import User from '../models/User';

class FindInventarioUserService {
  public async execute(id: string): Promise<Inventario[]> {
    const inventarioRepository = getRepository(Inventario);
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { id_user: id },
    });

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const inventario = await inventarioRepository.find({
      where: {user: Equal (user.id_user) }
    });

    if (!inventario) {
      throw new AppError('Tournament does not exist.');
    }

    return inventario;
  }
}

export default FindInventarioUserService;
