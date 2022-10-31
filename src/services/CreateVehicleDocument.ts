import { getRepository } from 'typeorm';
import { vehicleDocumentStatus } from '../constants/vehicleDocumentStatus';

import VehicleDocument from '../models/VehicleDocument';
import DeleteVehicleDocumentFileService from './DeleteVehicleDocumentFileService';
import FindVehicleDocumentsByDocumentTypeService from './FindVehicleDocumentsByDocumentTypeService';
import FindVehicleService from './FindVehicleService';

interface Request {
  vehicle_plate: string;
  document_type: string;
  path: string;
}

class CreateVehicleDocumentService {
  public async execute({
    vehicle_plate, document_type, path
  }: Request): Promise<VehicleDocument> {
    const vehicleDocumentsRepository = getRepository(VehicleDocument)

    const findVehicleService = new FindVehicleService()
    const vehicle = await findVehicleService.execute(vehicle_plate)

    const findVehicleDocumentsByDocumentTypeService = new FindVehicleDocumentsByDocumentTypeService();

    try {
      await findVehicleDocumentsByDocumentTypeService.execute(vehicle_plate, document_type); // pode lançar exception

      const deleteVehicleDocumentFileService = new DeleteVehicleDocumentFileService()
      await deleteVehicleDocumentFileService.execute({ vehicle_plate, document_type })
    } catch { }

    const vehicleDocument = vehicleDocumentsRepository.create({
      vehicle,
      document_type,
      path,
      status: vehicleDocumentStatus.pending
    })

    await vehicleDocumentsRepository.save(vehicleDocument)

    return vehicleDocument
  }
}

export default CreateVehicleDocumentService;
