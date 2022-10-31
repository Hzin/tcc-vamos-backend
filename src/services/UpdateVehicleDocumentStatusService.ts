import { getRepository } from 'typeorm';
import { vehicleDocumentStatus } from '../constants/vehicleDocumentStatus';


import VehicleDocument from '../models/VehicleDocument';
import FindVehicleDocumentsByDocumentTypeService from './FindVehicleDocumentsByDocumentTypeService';

interface Request {
  vehicle_plate: string;
  document_type: string;
  status: vehicleDocumentStatus;
}

class UpdateVehicleDocumentStatusService {
  public async execute({ vehicle_plate, document_type, status }: Request): Promise<VehicleDocument> {
    document_type = document_type.toLowerCase()

    const vehicleDocumentsRepository = getRepository(VehicleDocument);

    const findVehicleDocumentsByDocumentTypeService = new FindVehicleDocumentsByDocumentTypeService()
    const vehicleDocument = await findVehicleDocumentsByDocumentTypeService.execute(vehicle_plate, document_type)

    vehicleDocument.status = status

    await vehicleDocumentsRepository.save(vehicleDocument);

    return vehicleDocument;
  }
}

export default UpdateVehicleDocumentStatusService;
