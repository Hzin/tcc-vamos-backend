import { getRepository } from 'typeorm';

import AppError from '../../errors/AppError';

import Vehicle from '../../models/Vehicle';
import FindVehicleService from './FindVehicleService';

interface Request {
  oldPlate: string;
  newPlate: string;
}

class UpdateVehiclePlateService {
  public async execute({ oldPlate, newPlate }: Request): Promise<Vehicle> {
    const vehiclesRepository = getRepository(Vehicle);

    const findVehicleService = new FindVehicleService()
    const vehicle = await findVehicleService.execute(oldPlate)

    vehicle.plate = newPlate

    await vehiclesRepository.save(vehicle);

    return vehicle;
  }
}

export default UpdateVehiclePlateService;
