import { getRepository } from 'typeorm';

import AppError from '../../errors/AppError';

import User from '../../models/User';
import Vehicle from '../../models/Vehicle';

interface Request {
  id_user: string;
}

class CheckIfUserHasVehiclesService {
  public async execute({ id_user }: Request): Promise<Boolean> {
    const usersRepository = getRepository(User);
    const vehiclesRepository = getRepository(Vehicle);

    const user = await usersRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new AppError('O usuário informado não foi encontrado.', 404);
    }

    const vehicleExists = await vehiclesRepository.findOne({
      where: { user },
    });

    return !!vehicleExists
  }
}

export default CheckIfUserHasVehiclesService;
