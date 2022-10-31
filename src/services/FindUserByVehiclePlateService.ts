import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import User from '../models/User';

import FindVehicleService from './FindVehicleService';

class FindUserByVehiclePlateService {
  public async execute(plate: string): Promise<User> {
    const usersRepository = getRepository(User);

    // verifica se o veículo existe
    const findVehicleService = new FindVehicleService()
    await findVehicleService.execute(plate)

    const users = await usersRepository.find()
    let flagFoundUser: User | undefined

    users.every((user) => {
      if (!user.vehicles) return

      user.vehicles.every((vehicle) => {
        if ("" + vehicle.plate === plate) {
          flagFoundUser = user
          return false
        }

        return true
      })

      if (!!flagFoundUser) {
        return false
      }
    })

    if (!flagFoundUser) throw new AppError("O veículo informado não está associado a nenhum usuário.")

    return flagFoundUser
  }
}

export default FindUserByVehiclePlateService;
