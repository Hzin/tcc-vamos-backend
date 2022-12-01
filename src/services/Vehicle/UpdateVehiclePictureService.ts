import { getRepository } from 'typeorm';

import Vehicle from '../../models/Vehicle';
import FindVehicleService from './FindVehicleService';

interface Request {
  vehicle_plate: string;
  path: string;
}

class UpdateVehiclePictureService {
  public async execute({ vehicle_plate, path }: Request): Promise<Vehicle> {
    const vehiclesRepository = getRepository(Vehicle);

    const findVehicleService = new FindVehicleService()
    const vehicle = await findVehicleService.execute(vehicle_plate)

    vehicle.picture = path

    await vehiclesRepository.save(vehicle);

    return vehicle;
  }
}

export default UpdateVehiclePictureService;
