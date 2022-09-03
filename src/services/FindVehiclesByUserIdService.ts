import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import User from '../models/User';
import Vehicle from '../models/Vehicle';

class FindVehiclesByUserIdService {
  public async execute(id_user: string): Promise<Vehicle[]> {
    const usersRepository = getRepository(User);
    const vehiclesRepository = getRepository(Vehicle);

    const user = await usersRepository.findOne({
      where: { id_user }
    });

    if (!user) {
      throw new AppError('O usuário informado não existe.', 404);
    };

    const vehicle = await vehiclesRepository.find({
      where: { user }
    });

    if (!vehicle) {
      throw new AppError('Não há nenhuma vehicle cadastrada para esse usuário.');
    };

    return vehicle;
  }
}

export default FindVehiclesByUserIdService;
