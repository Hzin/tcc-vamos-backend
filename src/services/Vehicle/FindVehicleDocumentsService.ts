import AppError from '../../errors/AppError';
import VehicleDocument from '../../models/VehicleDocument';
import FindVehicleService from './FindVehicleService';

class FindVehicleDocumentsService {
  public async execute(vehicle_plate: string): Promise<VehicleDocument[]> {
    const findVehicleService = new FindVehicleService()
    const vehicle = await findVehicleService.execute(vehicle_plate)

    if (!vehicle.documents) {
      throw new AppError("Não há documentos registrados para o veículo informado")
    }

    return vehicle.documents
  }
}

export default FindVehicleDocumentsService;
