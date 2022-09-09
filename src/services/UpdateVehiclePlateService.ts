import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Vehicle from '../models/Vehicle';

interface Request {
  oldPlate: string;
  newPlate: string;
}

class UpdateVehiclePlateService {
  public async execute({ oldPlate, newPlate }: Request): Promise<Vehicle> {
    const vehiclesRepository = getRepository(Vehicle);

    const vehicle = await vehiclesRepository.findOne({
      where: { plate: oldPlate },
    });

    if (!vehicle) {
      throw new AppError('A vehicle informada não existe.');
    }

    vehicle.plate = newPlate

    await vehiclesRepository.save(vehicle);

    return vehicle;
  }
}

export default UpdateVehiclePlateService;
