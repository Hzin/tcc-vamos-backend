import fs from 'fs'
import path from 'path'

import { basePath, vehiclesRoutesPicturesPostPath, vehiclesUploadPicturePath } from '../../constants/multerConfig';

import UpdateVehiclePictureService from './UpdateVehiclePictureService';

interface Request {
  vehicle_plate: string,
  fileName: string,
  originalFileName: string
}

class UploadVehiclePictureFileService {
  public async execute({
    vehicle_plate, fileName, originalFileName
  }: Request): Promise<string> {
    const fileExtension = originalFileName.split('.').at(-1)

    // rename file
    // <timestamp>-<vehicle_plate>.<file_extension>
    const finalFilename = `${fileName}-${vehicle_plate}.${fileExtension}`
    let savedFileName = fileName

    try {
      fs.renameSync(`${basePath}/${vehiclesUploadPicturePath}/${savedFileName}`, `${basePath}/${vehiclesUploadPicturePath}/${finalFilename}`)
      savedFileName = `${vehiclesUploadPicturePath}/${finalFilename}`
    } catch (e) { }

    const updateVehiclePictureService = new UpdateVehiclePictureService();
    const vehicle = await updateVehiclePictureService.execute({ vehicle_plate, path: savedFileName })

    // return path.join(vehiclesRoutesPicturesPostPath, vehicle.picture)
    return vehicle.picture
  }
}

export default UploadVehiclePictureFileService;
