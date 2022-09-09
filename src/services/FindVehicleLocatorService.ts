import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Vehicle from '../models/Vehicle';
import VehicleLocator from '../models/VehicleLocator';

class FindVehicleLocatorService {
  public async execute(id_vehicle: string): Promise<VehicleLocator> {
    const vehiclesRepository = getRepository(Vehicle);
    const vehiclesLocatorsRepository = getRepository(VehicleLocator);

    const vehicle = await vehiclesRepository.findOne({
      where: { id_vehicle }
    });

    if (!vehicle) {
      throw new AppError('A Vehicle informada não existe.', 404);
    };

    return vehicle.locator;
  }
}

export default FindVehicleLocatorService;
