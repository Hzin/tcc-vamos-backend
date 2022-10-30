
import { getRepository } from 'typeorm';
import { defaultVehiclePictureFilename, vehiclesUploadPicturePath } from '../constants/multerConfig';

import AppError from '../errors/AppError';

import Vehicle from '../models/Vehicle';

class FindVehiclesService {
  public async execute(): Promise<Vehicle[]> {
    const vehiclesRepository = getRepository(Vehicle);

    const vehicles = await vehiclesRepository.find();

    if (!vehicles) {
      throw new AppError('O veículo informado não existe.');
    };

    const newVehicles = vehicles.map((vehicle) => {
      if (!vehicle.picture) {
        vehicle.picture = `${vehiclesUploadPicturePath}/${defaultVehiclePictureFilename}`
      }

      return vehicle
    })

    return newVehicles;
  }
}

export default FindVehiclesService;
