import path from 'path'

import { getRepository } from 'typeorm';
import { defaultVehiclePicturePath, vehiclesRoutesPicturesPostPath } from '../constants/multerConfig';

import AppError from '../errors/AppError';

import Vehicle from '../models/Vehicle';

class FindVehicleService {
  public async execute(plate: string): Promise<Vehicle> {
    const vehiclesRepository = getRepository(Vehicle);

    const vehicle = await vehiclesRepository.findOne({
      where: { plate }
    });

    if (!vehicle) {
      throw new AppError('O veículo informado não existe.');
    };

    if (!vehicle.picture) {
      vehicle.picture = defaultVehiclePicturePath
    } else {
      vehicle.picture = path.join(vehiclesRoutesPicturesPostPath, vehicle.picture)
    }

    return vehicle;
  }
}

export default FindVehicleService;
