import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import VehicleDocument from '../models/VehicleDocument';
import FindVehicleService from './FindVehicleService';

class FindVehicleDocumentsByDocumentTypeService {
  public async execute(vehicle_plate: string, document_type: string): Promise<VehicleDocument> {
    const findVehicleService = new FindVehicleService()
    const vehicle = await findVehicleService.execute(vehicle_plate)

    const vehicleDocumentsRepository = getRepository(VehicleDocument)
    const vehicleDocuments = await vehicleDocumentsRepository.findOne({
      where: { vehicle, document_type }
    })

    if (!vehicleDocuments) {
      throw new AppError("Não há documento desse tipo registrado para o veículo informado")
    }

    return vehicleDocuments
  }
}

export default FindVehicleDocumentsByDocumentTypeService;
