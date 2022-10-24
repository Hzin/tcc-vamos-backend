import fs from 'fs'

import { basePath, vehiclesUploadPicturePath } from '../constants/multerConfig';
import Vehicle from '../models/Vehicle';

import UpdateVehiclePictureService from './UpdateVehiclePictureService';

interface Request {
  vehicle_plate: string,
  fileName: string,
  originalFileName: string
}

class UploadVehiclePictureFileService {
  public async execute({
    vehicle_plate, fileName, originalFileName
  }: Request): Promise<Vehicle> {
    const fileExtension = originalFileName.split('.').at(-1)

    // rename file
    // <timestamp>-<vehicle_plate>.<file_extension>
    const finalFilename = `${fileName}-${vehicle_plate}.${fileExtension}`
    let savedFileName = fileName

    try {
      fs.renameSync(`${basePath}/${vehiclesUploadPicturePath}/${savedFileName}`, `${basePath}/${vehiclesUploadPicturePath}/${finalFilename}`)
      savedFileName = finalFilename
    } catch (e) { }

    const updateVehiclePictureService = new UpdateVehiclePictureService();
    const vehicle = await updateVehiclePictureService.execute({ vehicle_plate, path: savedFileName })

    return vehicle
  }
}

export default UploadVehiclePictureFileService;
