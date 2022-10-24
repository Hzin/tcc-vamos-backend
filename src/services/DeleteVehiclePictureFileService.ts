import fs from 'fs'
import path from 'path'

import { getRepository } from 'typeorm';
import { defaultPictureVehicle } from '../constants/defaultPictures';
import { defaultVehiclePicturePath, vehiclesUploadPicturePath } from '../constants/multerConfig';

import Vehicle from '../models/Vehicle';
import FindVehicleService from './FindVehicleService';

interface Request {
  vehicle_plate: string,
}

class DeleteVehiclePictureFileService {
  public async execute({
    vehicle_plate
  }: Request): Promise<string> {
    const vehiclesRepository = getRepository(Vehicle)

    const findVehicleService = new FindVehicleService()
    const vehicle = await findVehicleService.execute(vehicle_plate)

    // TODO, não está apagando
    try {
      fs.unlinkSync(`${vehiclesUploadPicturePath}/${vehicle.picture}`)
    } catch (e) { }

    vehicle.picture = ''
    await vehiclesRepository.save(vehicle)

    return path.join(defaultVehiclePicturePath, defaultPictureVehicle)
  }
}

export default DeleteVehiclePictureFileService;
