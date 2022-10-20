import fs from 'fs'

import { vehiclesRoutesDocumentPostPath } from '../constants/multerConfig';
import VehicleDocument from '../models/VehicleDocument';

import CreateVehicleDocumentService from './CreateVehicleDocument';

interface Request {
  vehicle_plate: string,
  document_type: string,
  fileName: string,
  originalFileName: string
}

class UploadVehicleDocumentFileService {
  public async execute({
    vehicle_plate, document_type, fileName, originalFileName
  }: Request): Promise<VehicleDocument> {
    const fileExtension = originalFileName.split('.').at(-1)
    document_type = document_type.toUpperCase()

    // rename file
    // <timestamp>-<vehicle_plate>-<document_type>.<file_extension>
    const finalFilename = `${fileName}-${vehicle_plate}-${document_type}.${fileExtension}`
    let savedFileName = fileName

    try {
      fs.renameSync(`${vehiclesRoutesDocumentPostPath}/${savedFileName}`, `${vehiclesRoutesDocumentPostPath}/${finalFilename}`)
      savedFileName = finalFilename
    } catch (e) { }

    const createVehicleDocumentFileService = new CreateVehicleDocumentService();
    const vehicleDocument = await createVehicleDocumentFileService.execute({ vehicle_plate, document_type, path: savedFileName})

    return vehicleDocument
  }
}

export default UploadVehicleDocumentFileService;
