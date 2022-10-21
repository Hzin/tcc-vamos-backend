import fs from 'fs'
import { getRepository } from 'typeorm';

import { vehiclesRoutesDocumentPostPath } from '../constants/multerConfig';
import { vehicleDocumentTypes } from '../constants/vehicleDocumentTypes';

import AppError from '../errors/AppError';
import VehicleDocument from '../models/VehicleDocument';
import FindVehicleDocumentsByDocumentTypeService from './FindVehicleDocumentsByDocumentTypeService';
import FindVehicleDocumentsService from './FindVehicleDocumentsService';

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

    await vehicleDocumentsRepository.delete(vehicleDocument)

    // TODO, não está apagando
    try {
      fs.unlinkSync(`${vehiclesRoutesDocumentPostPath}/${vehicleDocument.path}`)
    } catch (e) { }
  }
}

export default DeleteVehicleDocumentFileService;
