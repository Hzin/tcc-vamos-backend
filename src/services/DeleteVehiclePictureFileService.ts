import fs from 'fs'

import { getRepository } from 'typeorm';
import { basePath, defaultVehiclePicturePath, vehiclesUploadPicturePath } from '../constants/multerConfig';

import Vehicle from '../models/Vehicle';
import FindVehicleService from './FindVehicleService';
import StringUtils from './utils/String';

interface Request {
  vehicle_plate: string,
}

class DeleteVehiclePictureFileService {
  public async execute({
    vehicle_plate
  }: Request): Promise<void> {
    const vehiclesRepository = getRepository(Vehicle)

    const findVehicleService = new FindVehicleService()
    const vehicle = await findVehicleService.execute(vehicle_plate)

    try {
      fs.unlinkSync(`${basePath}/${vehiclesUploadPicturePath}/${StringUtils.getFilenameFromPath(vehicle.picture)}`)
    } catch (e) { }

    vehicle.picture = ''
    await vehiclesRepository.save(vehicle)

    return defaultVehiclePicturePath
  }
}

export default DeleteVehiclePictureFileService;
