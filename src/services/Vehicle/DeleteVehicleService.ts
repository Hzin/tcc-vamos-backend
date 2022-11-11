import { getRepository } from 'typeorm';

import Vehicle from '../../models/Vehicle';
import FindVehicleService from './FindVehicleService';

class DeleteVehicleService {
  public async execute(vehicle_plate: string): Promise<void> {
    const vehiclesRepository = getRepository(Vehicle)

    const findVehicleService = new FindVehicleService()
    const vehicle = await findVehicleService.execute(vehicle_plate)

    await vehiclesRepository.remove(vehicle)
  }
}

export default DeleteVehicleService;
