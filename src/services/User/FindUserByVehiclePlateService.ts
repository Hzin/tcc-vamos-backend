import { getRepository } from 'typeorm';
import AppError from '../../errors/AppError';
import User from '../../models/User';
import FindVehiclesByUserIdService from '../FindVehiclesByUserIdService';

import FindVehicleService from '../FindVehicleService';

class FindUserByVehiclePlateService {
  public async execute(plate: string): Promise<User> {
    const usersRepository = getRepository(User);

    // verifica se o veículo existe
    const findVehicleService = new FindVehicleService()
    await findVehicleService.execute(plate)

    const users = await usersRepository.find()

    let flagFoundUser: User | undefined

    const findVehiclesByUserIdService = new FindVehiclesByUserIdService()

    for (let i = 0; i < users.length; i++) {
      const user = users[i]

      const userVehicles = await findVehiclesByUserIdService.execute(user.id_user)

      for (let j = 0; j < userVehicles.length; j++) {
        const vehicle = userVehicles[j]

        if ("" + vehicle.plate === plate) {
          flagFoundUser = user
          break
        }
      }
    }

    if (!flagFoundUser) throw new AppError("O veículo informado não está associado a nenhum usuário.")

    return flagFoundUser
  }
}

export default FindUserByVehiclePlateService;
