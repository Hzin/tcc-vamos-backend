import { getRepository } from 'typeorm';
import { VehicleDocumentStatus } from '../../enums/VehicleDocumentStatus';


import VehicleDocument from '../../models/VehicleDocument';
import FindVehicleDocumentsByDocumentTypeService from './FindVehicleDocumentsByDocumentTypeService';

interface Request {
  vehicle_plate: string;
  document_type: string;
  status: VehicleDocumentStatus;
}

class UpdateVehicleDocumentStatusService {
  public async execute({ vehicle_plate, document_type, status }: Request): Promise<VehicleDocument> {
    // document_type = document_type.toLowerCase()

    const vehicleDocumentsRepository = getRepository(VehicleDocument);

    const findVehicleDocumentsByDocumentTypeService = new FindVehicleDocumentsByDocumentTypeService()
    const vehicleDocument = await findVehicleDocumentsByDocumentTypeService.execute(vehicle_plate, document_type)

    vehicleDocument.status = status

    await vehicleDocumentsRepository.save(vehicleDocument);

    return vehicleDocument;
  }
}

export default UpdateVehicleDocumentStatusService;
