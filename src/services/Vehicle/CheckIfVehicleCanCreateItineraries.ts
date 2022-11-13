import { VehicleDocumentStatus } from '../../enums/VehicleDocumentStatus';
import { VehicleDocumentType } from '../../enums/VehicleDocumentType';

import FindVehicleService from './FindVehicleService';
import Utils from '../Utils/Utils';

interface Request {
  vehicle_plate: string;
}

class CheckIfVehicleCanCreateItineraries {
  public async execute({ vehicle_plate }: Request): Promise<Boolean> {
    const findVehicleService = new FindVehicleService();
    const vehicle = await findVehicleService.execute(vehicle_plate);

    const vehicleDocuments = vehicle.documents

    if (!vehicleDocuments) return false
    if (vehicleDocuments.length !== Utils.getEnumLength(VehicleDocumentType)) return false

    return vehicleDocuments.every((document) => { return document.status == VehicleDocumentStatus.approved })
  }
}

export default CheckIfVehicleCanCreateItineraries;
