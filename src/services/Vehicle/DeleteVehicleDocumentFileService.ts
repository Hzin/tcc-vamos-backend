import fs from 'fs'
import { getRepository } from 'typeorm';

import { basePath, vehiclesRoutesDocumentPostPath } from '../../constants/multerConfig';

import VehicleDocument from '../../models/VehicleDocument';
import FindVehicleDocumentsByDocumentTypeService from './FindVehicleDocumentsByDocumentTypeService';
import StringUtils from '../Utils/String';

interface Request {
  vehicle_plate: string,
  document_type: string
}

class DeleteVehicleDocumentFileService {
  public async execute({
    vehicle_plate, document_type
  }: Request): Promise<void> {
    const vehicleDocumentsRepository = getRepository(VehicleDocument)

    const findVehicleDocumentsByDocumentTypeService = new FindVehicleDocumentsByDocumentTypeService();
    const vehicleDocument = await findVehicleDocumentsByDocumentTypeService.execute(vehicle_plate, document_type);

    // console.log(vehicleDocument)

    await vehicleDocumentsRepository.remove(vehicleDocument)

    try {
      fs.unlinkSync(`${basePath}/${vehiclesRoutesDocumentPostPath}/${StringUtils.getFilenameFromPath(vehicleDocument.path)}`)
    } catch (e) { }

  }
}

export default DeleteVehicleDocumentFileService;
